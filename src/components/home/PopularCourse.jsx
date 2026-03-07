import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Users, ArrowRight, Loader2 } from 'lucide-react';

const PopularCourse = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/course');
                if (res.ok) {
                    const data = await res.json();
                    // Just take the first 3 or most recent 3 as "popular"
                    setCourses(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching popular courses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <section className="py-24 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">Popular Courses</h2>
                        <p className="text-slate-600">The most trending courses right now.</p>
                    </div>
                    <Link href="/course" className="text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        View All Courses <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100 shadow-sm" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center shadow-sm">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Synchronizing latest knowledge modules...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Link
                                key={course._id || course.id}
                                href={`/course/${course._id || course.id}`}
                                className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl overflow-hidden group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                                            {(course.instructorName || course.instructor || "I")[0]}
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">{course.instructorName || course.instructor}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-slate-700">{course.rating || 0}</span>
                                        </div>
                                        <span className="text-sm text-slate-400">({course.reviewsCount || 0} reviews)</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xl font-bold text-slate-900">${course.price}</span>
                                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                            <Users className="w-4 h-4" /> {(course.studentsCount || 0).toLocaleString()} students
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularCourse;
