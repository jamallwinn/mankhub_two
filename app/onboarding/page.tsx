'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase-client'
import Loading from '@/components/loading'
import ThankYouPopup from '@/components/thank-you-popup'
import { Notification } from '@/components/notification'

const questions = [
  { key: 'age', label: "How old are you?", type: 'number' },
  { key: 'citystateofresidence', label: "What city and state do you live in?", type: 'text' },
  { key: 'phonenumber', label: "What's your phone number?", type: 'tel' },
  { key: 'lastsocialsecurity', label: "Last 4 digits of your Social Security number?", type: 'text' },
  { key: 'familyhealthconditions', label: "What health conditions have affected your family?", type: 'textarea' },
  { key: 'currentmedications', label: "Are you currently taking any medications?", type: 'textarea' },
  { key: 'physicalactivity', label: "Do you engage in regular physical activity?", type: 'textarea' },
  { key: 'mentalwellbeing', label: "How would you rate your mental well-being (1-10)?", type: 'number', min: 1, max: 10 }
]

interface PatientData {
  [key: string]: string | number | null
}

export default function OnboardingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showThankYou, setShowThankYou] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
      } else {
        setUser(user)
        // Fetch existing patient data using email
        const { data: patientData, error: fetchError } = await supabase
          .from('voice_patients')
          .select('*')
          .eq('email', user.email)
          .single()
    
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching patient data:', fetchError)
        } else if (patientData) {
          const formattedAnswers = Object.entries(patientData as PatientData).reduce<Record<string, string | number>>((acc, [key, value]) => {
            if (questions.find(q => q.key === key && q.type === 'number')) {
              acc[key] = typeof value === 'string' ? parseInt(value, 10) : Number(value ?? 0)
            } else {
              acc[key] = String(value ?? '')
            }
            return acc
          }, {})
          setAnswers(formattedAnswers)
        }
      }
    }
    checkAuth()
  }, [router])

  const handleInputChange = (value: string | number) => {
    const question = questions[currentQuestion]
    const processedValue = question.type === 'number' ? 
      (value === '' ? '' : parseInt(String(value), 10)) : 
      value
    
    setAnswers(prev => ({
      ...prev,
      [question.key]: processedValue
    }))
  }

  const validateAnswer = (questionKey: string, value: string | number) => {
    const question = questions.find(q => q.key === questionKey)
    if (!question) return true

    if (question.type === 'number') {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value
      if (question.min !== undefined && numValue < question.min) return false
      if (question.max !== undefined && numValue > question.max) return false
    }

    return true
  }

  const handleNext = () => {
    const currentAnswer = answers[questions[currentQuestion].key]
    if (!currentAnswer && currentAnswer !== 0) {
      setError('Please provide an answer before continuing')
      return
    }

    if (!validateAnswer(questions[currentQuestion].key, currentAnswer)) {
      setError(`Please enter a value between ${questions[currentQuestion].min} and ${questions[currentQuestion].max}`)
      return
    }

    setError(null)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    setError(null)
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!user) throw new Error("User not authenticated")

      // Validate all answers before submission
      for (const question of questions) {
        const answer = answers[question.key]
        if (!answer && answer !== 0) {
          throw new Error(`Please answer all questions before submitting`)
        }
        if (!validateAnswer(question.key, answer)) {
          throw new Error(`Invalid value for ${question.label}`)
        }
      }

      // Get the existing patient record
      const { data: patientData, error: fetchError } = await supabase
        .from('voice_patients')
        .select('id')
        .eq('email', user.email)
        .single()

      if (fetchError) {
        console.error('Error fetching patient data:', fetchError)
        throw new Error('Could not find your patient record')
      }

      // Update the existing patient record
      const { error: updateError } = await supabase
        .from('voice_patients')
        .update(answers)
        .eq('id', patientData.id)

      if (updateError) {
        console.error('Database error:', updateError)
        throw new Error("Failed to save your information. Please try again.")
      }

      setSuccess("Your information has been successfully saved.")
      setShowThankYou(true)
    } catch (err) {
      console.error('Error saving onboarding data:', err)
      setError(err instanceof Error ? err.message : "Failed to save your information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleThankYouClose = () => {
    setShowThankYou(false)
    router.push('/dashboard')
  }

  if (isLoading) return <Loading />

  const question = questions[currentQuestion]
  const currentAnswer = answers[question.key]

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96">
        {user && (
          <h1 className="text-2xl font-bold mb-6 text-center">
            Welcome, {user.user_metadata.first_name}!
          </h1>
        )}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2 text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">{question.label}</h2>
        
        {question.type === 'textarea' ? (
          <Textarea
            value={currentAnswer?.toString() || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            className="mb-4"
            placeholder="Type your answer here..."
          />
        ) : (
          <Input
            type={question.type}
            value={currentAnswer?.toString() || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            min={question.min}
            max={question.max}
            className="mb-4"
            placeholder={`Enter your ${question.type === 'number' ? 'number' : 'answer'} here...`}
          />
        )}
        
        {error && <Notification type="error" message={error} />}
        {success && <Notification type="success" message={success} />}
        
        <div className="flex justify-between mt-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
      {showThankYou && <ThankYouPopup onClose={handleThankYouClose} />}
    </div>
  )
}