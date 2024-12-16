import * as Langtrace from "@langtrase/typescript-sdk"
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

// Initialize Langtrace with OpenAI instrumentation
Langtrace.init({
  api_key: process.env.LANGTRACE_API_KEY,
  batch: false,
  instrumentations: {
    openai: OpenAI,
  },
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    const prompt = `Based on the following user data, provide three personalized recommendations for wellness, mental health, and lifestyle. Format the response as a JSON array of objects, each containing 'question', 'answer', 'recommendation', and 'type' fields:

    Age: ${userData.age}
    City/State: ${userData.citystateofresidence} 
    Family Health Conditions: ${userData.familyhealthconditions}
    Current Medications: ${userData.currentmedications}
    Physical Activity: ${userData.physicalactivity}
    Mental Wellbeing (1-10): ${userData.mentalwellbeing}

    Ensure recommendations are specific, actionable, and tailored to the user's information.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides personalized health recommendations." },
        { role: "user", content: prompt }
      ],
    });

    const recommendations = JSON.parse(completion.choices[0].message?.content || '[]');

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}