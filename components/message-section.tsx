'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Message {
  id: string
  subject: string
  message: string
  created_at: string
  is_read: boolean
  sender_id: string
  recipient_id: string
}

interface MessageSectionProps {
  userId: string
}

export function MessageSection({ userId }: MessageSectionProps) {
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [drUkwuId, setDrUkwuId] = useState<string | null>(null)

  useEffect(() => {
    fetchUnreadMessages()
    fetchDrUkwuId()
  }, [userId])

  const fetchUnreadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching unread messages:', error)
    } else {
      setUnreadMessages(data)
    }
  }

  const fetchDrUkwuId = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_providers')
        .select('id')
        .eq('last_name', 'Ukwu')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Medical providers table not found or empty')
          setDrUkwuId('00000000-0000-0000-0000-000000000000')
        } else {
          console.error('Error fetching Dr. Ukwu ID:', error)
        }
      } else if (data) {
        console.log('Dr. Ukwu ID fetched:', data.id)
        setDrUkwuId(data.id)
      } else {
        console.log('No data found for Dr. Ukwu')
        setDrUkwuId('00000000-0000-0000-0000-000000000000')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setDrUkwuId('00000000-0000-0000-0000-000000000000')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      console.log('Empty subject or message')
      toast.error('Please fill in both subject and message')
      return
    }

    if (!drUkwuId) {
      console.log('Dr. Ukwu ID not found')
      toast.error('Unable to send message. Provider information not found.')
      return
    }

    console.log('Attempting to send message...')
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        recipient_id: drUkwuId,
        subject,
        message,
      })
      .select()

    if (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } else {
      console.log('Message sent successfully:', data)
      toast.success('Message sent successfully')
      setSubject('')
      setMessage('')
    }
  }

  const handleReadMessage = async (message: Message) => {
    setSelectedMessage(message)
    if (!message.is_read) {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', message.id)

      if (error) {
        console.error('Error marking message as read:', error)
      } else {
        fetchUnreadMessages()
      }
    }
  }

  const handleQuickReply = async (replyMessage: string) => {
    if (!selectedMessage || !drUkwuId) return

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        recipient_id: drUkwuId,
        subject: `Re: ${selectedMessage.subject}`,
        message: replyMessage,
      })

    if (error) {
      console.error('Error sending quick reply:', error)
      toast.error('Failed to send reply. Please try again.')
    } else {
      toast.success('Reply sent successfully')
      setSelectedMessage(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Unread Messages</h3>
        {unreadMessages.length === 0 ? (
          <p>No unread messages</p>
        ) : (
          <ul className="space-y-2">
            {unreadMessages.map((msg) => (
              <li key={msg.id}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleReadMessage(msg)}>
                      {msg.subject}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{msg.subject}</DialogTitle>
                      <DialogDescription>
                        Received on {new Date(msg.created_at).toLocaleString()}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <p>{msg.message}</p>
                    </div>
                    <div className="mt-4 space-x-2">
                      <Button onClick={() => handleQuickReply('Thank you for your message.')}>
                        Quick Reply
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                        Close
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Send a Message to Dr. Ukwu</h3>
        <form onSubmit={handleSendMessage} className="space-y-2">
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <Textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  )
}

