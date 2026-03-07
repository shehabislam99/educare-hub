"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Clock, Award, ChevronRight, Calendar, Star, Loader2, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userName = session?.user?.name || session?.user?.username || "Learner";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Enrollments
                const enrollmentRes = await fetch('/api/my-enrollments', { cache: 'no-store' });
                if (enrollmentRes.ok) {
                    const enrollmentData = await enrollmentRes.json();
                    setEnrolledCourses(enrollmentData);
                }

                // Fetch Recommendations (general courses for discovery)
                const courseRes = await fetch('/api/course', { cache: 'no-store' });
                if (courseRes.ok) {
                    const allCourses = await courseRes.json();
                    // Just take a few for recommendations
                    setRecommendations(allCourses.slice(0, 2));
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    const coursesInProgress = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;
    const coursesCompleted = enrolledCourses.filter(c => c.progress === 100).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin opacity-20" />
            </div>
        );
    }

    return (
      <div className="space-y-12 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden ">
          <h1 className="text-4xl md:text-6xl font-black font-display mb-6 tracking-tight leading-[1.1]">
            Hello, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              {userName}!
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
            Welcome back to your dashboard. You are currently taking{" "}
            <span className="text-blue font-bold">
              {coursesInProgress} courses
            </span>
            . Ready to continue your learning journey?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Main Stats and Recommendations */}
          <div className="lg:col-span-2 space-y-12">
            {/* Compact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Active",
                  value: coursesInProgress,
                  icon: Book,
                  color: "indigo",
                  unit: "Courses",
                },
                {
                  label: "Success",
                  value: coursesCompleted,
                  icon: Award,
                  color: "emerald",
                  unit: "Certificates",
                },
                {
                  label: "Days",
                  value: "0",
                  icon: Clock,
                  color: "amber",
                  unit: "Streak",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100 hover:shadow-indigo-100/50 transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <stat.icon className="text-indigo-600 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {stat.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Resume */}
            {enrolledCourses.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                    Current Course
                  </h2>
                </div>
                <div className="bg-white rounded-[3rem] border border-slate-50 p-4 shadow-xl shadow-slate-100">
                  {enrolledCourses.slice(0, 1).map((course) => (
                    <div
                      key={course._id}
                      className="flex flex-col md:flex-row items-center gap-8 p-4"
                    >
                      <div className="w-full md:w-40 h-32 rounded-[2rem] overflow-hidden shrink-0 bg-slate-100 group">
                        <img
                          src={course.thumbnail}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt=""
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-tight">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> 2h Left
                          </span>
                          <div className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-indigo-600">Resume course</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
                        </div>
                      </div>
                      <Link
                        href={`/course/${course._id}`}
                        className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg text-center"
                      >
                        Interface
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended - Real Database Data */}
            <div className="space-y-8">
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-cyan-500 rounded-full" />
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                    Recommended for You
                  </h2>
                </div>
                <Link
                  href="/course"
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b-2 border-indigo-600/10 hover:border-indigo-600 transition-all flex items-center gap-2 pb-1"
                >
                  Explore All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {recommendations.length > 0 ?
                  recommendations.map((course) => (
                    <Link
                      key={course._id || course.id}
                      href={`/course/${course._id || course.id}`}
                      className="bg-white border border-slate-50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all h-full flex flex-col"
                    >
                      <div className="h-44 relative overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600">
                          {course.category}
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-base mb-6 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <span className="text-xl font-black text-slate-900">
                            ${course.price}
                          </span>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[11px] font-black text-slate-800">
                              {course.rating || "4.8"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                : <div className="col-span-2 bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No discovery nodes available at this time.
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>

          
        </div>
      </div>
    );
}
