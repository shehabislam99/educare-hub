"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Users,
  BookOpen,
  DollarSign,
  Edit,
  Star,
  Loader2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function InstructorDashboard() {
  const { data: session } = useSession();
  const [courses, setCourses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const userName =
    session?.user?.name || session?.user?.username || "Instructor";

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/my-courses", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchCourses();
    }
  }, [session]);

  const totalStudents = courses.reduce(
    (acc, c) => acc + (c.studentsCount || 0),
    0,
  );
  const totalRevenue = courses.reduce(
    (acc, c) => acc + parseFloat(c.price || 0) * (c.studentsCount || 0),
    0,
  );
  const activeCourses = courses.length;
  const avgRating =
    courses.length > 0 ?
      (
        courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length
      ).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display uppercase tracking-tight">
            Instructor Hub
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring your educational impact in real-time.
          </p>
        </div>
        <Link
          href="/dashboard/instructor/create-course"
          className="bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl hover:bg-slate-800 transition-all shadow-md shadow-indigo-50 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Launch New Course
        </Link>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: "+12.5%",
            color: "emerald",
          },
          {
            label: "Students",
            value: totalStudents.toLocaleString(),
            icon: Users,
            trend: "+43",
            color: "indigo",
          },
          {
            label: "Courses",
            value: activeCourses.toString(),
            icon: BookOpen,
            trend: "Active",
            color: "amber",
          },
          {
            label: "Avg Rating",
            value: avgRating,
            icon: Star,
            trend: "Top 5%",
            color: "rose",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="flex flex-col h-full justify-between">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <stat.icon className="text-indigo-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Courses Performance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Performance Matrix
            </h2>
            <Link
              href="/dashboard/instructor/manage-course"
              className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline"
            >
              Full Management <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Master Course
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Engagement
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Gross
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {courses.length === 0 ?
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-slate-200" />
                          </div>
                          <p className="font-bold text-slate-400">
                            No active deployments yet.
                          </p>
                          <Link
                            href="/dashboard/instructor/create-course"
                            className="text-sm font-bold text-indigo-600 underline"
                          >
                            Start your first course
                          </Link>
                        </div>
                      </td>
                    </tr>
                  : courses.slice(0, 5).map((course) => (
                      <tr
                        key={course._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative shadow-sm">
                              <img
                                src={course.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 line-clamp-1 uppercase tracking-tight">
                                {course.title}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400">
                                {course.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black text-slate-900">
                              {course.studentsCount || 0}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Users
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-black text-slate-900">
                            $
                            {(
                              parseFloat(course.price || 0) *
                              (course.studentsCount || 0)
                            ).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Link
                            href={`/dashboard/instructor/edit-course/${course._id}`}
                            className="inline-flex p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Growth & Feedback */}
        <div className="space-y-8">
          {/* Growth Card */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-md shadow-indigo-50">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm tracking-tight">
                  Growth Insights
                </h3>
              </div>
              <p className="text-2xl font-black mb-2">Build dynamic labs</p>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-80">
                Students engaging with labs are 5x more likely to complete your
                kurs.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                Upgrade Content
              </button>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
