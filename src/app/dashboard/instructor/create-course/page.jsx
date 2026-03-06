"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, DollarSign, Image as ImageIcon, Layout, Save, X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                alert('Course created successfully!');
                router.push('/dashboard/instructor');
            } else {
                alert('Failed to create course');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-100 pt-8 pb-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
                        <p className="text-sm text-slate-500">Fill in the details to launch your new course.</p>
                    </div>
                    <button onClick={() => router.back()} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <BookOpen className="text-indigo-600 w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl h-12 px-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="e.g. Advanced Next.js Mastery"
                                />
                                {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    rows={4}
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Tell students what they will learn..."
                                />
                                {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Media */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                    <DollarSign className="text-green-600 w-4 h-4" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Pricing</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input
                                        type="number"
                                        {...register('price', { required: 'Price is required' })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-xl h-12 pl-8 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="text-blue-600 w-4 h-4" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Course Thumbnail</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Thumbnail URL</label>
                                <input
                                    {...register('thumbnail', { required: 'Thumbnail is required' })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl h-12 px-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 text-white font-bold py-3 px-10 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Publish Course
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
