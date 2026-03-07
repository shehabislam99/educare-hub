"use client";

import React from 'react';
import Link from 'next/link';
import { Book, Clock, Award, ChevronRight, PlayCircle, Calendar, Star, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_COURSES } from '@/constants';
import { useSession } from 'next-auth/react';

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const userName = session?.user?.name || session?.user?.username || "Learner";

    React.useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await fetch('/api/my-enrollments');
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

    const coursesInProgress = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;
    const coursesCompleted = enrolledCourses.filter(c => c.progress === 100).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <div className="relative bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 overflow-hidden text-white shadow-2xl shadow-indigo-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10" />

                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Hello, {userName}! 👋</h1>
                        <p className="text-indigo-50 text-lg mb-8 leading-relaxed">
                            You've completed <span className="font-bold underline decoration-white/40 underline-offset-4">75%</span> of your weekly goal.
                            Mastering React is within reach—keep pushing!
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/dashboard/student/my-enrollments" className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg">
                                <PlayCircle className="w-5 h-5" /> Resume Learning
                            </Link>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <TrendingUp className="w-5 h-5 text-indigo-200" />
                                <span className="font-bold text-sm tracking-tight text-white/90">Curated for you</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Stats and Recommendations */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Compact Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Active', value: coursesInProgress, icon: Book, color: 'indigo', unit: 'Courses' },
                            { label: 'Success', value: coursesCompleted, icon: Award, color: 'emerald', unit: 'Certificates' },
                            { label: 'Streaks', value: '12', icon: Clock, color: 'amber', unit: 'Days' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                                        <stat.icon className="text-indigo-600 w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                                    <span className="text-xs font-bold text-slate-400">{stat.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Resume */}
                    {enrolledCourses.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 px-2">Recently Accessed</h2>
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm">
                                {enrolledCourses.slice(0, 1).map(course => (
                                    <div key={course._id} className="flex flex-col md:flex-row items-center gap-6 p-4">
                                        <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                                            <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h Left</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span>Lesson 8: Hooks Deep Dive</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-indigo-600 h-full w-[65%]" />
                                            </div>
                                        </div>
                                        <Link href={`/course/${course._id}`} className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                                            Continue
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommended Side by Side */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-4">
                            <h2 className="text-xl font-bold text-slate-900">Discover Opportunities</h2>
                            <Link href="/course" className="text-sm font-bold text-indigo-600 hover:gap-2 flex items-center">
                                All Courses <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {MOCK_COURSES.slice(1, 3).map((course) => (
                                <Link key={course.id} href={`/course/${course.id}`} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                                    <div className="h-40 relative">
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Sparkles className="text-white w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm mb-4">{course.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-black text-slate-900">${course.price}</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-black text-slate-900">{course.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Calendar Recap */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-slate-900 uppercase tracking-tighter">Your Schedule</h3>
                                <Calendar className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { day: 'MON', date: '22', event: 'UI Design 101', time: '10:00 AM' },
                                    { day: 'WED', date: '24', event: 'Career Talk', time: '02:00 PM' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-400">{item.day}</span>
                                            <span className="text-xl font-black text-slate-900">{item.date}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 truncate text-sm">{item.event}</p>
                                            <p className="text-xs text-slate-500">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Achievement Board */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black uppercase tracking-tighter">Skills Track</h3>
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Award className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { skill: 'Frontend', progress: 85, color: 'bg-indigo-400' },
                                { skill: 'Backend', progress: 40, color: 'bg-emerald-400' },
                                { skill: 'DevOps', progress: 15, color: 'bg-amber-400' }
                            ].map((skill, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/60">
                                        <span>{skill.skill}</span>
                                        <span className="text-white">{skill.progress}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full ${skill.color}`} style={{ width: `${skill.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
