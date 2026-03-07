import { connectToDatabase } from "@/lib/mongoConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = await connectToDatabase();
        const coursesCollection = db.collection("courses");

        const userId = session.user.id || session.user.email;
        const courses = await coursesCollection.find({ instructorId: userId }).toArray();

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error("My courses fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
