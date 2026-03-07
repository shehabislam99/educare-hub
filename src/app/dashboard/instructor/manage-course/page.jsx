"use client";

import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Search, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ManageCoursesPage() {
    const { data: session } = useSession();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCourses = async () => {
        if (!session?.user) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/my-courses`);
            const data = await res.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchCourses();
        }
    }, [session]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const res = await fetch(`/api/course/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Course deleted successfully!");
                fetchCourses(); // Refresh
            } else {
                alert("Failed to delete course");
            }
        } catch (err) {
            alert("An error occurred during deletion");
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Curriculum Control</h1>
                    <p className="text-slate-500 font-medium">Manage and optimize your active course deployments.</p>
                </div>
                <Link href="/dashboard/instructor/create-course" className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    New Course
                </Link>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row gap-6 justify-between items-center text-slate-900">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Filter your database..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Total Assets: <span className="text-indigo-600 font-black">{filteredCourses.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Deployed</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-10 h-16 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                                                <Search className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <p className="font-bold text-slate-400">No matching courses found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course._id || course.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-100 border border-slate-50">
                                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{course.title}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{course.level || 'Standard'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">{course.category || 'General'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-black text-slate-900">${course.price}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-xs font-bold text-slate-500">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/dashboard/instructor/edit-course/${course._id || course.id}`}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(course._id || course.id)}
                                                    className="p-3 bg-red-50/50 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                                    title="Delete"
                                                >
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
        </div>
    );
}
