import { NEXT_AUTH } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();


export async function POST(req: Request) {
    try {
        const session = await getServerSession(NEXT_AUTH);
        console.log(req);
        const data = await req.json();
        if (!data?.content) {
            console.log(data);
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }
        const note = await prisma.note.create({
            data: {
                content: data.content,
                email: session?.user?.email,
                user: {
                    connect: {
                        email: session?.user?.email ?? '',
                    },
                },
            },
        });
        return NextResponse.json(note);
    } catch (err) {
        console.log(err);
    }
}