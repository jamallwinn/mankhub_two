import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
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
        { error: "Invalid message format" },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500, // Limiting response length for quicker responses
    })

    return NextResponse.json(response.choices[0].message)
  } catch (error) {
    console.error('[CHAT_ERROR]', error)
    
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