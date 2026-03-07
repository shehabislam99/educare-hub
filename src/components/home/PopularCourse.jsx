import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Users, ArrowRight, Loader2 } from 'lucide-react';

const PopularCourse = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/course', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    // Just take the first 3 or most recent 3 as "popular"
                    setCourses(data.slice(0, 3));
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
      <section className="py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">
                Popular Courses
              </h2>
              <p className="text-slate-600">
                The most trending courses right now.
              </p>
            </div>
            <Link
              href="/course"
              className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2 text-indigo-600 font-bold items-center gap-1 hover:gap-2 transition-all"
            >
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="md:hidden text-center mt-4">
              <Link
                href="/course"
                className="text-indigo-600 font-bold inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {isLoading ?
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100 shadow-sm"
                />
              ))}
            </div>
          : courses.length === 0 ?
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center shadow-sm">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                Loading latest courses...
              </p>
            </div>
          : <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course._id || course.id}
                  href={`/course/${course._id || course.id}`}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden group  shadow-md shadow-indigo-50 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {course.category}
                    </div>
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
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {course.instructorName || course.instructor}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-snug">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-black text-slate-700">
                          {course.rating || 0}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        ({course.reviewsCount || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                      <span className="text-2xl font-black text-slate-900">
                        ${course.price}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Users className="w-4 h-4" />{" "}
                        {(course.studentsCount || 0).toLocaleString()} students
                      </div>
                    </div>
                    <div className="mt-5">
                      <span className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest group-hover:bg-indigo-700 transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          }
        </div>
      </section>
    );
};

export default PopularCourse;
