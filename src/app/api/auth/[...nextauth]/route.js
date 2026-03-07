import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectToDatabase, getMongoClient } from "@/lib/mongoConnect";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

// Provide a Mongo client instance to NextAuth adapter without forcing DB connection at module load.
const clientPromise =
  process.env.MONGODB_URI ? Promise.resolve(getMongoClient()) : null;

export const authOptions = {
  ...(clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          image: user.image,
          role: user.role || "student",
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const db = await connectToDatabase();
          const usersCollection = db.collection("users");
          const dbUser = await usersCollection.findOne({ email: user.email });

          if (!dbUser) {
            // New social user - default role is student
            user.role = "student";
          } else {
            // Existing user - ensure role is present
            user.role = dbUser.role || "student";
            if (!dbUser.role) {
              await usersCollection.updateOne(
                { email: user.email },
                { $set: { role: "student" } }
              );
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role || "student";
        token.id = user.id || user._id?.toString();
        token.picture = user.image;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role || "student";
        session.user.id = token.id;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
