import { NEXT_AUTH } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(NEXT_AUTH);
        const res = await prisma.note.findMany({
            where: {
                email: session?.user?.email
            }
        })
        return NextResponse.json(res, {status: 200});
    } catch (error) {
        console.log(error);
    }
}