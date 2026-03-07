import { connectToDatabase } from "@/lib/mongoConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const instructorId = searchParams.get("instructorId");

        const db = await connectToDatabase();
        const coursesCollection = db.collection("courses");

        let query = {};
        if (instructorId) {
            query.instructorId = instructorId;
        }

        // Fetch courses based on query
        const courses = await coursesCollection.find(query).toArray();

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error("Course fetch error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const courseData = await req.json();
        const db = await connectToDatabase();
        const coursesCollection = db.collection("courses");

        const result = await coursesCollection.insertOne({
            ...courseData,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "Course created successfully", id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Course creation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
