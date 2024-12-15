'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const MAX_MESSAGES_PER_DAY = 10

interface Message {
  text: string
  isUser: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedCount = localStorage.getItem('dailyMessageCount')
    const lastReset = localStorage.getItem('lastResetDate')
    const today = new Date().toDateString()

    if (lastReset !== today) {
      localStorage.setItem('dailyMessageCount', '0')
      localStorage.setItem('lastResetDate', today)
      setMessageCount(0)
    } else if (storedCount) {
      setMessageCount(parseInt(storedCount, 10))
    }
  }, [])

  const handleSendMessage = useCallback(async () => {
    if (!input || input.trim() === '' || messageCount >= MAX_MESSAGES_PER_DAY) {
      console.log('Input is empty or message limit reached')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      setMessages(prevMessages => [...prevMessages, { text: input, isUser: true }])
      setInput('')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('API Response:', response.status, text)
        throw new Error(`API error ${response.status}: ${text}`)
      }

      let data
      try {
        data = await response.json()
      } catch (e) {
        console.error('JSON parse error:', e)
        throw new Error('Failed to parse API response')
      }

      if (!data.response) {
        throw new Error(data.error || 'No response from API')
      }

      setMessages(prevMessages => [...prevMessages, { text: data.response, isUser: false }])
      setMessageCount(prevCount => {
        const newCount = prevCount + 1
        localStorage.setItem('dailyMessageCount', newCount.toString())
        return newCount
      })
    } catch (error) {
      console.error('Error in chat interface:', error)
      if (error instanceof Error) {
        setError(`Error: ${error.message}`)
      } else {
        setError('An unknown error occurred. Please try again later.')
      }
      
      // Optionally remove the user's message if the API call failed
      setMessages(prevMessages => prevMessages.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [input, messageCount])

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>Wellness Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            <span className="inline-block p-2 rounded-lg bg-gray-200">Thinking...</span>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        {messageCount >= MAX_MESSAGES_PER_DAY && (
          <div className="text-center text-red-500">
            You've reached your daily limit of {MAX_MESSAGES_PER_DAY} messages. Please try again tomorrow.
          </div>
        )}
      </CardContent>
      <div className="p-4 border-t flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about wellness, lifestyle, or stress management..."
          disabled={messageCount >= MAX_MESSAGES_PER_DAY || isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          className="ml-2" 
          disabled={isLoading || messageCount >= MAX_MESSAGES_PER_DAY || !input.trim()}
        >
          Send
        </Button>
      </div>
      <div className="text-center text-sm text-gray-500">
        Messages remaining today: {MAX_MESSAGES_PER_DAY - messageCount}
      </div>
    </Card>
  )
}

