"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CourseForm from "@/components/course/CourseForm";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(true);
  const [course, setCourse] = React.useState(null);

  React.useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/course/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Course not found");
        const data = await res.json();

        const userId = session?.user?.id || session?.user?.email;
        if (data.instructorId && userId && data.instructorId !== userId) {
          alert("You do not have permission to edit this course.");
          router.push("/dashboard/instructor/manage-course");
          return;
        }

        setCourse(data);
      } catch (error) {
        console.error("Course load failed:", error);
        alert("Failed to load course details.");
        router.push("/dashboard/instructor/manage-course");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && id) {
      fetchCourse();
    }
  }, [id, session, router]);

  const handleUpdate = async (payload) => {
    const res = await fetch(`/api/course/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to update course");
    }

    alert("Course updated successfully!");
    router.push("/dashboard/instructor/manage-course");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <CourseForm
      mode="edit"
      initialValues={course}
      sessionUser={session?.user}
      onSubmitCourse={handleUpdate}
      onCancel={() => router.push("/dashboard/instructor/manage-course")}
    />
  );
}
