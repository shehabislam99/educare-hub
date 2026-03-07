"use client";

import React from 'react';
import Link from 'next/link';
import { Book, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function MyEnrollments() {
    const { data: session } = useSession();
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await fetch('/api/my-enrollments', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setEnrolledCourses(data);
                }
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchEnrollments();
        }
    }, [session]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
      <div className="space-y-8">
        <div className="relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl font-black font-display mb-6 tracking-tight leading-[1.1]">
            My Enrolled Courses
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
            Continue where you left off and master new skills.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {enrolledCourses.length === 0 ?
            <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                <Book className="w-10 h-10 text-slate-300" />
              </div>
              <div className="max-w-sm mx-auto">
                <p className="text-xl font-bold text-slate-900">
                  No active enrollments
                </p>
                <p className="text-slate-500 mt-2">
                  You have not enrolled in any courses yet. Start exploring our
                  catalog today!
                </p>
              </div>
              <Link
                href="/course"
                className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Explore All Courses
              </Link>
            </div>
          : enrolledCourses.map((course) => (
              <div
                key={course.id || course._id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-64 h-40 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    {course.thumbnail ?
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    : <div className="w-full h-full flex items-center justify-center">
                        <Book className="w-10 h-10 text-slate-200" />
                      </div>
                    }
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider mb-2 inline-block">
                            {course.category || "General"}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-indigo-600">
                            {course.progress}%
                          </span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            Completed
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 mb-6 italic line-clamp-1">
                        Next up:{" "}
                        <span className="font-semibold text-slate-700">
                          {course.nextLesson || "Getting Started"}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                            />
                          ))}
                          <span className="ml-4 text-[10px] font-bold text-slate-400 flex items-center">
                            +12 classmates
                          </span>
                        </div>
                        <Link
                          href={`/course/${course._id || course.id}`}
                          className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                          Resume Learning <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
}
