import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();
    try {
        const res = await prisma.note.deleteMany({
            where: {
                userId: data.userId,
            }
        })
        return NextResponse.json(res);
    } catch (error) {
        console.log(error)
    }
}