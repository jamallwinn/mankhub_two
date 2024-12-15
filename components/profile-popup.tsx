import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase-client'

interface ProfilePopupProps {
  user: any
  onClose: () => void
}

export function ProfilePopup({ user, onClose }: ProfilePopupProps) {
  const [formData, setFormData] = useState({
    age: user?.age || '',
    citystateofresidence: user?.citystateofresidence || '',
    phonenumber: user?.phonenumber || '',
    lastsocialsecurity: user?.lastsocialsecurity || '',
    familyhealthconditions: user?.familyhealthconditions || '',
    currentmedications: user?.currentmedications || '',
    physicalactivity: user?.physicalactivity || '',
    mentalwellbeing: user?.mentalwellbeing || '',
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditing) return

    try {
      const { error } = await supabase
        .from('voice_patients')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error
      setIsEditing(false)
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="citystateofresidence" className="text-right">
                City/State
              </Label>
              <Input
                id="citystateofresidence"
                name="citystateofresidence"
                value={formData.citystateofresidence}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phonenumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastsocialsecurity" className="text-right">
                Last 4 SSN
              </Label>
              <Input
                id="lastsocialsecurity"
                name="lastsocialsecurity"
                value={formData.lastsocialsecurity}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="familyhealthconditions" className="text-right">
                Family Health
              </Label>
              <Textarea
                id="familyhealthconditions"
                name="familyhealthconditions"
                value={formData.familyhealthconditions}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentmedications" className="text-right">
                Medications
              </Label>
              <Textarea
                id="currentmedications"
                name="currentmedications"
                value={formData.currentmedications}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="physicalactivity" className="text-right">
                Physical Activity
              </Label>
              <Textarea
                id="physicalactivity"
                name="physicalactivity"
                value={formData.physicalactivity}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mentalwellbeing" className="text-right">
                Mental Wellbeing
              </Label>
              <Input
                id="mentalwellbeing"
                name="mentalwellbeing"
                type="number"
                min="1"
                max="10"
                value={formData.mentalwellbeing}
                onChange={handleChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsEditing(true)} disabled={isEditing}>
              Edit Profile
            </Button>
            <Button type="submit" disabled={!isEditing}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

