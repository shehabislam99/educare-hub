import { connectToDatabase } from "@/lib/mongoConnect";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        // Find user by email
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = await new SignJWT({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role || "student",
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d")
            .sign(JWT_SECRET);

        // Create response
        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    role: user.role || "student",
                },
                token,
            },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
