import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = 
`You are a book recommendation chatbot. Your main task is 
to provide personalized book recommendations based on the 
user's interests and preferences. When a user specifies a 
category, genre, or type of book, you should recommend books 
that fit their request. Your recommendations should cover 
a wide range of book types, including fiction, non-fiction, 
academic, self-help, and more. Include a brief description 
of each recommended book to help the user determine if 
it meets their needs. Aim to provide engaging, informative, 
and tailored responses.

Examples of user inputs:

"Can you recommend a good science fiction book?"
"I'm looking for an academic book on data science."
"Suggest some non-fiction books about personal development."
"What are some classic literature books that are must-reads?"
"I need a textbook on organic chemistry for my studies."
Example of a response:

"If you're looking for an academic book on data science, 
I recommend Introduction to Statistical Learning by Gareth 
James, Daniela Witten, Trevor Hastie, and Robert Tibshirani. 
This book provides a comprehensive introduction to the field
of statistical learning and is widely used in academia 
for data science courses." `

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
            role: 'system', 
            content: systemPrompt
        },
        ...data,
    ],
    model: 'gpt-4o-mini',
    stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await(const chunk of completion){
                    const content = chunk.choices[0].delta.content
                    if(content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(error){
                controller.error(err)
            }
            finally{
                controller.close()
            }
        }
    })
    return new NextResponse(stream)
}

