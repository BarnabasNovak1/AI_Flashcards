import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the system prompt for generating flashcards
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective
flashcards based on the given topic or content. Follow these guidelines:

Create clear and concise questions for the front of the flashcard.
Maximum of 50 characters including spaces.
Provide accurate and informative answers for the back of the flashcard.
Ensure that each flashcard focuses on a single concept or piece of information.
Use simple language to make the flashcards accessible to a wide range of learners.
Include a variety of question types, such as definitions, examples, comparisons, and applications.
Avoid overly complex or ambiguous phrasing in both questions and answers.
When appropriate, use mnemonics or memory aids to help reinforce the information.
Tailor the difficulty level of the flashcards to the user's specified preferences.
If given a body of text, extract the most important and relevant information for the flashcards.
Aim to create 9 sets of flashcards that cover the topic comprehensively.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

Return in the following JSON format:
{
    "flashcards": [{
        "front": "string",
        "back": "string"
    }]
}
`;

export async function POST(req) {
    try {
        // Initialize OpenAI with your API key
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Get the input data from the request body
        const data = await req.text();

        // Request completion from OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // Updated model name for GPT-4
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            max_tokens: 1500, // Adjust based on the expected length of the response
        });

        // Parse the JSON response from OpenAI API
        const responseContent = completion.choices[0].message.content;
        const flashcards = JSON.parse(responseContent);

        // Return the flashcards as a JSON response
        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}
