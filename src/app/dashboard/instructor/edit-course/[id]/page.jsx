"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, DollarSign, Image as ImageIcon, Save, ArrowLeft, Loader2, Camera, Trash2, Sparkles } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { uploadImage } from '@/lib/uploadImage';

export default function EditCoursePage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/course/${id}`);
                if (!res.ok) throw new Error("Course not found");
                const data = await res.json();

                const userId = session?.user?.id || session?.user?.email;
                if (data.instructorId && userId && data.instructorId !== userId) {
                    alert("You do not have permission to edit this course.");
                    router.push('/dashboard/instructor/manage-course');
                    return;
                }

                reset(data);
                if (data.thumbnail) {
                    setImagePreview(data.thumbnail);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to load course details.");
                router.push('/dashboard/instructor/manage-course');
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user && id) {
            fetchCourse();
        }
    }, [id, session, reset, router]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        let imageUrl = imagePreview;

        try {
            if (selectedFile) {
                setIsUploading(true);
                imageUrl = await uploadImage(selectedFile);
                setIsUploading(false);
            }

            const updatePayload = {
                ...data,
                thumbnail: imageUrl,
            };

            const res = await fetch(`/api/course/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });
            if (res.ok) {
                alert('Course updated successfully!');
                router.push('/dashboard/instructor/manage-course');
            } else {
                alert('Failed to update course');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-4">
            {/* Header */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Edit Deployment</h1>
                    <p className="text-slate-500 font-medium">Refining: <span className="text-indigo-600 font-bold">{id}</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Content Matrix */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Sparkles className="text-indigo-600 w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Core Configuration</h2>
                    </div>

                    <div className="grid gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                className="w-full bg-slate-50 border-none rounded-2xl h-14 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                            />
                            {errors.title && <span className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.title.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Curriculum Breakdown</label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                rows={6}
                                className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 leading-relaxed"
                            />
                            {errors.description && <span className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.description.message}</span>}
                        </div>
                    </div>
                </div>

                {/* Economic & Visual Parameters */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <DollarSign className="text-emerald-600 w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Economic Value</h2>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price ($)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    {...register('price', { required: 'Price is required' })}
                                    className="w-full bg-slate-50 border-none rounded-2xl h-14 pl-12 pr-6 text-sm font-black focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 text-slate-900">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <ImageIcon className="text-indigo-600 w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tighter">Visual Asset</h2>
                        </div>

                        <div className="relative group aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-all">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <Camera className="w-8 h-8 text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Image</span>
                                </div>
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                </div>
                            )}

                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-6 pt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/instructor/manage-course')}
                        className="text-sm font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-slate-900 text-white font-black py-4 px-12 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 uppercase text-xs tracking-[0.2em]"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Synchronizing...' : 'Commit Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
