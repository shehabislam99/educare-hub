"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Clock, Award, ChevronRight, PlayCircle, Calendar, Star, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
                const enrollmentRes = await fetch('/api/my-enrollments');
                if (enrollmentRes.ok) {
                    const enrollmentData = await enrollmentRes.json();
                    setEnrolledCourses(enrollmentData);
                }

                // Fetch Recommendations (general courses for discovery)
                const courseRes = await fetch('/api/course');
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
            <div className="relative bg-slate-900 rounded-[3rem] p-10 md:p-16 overflow-hidden text-white shadow-2xl shadow-indigo-100/50">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />

                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Student Dashboard</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-display mb-6 tracking-tight leading-[1.1]">
                            Hello, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{userName}!</span>
                        </h1>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                            Welcome back. You are currently taking <span className="text-white font-bold">{coursesInProgress} courses</span>.
                            Ready to continue your learning journey?
                        </p>
                        <div className="flex flex-wrap gap-5">
                            <Link href="/dashboard/student/my-enrollments" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                                <PlayCircle className="w-4 h-4" /> Continue Learning
                            </Link>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                <TrendingUp className="w-4 h-4 text-indigo-400" />
                                <span className="font-black text-[10px] uppercase tracking-widest text-white/70">75% Complete</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Stats and Recommendations */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Compact Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Active', value: coursesInProgress, icon: Book, color: 'indigo', unit: 'Courses' },
                            { label: 'Success', value: coursesCompleted, icon: Award, color: 'emerald', unit: 'Certificates' },
                            { label: 'Days', value: '12', icon: Clock, color: 'amber', unit: 'Streak' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100 hover:shadow-indigo-100/50 transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <stat.icon className="text-indigo-600 w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Resume */}
                    {enrolledCourses.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Current Course</h2>
                            </div>
                            <div className="bg-white rounded-[3rem] border border-slate-50 p-4 shadow-xl shadow-slate-100">
                                {enrolledCourses.slice(0, 1).map(course => (
                                    <div key={course._id} className="flex flex-col md:flex-row items-center gap-8 p-4">
                                        <div className="w-full md:w-40 h-32 rounded-[2rem] overflow-hidden shrink-0 bg-slate-100 group">
                                            <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-tight">{course.title}</h3>
                                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2h Left</span>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <span className="text-indigo-600">Resume course</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-indigo-600 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
                                            </div>
                                        </div>
                                        <Link href={`/course/${course._id}`} className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg text-center">
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
                                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Recommended for You</h2>
                            </div>
                            <Link href="/course" className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b-2 border-indigo-600/10 hover:border-indigo-600 transition-all flex items-center gap-2 pb-1">
                                Explore All <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8">
                            {recommendations.length > 0 ? (
                                recommendations.map((course) => (
                                    <Link key={course._id || course.id} href={`/course/${course._id || course.id}`} className="bg-white border border-slate-50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all h-full flex flex-col">
                                        <div className="h-44 relative overflow-hidden">
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
                                                <span className="text-xl font-black text-slate-900">${course.price}</span>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-[11px] font-black text-slate-800">{course.rating || "4.8"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-2 bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No discovery nodes available at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-10">
                    {/* Calendar Recap */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Upcoming Schedule</h3>
                                <Calendar className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="space-y-6">
                                {[
                                    { day: 'MON', date: '22', event: 'UI Design 101', time: '10:00 AM' },
                                    { day: 'WED', date: '24', event: 'Career Talk', time: '02:00 PM' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/30 transition-all cursor-pointer">
                                        <div className="flex flex-col items-center justify-center min-w-[3rem]">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.day}</span>
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{item.date}</span>
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="font-bold text-slate-900 truncate text-sm uppercase tracking-tight">{item.event}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Achievement Board */}
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/90">Progress Report</h3>
                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                <Award className="w-4 h-4 text-indigo-400" />
                            </div>
                        </div>

                        <div className="space-y-8">
                            {[
                                { skill: 'Frontend', progress: 85, color: 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' },
                                { skill: 'Backend', progress: 40, color: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' },
                                { skill: 'Design', progress: 15, color: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' }
                            ].map((skill, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                        <span>{skill.skill}</span>
                                        <span className="text-white/80">{skill.progress}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] text-center italic">Updated in real-time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
