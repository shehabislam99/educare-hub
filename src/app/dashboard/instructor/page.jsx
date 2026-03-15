"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  Loader2,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

export default function InstructorDashboard() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userName = session?.user?.name || session?.user?.username || "Instructor";

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/my-courses", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;

    fetchCourses();

    const intervalId = setInterval(fetchCourses, 30000);
    const handleFocus = () => fetchCourses();

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [session, fetchCourses]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + Number(c.studentsCount || 0), 0);
    const totalRevenue = courses.reduce(
      (acc, c) => acc + Number(c.price || 0) * Number(c.studentsCount || 0),
      0
    );
    const avgRating =
      totalCourses > 0
        ? (
            courses.reduce((acc, c) => acc + Number(c.rating || 0), 0) / totalCourses
          ).toFixed(1)
        : "0.0";

    return { totalCourses, totalStudents, totalRevenue, avgRating };
  }, [courses]);

  const maxStudents = useMemo(() => {
    if (courses.length === 0) return 1;
    return Math.max(...courses.map((course) => Number(course.studentsCount || 0)), 1);
  }, [courses]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="rounded-3xl p-6 md:p-10 text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-cyan-800 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-100 font-bold">Instructor Workspace</p>
          <h1 className="text-3xl md:text-5xl font-black mt-3">Welcome back, {userName}</h1>
          <p className="text-indigo-100 mt-3 max-w-2xl">
            Your dashboard is powered by live database data from your courses. Metrics refresh automatically every 30 seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/instructor/create-course" className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Course
            </Link>
            <Link href="/dashboard/instructor/manage-course" className="px-5 py-3 rounded-xl border border-white/30 text-white font-bold text-sm">
              Manage Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: stats.totalCourses, icon: BookOpen },
          { label: "Total Students", value: stats.totalStudents, icon: Users },
          { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: CircleDollarSign },
          { label: "Avg Rating", value: stats.avgRating, icon: Star },
        ].map((item) => (
          <article key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">{item.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-slate-900">Course Performance</h2>
            <Link href="/dashboard/instructor/manage-course" className="text-sm font-semibold text-indigo-600 inline-flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="mt-3 text-slate-600 font-semibold">No courses published yet</p>
              <Link href="/dashboard/instructor/create-course" className="mt-4 inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm">
                Publish First Course
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => {
                const students = Number(course.studentsCount || 0);
                const popularityPercent = Math.max(8, Math.round((students / maxStudents) * 100));
                const revenue = Number(course.price || 0) * students;
                return (
                  <article key={course._id || course.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-indigo-600 font-bold">
                          {course.category || "General"}
                        </p>
                        <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {students} students - ${revenue.toLocaleString()} revenue
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/instructor/edit-course/${course._id || course.id}`}
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold text-center"
                      >
                        Edit
                      </Link>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Popularity</span>
                        <span>{popularityPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${popularityPercent}%` }} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="bg-white border border-slate-200 rounded-3xl p-6">
          <h2 className="text-xl font-black text-slate-900">Growth Insights</h2>
          <p className="text-sm text-slate-500 mt-1">Realtime overview of your teaching business.</p>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold">Performance</p>
              <p className="text-sm text-slate-700 mt-2 inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                {stats.totalStudents > 0
                  ? "Your courses are actively reaching students."
                  : "Publish a course to start tracking growth."}
              </p>
            </div>

            <Link
              href="/dashboard/instructor/create-course"
              className="block rounded-2xl border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-700 font-bold">Action</p>
              <h3 className="font-bold text-slate-900 mt-1">Create a New Course</h3>
              <p className="text-sm text-slate-600 mt-2">Add new content and grow your enrollments.</p>
            </Link>

            <Link
              href="/dashboard/instructor/manage-course"
              className="block rounded-2xl border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-700 font-bold">Action</p>
              <h3 className="font-bold text-slate-900 mt-1">Manage Existing Courses</h3>
              <p className="text-sm text-slate-600 mt-2">Update pricing, content, and publishing details.</p>
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
