"use client";

import React, { useEffect, useState } from 'react';
import { MOCK_COURSES } from '@/constants';
import { Edit, Trash2, Eye, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ManageCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/course');
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                console.error(err);
                setCourses(MOCK_COURSES); // Fallback
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-100 pt-8 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Courses</h1>
                        <p className="text-sm text-slate-500">Edit, update or remove your curriculum.</p>
                    </div>
                    <Link href="/dashboard/instructor/create-course" className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        <Plus className="w-5 h-5" />
                        New Course
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full bg-slate-50 border-none rounded-xl pl-10 py-2.5 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Detail</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Enrolled</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-8 h-16 bg-slate-50/20" />
                                        </tr>
                                    ))
                                ) : (
                                    courses.map((course) => (
                                        <tr key={course.id || course._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{course.title}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">{course.level || 'Beginner'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{course.category || 'Development'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-bold text-slate-900">${course.price}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-medium text-slate-600">84</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Preview">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
