'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Notification } from '@/components/notification'
import { SettingsPopup } from '@/components/settings-popup'
import { supabase } from '@/lib/supabase-client'

interface User {
 id: string;
 email: string;
 firstname: string;
 lastname: string;
 user_metadata: {
   avatar_url?: string;
   [key: string]: any;
 };
 [key: string]: any;
}

export default function ProfilePage() {
 const router = useRouter()
 const [user, setUser] = useState<User | null>(null)
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [success, setSuccess] = useState<string | null>(null)
 const [showSettingsPopup, setShowSettingsPopup] = useState(false)
 const [formData, setFormData] = useState({
   firstname: '',
   lastname: '',
   email: '',
   phonenumber: '',
   citystateofresidence: '',
   avatar_url: '',
 })

 useEffect(() => {
   const getUser = async () => {
     try {
       const { data: { user }, error: authError } = await supabase.auth.getUser()
       if (authError || !user) {
         throw authError || new Error('No user found')
       }
       
       const { data: patientData, error: patientError } = await supabase
         .from('voice_patients')
         .select('*')
         .eq('id', user.id)
         .single()
       
       if (patientError) {
         console.error('Error fetching patient data:', patientError)
         throw new Error('Failed to fetch user data')
       }
       
       setUser({ ...user, ...patientData })
       setFormData({
         firstname: patientData.firstname || '',
         lastname: patientData.lastname || '',
         email: user.email || '',
         phonenumber: patientData.phonenumber || '',
         citystateofresidence: patientData.citystateofresidence || '',
         avatar_url: user.user_metadata?.avatar_url || '',
       })
     } catch (err) {
       console.error('Error fetching user:', err)
       setError(err instanceof Error ? err.message : 'An unexpected error occurred')
       router.push('/signin')
     } finally {
       setLoading(false)
     }
   }
   
   getUser()
 }, [router])

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   try {
     const file = e.target.files?.[0]
     if (!file) return

     const fileExt = file.name.split('.').pop()
     const fileName = `${Math.random()}.${fileExt}`
     const filePath = `${user?.id}/${fileName}`

     const { error: uploadError } = await supabase.storage
       .from('avatars')
       .upload(filePath, file)

     if (uploadError) throw uploadError

     const { data: { publicUrl } } = supabase.storage
       .from('avatars')
       .getPublicUrl(filePath)

     setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
   } catch (err) {
     console.error('Error uploading file:', err)
     setError('Error uploading profile image')
   }
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setSaving(true)
   setError(null)
   setSuccess(null)

   try {
     if (!user) throw new Error("User not found")

     const { error: updateError } = await supabase
       .from('voice_patients')
       .update({
         firstname: formData.firstname,
         lastname: formData.lastname,
         phonenumber: formData.phonenumber,
         citystateofresidence: formData.citystateofresidence,
       })
       .eq('id', user.id)

     if (updateError) throw updateError

     const { error: authError } = await supabase.auth.updateUser({
       data: { avatar_url: formData.avatar_url }
     })

     if (authError) throw authError

     setSuccess('Profile updated successfully!')
   } catch (err) {
     console.error('Error updating profile:', err)
     setError(err instanceof Error ? err.message : 'Error updating profile')
   } finally {
     setSaving(false)
   }
 }

 if (loading) {
   return <div>Loading...</div>
 }

 return (
   <DashboardLayout 
     user={user}
     onProfileClick={() => {}}
     onSettingsClick={() => setShowSettingsPopup(true)}
   >
     <Card className="max-w-2xl mx-auto">
       <CardHeader>
         <CardTitle>Edit Profile</CardTitle>
       </CardHeader>
       <CardContent>
         {error && <Notification type="error" message={error} />}
         {success && <Notification type="success" message={success} />}
         <form onSubmit={handleSubmit} className="space-y-6">
           <div className="flex flex-col items-center space-y-4">
             <Avatar className="h-24 w-24">
               <AvatarImage src={formData.avatar_url} alt={formData.firstname} />
               <AvatarFallback>{formData.firstname?.[0]}</AvatarFallback>
             </Avatar>
             <div>
               <Label htmlFor="avatar" className="cursor-pointer">
                 <div className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                   Change Profile Picture
                 </div>
                 <Input
                   id="avatar"
                   type="file"
                   accept="image/*"
                   className="hidden"
                   onChange={handleFileUpload}
                 />
               </Label>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <Label htmlFor="firstname">First Name</Label>
               <Input
                 id="firstname"
                 value={formData.firstname}
                 onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                 required
               />
             </div>
             <div>
               <Label htmlFor="lastname">Last Name</Label>
               <Input
                 id="lastname"
                 value={formData.lastname}
                 onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                 required
               />
             </div>
           </div>
           <div>
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               type="email"
               value={formData.email}
               disabled
             />
           </div>
           <div>
             <Label htmlFor="phone">Phone Number</Label>
             <Input
               id="phone"
               type="tel"
               value={formData.phonenumber}
               onChange={(e) => setFormData(prev => ({ ...prev, phonenumber: e.target.value }))}
             />
           </div>
           <div>
             <Label htmlFor="location">City and State</Label>
             <Input
               id="location"
               value={formData.citystateofresidence}
               onChange={(e) => setFormData(prev => ({ ...prev, citystateofresidence: e.target.value }))}
             />
           </div>
           <Button type="submit" className="w-full" disabled={saving}>
             {saving ? 'Saving...' : 'Save Changes'}
           </Button>
         </form>
       </CardContent>
     </Card>

     {showSettingsPopup && (
       <SettingsPopup 
         onClose={() => setShowSettingsPopup(false)} 
       />
     )}
   </DashboardLayout>
 )
}