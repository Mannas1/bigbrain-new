import { NEXT_AUTH } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.PPLX_API_KEY, baseURL: "https://api.perplexity.ai" });
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const session = await getServerSession(NEXT_AUTH);
    console.log(session?.user?.email);
    const res = await prisma.note.findMany({ where: { email: session?.user?.email } });
    const aiResponse = await client.chat.completions.create({ model: "mistral-7b-instruct", messages: [
        {
            "role": "system",
            "content": "You are a helpfull assistant. I have given you a list of my notes with date created and content"
        },
        {
            "role": "system",
            "content": "with the material given only in the notes, you have to help my in my questions. You are not allowed to answer anything that goes beyond the scope of the notes"
        },
        {
            "role": "system",
            "content": "I will ask you questions and you will provide me with the answer from the notes. If you can't find the answer, you can tell me that you can't find it. Don't tell the proper time, just date is fine!"
        },
        {
            "role": "system",
            "content": "When the user asks for all his notes, you should provide just the content and date no time no id nothing else."
        },
        {
            "role": "system",
            "content": `these the are given notes: ${res.map((note) => `this is the date created: ${note.createdAt} and this is the content: ${note.content}`)}`
        },
        {
            "role": "user",
            "content": request.content
        }
    ] 

});

    console.log(aiResponse.choices);

    return NextResponse.json(aiResponse.choices);
  } catch (err) {
    console.log(err);
  }
}