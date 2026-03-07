"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star, Users, Clock } from "lucide-react";

const categories = ["All", "Development", "Design", "Business", "Marketing", "Data Science"];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/course", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (course.title || "").toLowerCase().includes(q) ||
        (course.instructorName || course.instructor || "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-transparent pb-20">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-[1.1]">
              Explore Courses
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium mt-3">
              Find the right course and start learning today.
            </p>
          </div>

          <div className="w-full lg:w-[420px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses or instructor"
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white  border border-slate-300  text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="bg-white border border-slate-300  rounded-3xl p-6 h-fit">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 s mb-5">
              Category
            </h2>
            <div className="space-y-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      active ?
                        "bg-indigo-600 text-white"
                      : "bg-slate-50  hover:text-indigo-600"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">
                Courses{" "}
                <span className="text-blue-800">
                  ({filteredCourses.length})
                </span>
              </h3>
            </div>

            {isLoading ?
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[22rem] rounded-3xl bg-white  border border-slate-100 animate-pulse"
                  />
                ))}
              </div>
            : filteredCourses.length === 0 ?
              <div className="bg-white border border-slate-300  rounded-3xl p-14 text-center">
                <h4 className="text-xl font-black text-slate-900  mb-2">
                  No Courses Found
                </h4>
                <p className="text-slate-500  mb-7">
                  Adjust category or search keywords.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
            : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id || course.id}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden group  shadow-md shadow-indigo-50 transition-all"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                        }
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {course.category || "General"}
                      </span>
                    </div>

                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                          {course.instructorImage ?
                            <img
                              src={course.instructorImage}
                              alt={
                                course.instructorName ||
                                course.instructor ||
                                "Instructor"
                              }
                              className="w-full h-full object-cover"
                            />
                          : <span className="text-[10px] font-black text-slate-500 uppercase">
                              {
                                (course.instructorName ||
                                  course.instructor ||
                                  "I")[0]
                              }
                            </span>
                          }
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {course.instructorName ||
                            course.instructor ||
                            "Instructor"}
                        </p>
                      </div>
                      <h4 className="text-lg font-black text-indigo-600 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-snug">
                        {course.title}
                      </h4>

                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {course.rating || "0"}
                          </p>
                        </div>
                        <div className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                          ({course.reviewsCount || 0} reviews)
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-2xl font-black">
                          ${course.price}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration || "45H"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {(course.studentsCount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/course/${course._id || course.id}`}
                        className="mt-5 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </section>
    </main>
  );
}
