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
                Courses <span className="text-blue-800">({filteredCourses.length})</span>
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
                  <Link
                    key={course._id || course.id}
                    href={`/course/${course._id || course.id}`}
                    className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
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
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-[10px] font-black uppercase tracking-wider text-indigo-600">
                        {course.category || "General"}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {course.instructorName ||
                          course.instructor ||
                          "Instructor"}
                      </p>
                      <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 line-clamp-2">
                        {course.title}
                      </h4>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                            ${course.price}
                          </p>
                          <p className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {course.rating || "0"}
                          </p>
                        </div>
                        <div className="text-right text-xs font-bold text-slate-500 dark:text-slate-400 space-y-1">
                          <p className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration || "45H"}
                          </p>
                          <p className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {(course.studentsCount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            }
          </div>
        </div>
      </section>
    </main>
  );
}
