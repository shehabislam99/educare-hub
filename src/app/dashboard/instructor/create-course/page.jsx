"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CourseForm from "@/components/course/CourseForm";

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleCreate = async (payload) => {
    const res = await fetch("/api/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create course");
    }

    alert("Course created successfully!");
    router.push("/dashboard/instructor/manage-course");
  };

  return (
    <CourseForm
      mode="create"
      initialValues={{}}
      sessionUser={session?.user}
      onSubmitCourse={handleCreate}
      onCancel={() => router.push("/dashboard/instructor/manage-course")}
    />
  );
}
