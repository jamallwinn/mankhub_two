'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

interface Recommendation {
 question: string
 answer: string
 recommendation: string
 type: 'wellness' | 'mental' | 'lifestyle'
}

const colorMap = {
 wellness: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900',
 mental: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900',
 lifestyle: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900'
}

const textColorMap = {
 wellness: 'text-green-800 dark:text-green-200',
 mental: 'text-blue-800 dark:text-blue-200',
 lifestyle: 'text-yellow-800 dark:text-yellow-200'
}

const badgeColorMap = {
 wellness: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
 mental: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
 lifestyle: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
}

export function PersonalizedRecommendations({ userId }: { userId: string }) {
 const [recommendations, setRecommendations] = useState<Recommendation[]>([])
 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const fetchRecommendations = useCallback(async () => {
   setIsLoading(true)
   setError(null)
   try {
     // Fetch user data from Supabase
     const { data: userData, error } = await supabase
       .from('voice_patients')
       .select('*')
       .eq('id', userId)
       .single()

     if (error) throw error

     // Generate recommendations using OpenAI API
     const response = await fetch('/api/generate-recommendations', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(userData),
     })

     if (!response.ok) throw new Error('Failed to generate recommendations')

     const newRecommendations: Recommendation[] = await response.json()
     setRecommendations(newRecommendations)
   } catch (err) {
     console.error('Error fetching recommendations:', err)
     setError('Failed to load recommendations. Please try again.')
   } finally {
     setIsLoading(false)
   }
 }, [userId])

 useEffect(() => {
   fetchRecommendations()
 }, [fetchRecommendations])

 return (
   <Card className="w-full">
     <CardHeader className="flex flex-row items-center justify-between pb-2">
       <CardTitle className="text-xl font-bold">Personalized Recommendations</CardTitle>
       <Button 
         onClick={fetchRecommendations} 
         disabled={isLoading}
         variant="ghost" 
         size="sm"
         className="h-8 w-8 p-0"
       >
         <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
         <span className="sr-only">Refresh recommendations</span>
       </Button>
     </CardHeader>
     <CardContent>
       <div className="mb-4 flex gap-2">
         {['wellness', 'mental', 'lifestyle'].map((type) => (
           <span
             key={type}
             className={`px-2 py-1 rounded-full text-xs font-medium ${
               badgeColorMap[type as keyof typeof badgeColorMap]
             }`}
           >
             {type.charAt(0).toUpperCase() + type.slice(1)}
           </span>
         ))}
       </div>

       {isLoading ? (
         <div className="flex items-center justify-center py-8">
           <div className="animate-pulse text-muted-foreground">
             Loading recommendations...
           </div>
         </div>
       ) : error ? (
         <div className="text-center text-red-500 dark:text-red-400 py-4">
           {error}
         </div>
       ) : recommendations.length === 0 ? (
         <div className="text-center text-muted-foreground py-4">
           No recommendations available. Click refresh to generate new ones.
         </div>
       ) : (
         <div className="space-y-4">
           {recommendations.map((rec, index) => (
             <div
               key={index}
               className={`p-4 rounded-lg border ${colorMap[rec.type]} transition-colors duration-200`}
             >
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <h4 className={`font-semibold ${textColorMap[rec.type]}`}>
                     {rec.question}
                   </h4>
                   <span
                     className={`px-2 py-1 rounded-full text-xs font-medium ${
                       badgeColorMap[rec.type]
                     }`}
                   >
                     {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                   </span>
                 </div>
                 <p className="text-sm text-muted-foreground">
                   Your answer: {rec.answer}
                 </p>
                 <p className={`text-sm font-medium ${textColorMap[rec.type]}`}>
                   Recommendation: {rec.recommendation}
                 </p>
               </div>
             </div>
           ))}
         </div>
       )}
     </CardContent>
   </Card>
 )
}