import { connectToDatabase } from "@/lib/mongoConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        const coursesCollection = db.collection("courses");

        let course;
        // Try both ObjectId and string ID (for mock data compatibility)
        try {
            course = await coursesCollection.findOne({ _id: new ObjectId(id) });
        } catch (e) {
            // If it's not a valid ObjectId, search by string ID
            course = await coursesCollection.findOne({ id: id });
        }

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(course, { status: 200 });
    } catch (error) {
        console.error("Course fetch error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Remove _id from update data to avoid "The _id field is immutable" error
        const { _id, ...updateData } = body;

        const db = await connectToDatabase();
        const coursesCollection = db.collection("courses");

        let result;
        try {
            result = await coursesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { ...updateData, updatedAt: new Date() } }
            );
        } catch (e) {
            // If it's not a valid ObjectId, search by string ID
            result = await coursesCollection.updateOne(
                { id: id },
                { $set: { ...updateData, updatedAt: new Date() } }
            );
        }

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course updated successfully" });
    } catch (error) {
        console.error("Course update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const db = await connectToDatabase();
        const coursesCollection = db.collection("courses");

        let result;
        try {
            result = await coursesCollection.deleteOne({ _id: new ObjectId(id) });
        } catch (e) {
            // Fallback for legacy/string ids
            result = await coursesCollection.deleteOne({ id: id });
        }

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Course deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
