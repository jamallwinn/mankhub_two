import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      )
    }

    // Validate message format
    const isValidMessage = messages.every(message => 
      message && 
      typeof message === 'object' && 
      'role' in message && 
      'content' in message &&
      typeof message.content === 'string' &&
      ['user', 'system', 'assistant'].includes(message.role)
    )

    if (!isValidMessage) {
      return NextResponse.json(
        { error: "Invalid message format. Each message must have 'role' and 'content' properties" },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4", // Fixed model name
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    return NextResponse.json(response.choices[0].message)
  } catch (error) {
    console.error('[CHAT_ERROR]', error)
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}