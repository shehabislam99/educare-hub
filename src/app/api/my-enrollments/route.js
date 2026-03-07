import { connectToDatabase } from "@/lib/mongoConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = await connectToDatabase();
        const enrollmentsCollection = db.collection("enrollments");
        const coursesCollection = db.collection("courses");

        const userId = session.user.id || session.user.email;

        // Find enrollments for this user
        const enrollments = await enrollmentsCollection.find({ userId: userId }).toArray();

        if (enrollments.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Fetch the corresponding course details
        const courseIds = enrollments.map(e => e.courseId);
        const courses = await coursesCollection.find({
            $or: [
                {
                    _id: {
                        $in: courseIds.map(id => {
                            try { return new ObjectId(id); } catch (e) { return id; }
                        })
                    }
                },
                { id: { $in: courseIds } }
            ]
        }).toArray();

        // Merge enrollment data (like progress) with course data
        const enrolledCourses = enrollments.map(enrol => {
            const course = courses.find(c => c._id?.toString() === enrol.courseId || c.id === enrol.courseId);
            return {
                ...course,
                progress: enrol.progress || 0,
                nextLesson: enrol.nextLesson || 'Not started'
            };
        }).filter(c => c.title); // Filter out any courses that might have been deleted

        return NextResponse.json(enrolledCourses, { status: 200 });
    } catch (error) {
        console.error("My enrollments fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
