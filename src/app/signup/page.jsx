"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, BookOpen, Sparkles, Camera, User, Loader2, GraduationCap, UserCheck, Check } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            role: "student"
        }
    });

    const selectedRole = watch("role");
    const router = useRouter();

    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);

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

    const onSubmit = async (data) => {
        setIsLoading(true);
        let imageUrl = null;
        try {
            if (selectedFile) {
                setIsUploading(true);
                imageUrl = await uploadImage(selectedFile);
                setIsUploading(false);
            }

            const signupData = { ...data, image: imageUrl };

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const result = await res.json();

            if (res.ok) {
                alert("Account created successfully! Please log in.");
                router.push("/login");
            } else {
                alert(result.error || "SignUp failed");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    const handleSocialSignIn = (provider) => {
        signIn(provider, { callbackUrl: "/dashboard" });
    };

    return (
        <main className="flex min-h-screen bg-white">
            {/* Left Side: Branding/Hero (Hidden on Mobile) */}
            <section className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="text-indigo-600 w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold font-display tracking-tight text-white hover:text-indigo-200 transition-colors">EduHub</span>
                    </Link>

                    <h1 className="text-6xl font-black font-display leading-[0.9] mb-8 uppercase tracking-tighter">
                        Start Your <br />
                        <span className="text-indigo-200">Journey.</span>
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-md leading-relaxed font-medium">
                        Join a global community of learners and teachers.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 max-w-md shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black uppercase tracking-widest text-[10px] text-indigo-200">Global Community</p>
                            <p className="font-bold text-xl">1M+ Members</p>
                        </div>
                    </div>
                    <p className="text-indigo-50 leading-relaxed mb-8 font-medium">
                        Learn from the best and grow your career with our expert-led courses.
                    </p>
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <img
                                key={i}
                                className="w-12 h-12 rounded-2xl border-2 border-indigo-600 shadow-xl"
                                src={`https://i.pravatar.cc/150?img=${i + 25}`}
                                alt="User"
                            />
                        ))}
                        <div className="w-12 h-12 rounded-2xl border-2 border-indigo-600 bg-white flex items-center justify-center text-xs font-black text-indigo-600 shadow-xl">
                            +10k
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Right Side: Signup Form */}
            <section className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-lg"
                >
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Sparkles className="w-3 h-3" />
                            Join EduHub
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Sign Up</h2>
                        <p className="text-slate-500 font-medium">Create your account to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <FieldGroup className="gap-6">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center relative transition-transform group-hover:scale-105 duration-500">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-14 h-14 text-slate-300" />
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-xl hover:bg-indigo-600 transition-all border-2 border-white group-hover:scale-110 z-10">
                                        <Camera className="w-5 h-5" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6">Profile Photo</p>
                            </div>

                            <Field>
                                <FieldLabel className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-4 ml-1">Choose Your Role</FieldLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`
                                        relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500
                                        ${selectedRole === "student" ? "border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-2xl" : "border-slate-100 bg-white hover:border-indigo-200 shadow-sm"}
                                    `}>
                                        <input
                                            type="radio"
                                            value="student"
                                            className="hidden"
                                            {...register("role")}
                                        />
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${selectedRole === "student" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 rotate-0" : "bg-slate-100 text-slate-400 -rotate-6"}`}>
                                            <GraduationCap className="w-7 h-7" />
                                        </div>
                                        <span className={`font-black text-sm uppercase tracking-tighter transition-colors ${selectedRole === "student" ? "text-indigo-600" : "text-slate-400"}`}>Student</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Start Learning</span>

                                        {selectedRole === "student" && (
                                            <motion.div
                                                layoutId="role-check"
                                                className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <Check className="w-4 h-4 text-white" />
                                            </motion.div>
                                        )}
                                    </label>

                                    <label className={`
                                        relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500
                                        ${selectedRole === "instructor" ? "border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-2xl" : "border-slate-100 bg-white hover:border-indigo-200 shadow-sm"}
                                    `}>
                                        <input
                                            type="radio"
                                            value="instructor"
                                            className="hidden"
                                            {...register("role")}
                                        />
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${selectedRole === "instructor" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 rotate-0" : "bg-slate-100 text-slate-400 rotate-6"}`}>
                                            <UserCheck className="w-7 h-7" />
                                        </div>
                                        <span className={`font-black text-sm uppercase tracking-tighter transition-colors ${selectedRole === "instructor" ? "text-indigo-600" : "text-slate-400"}`}>Instructor</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Start Teaching</span>

                                        {selectedRole === "instructor" && (
                                            <motion.div
                                                layoutId="role-check"
                                                className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <Check className="w-4 h-4 text-white" />
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                            </Field>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="username" className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-2 ml-1">Username</FieldLabel>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="yourname"
                                        className="bg-white border-slate-100 h-14 rounded-2xl px-6 text-sm font-bold focus:ring-indigo-500 transition-all shadow-sm"
                                        {...register("username", { required: "Username is required" })}
                                    />
                                    {errors.username && <span className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{errors.username.message}</span>}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email" className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-2 ml-1">Email Address</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="bg-white border-slate-100 h-14 rounded-2xl px-6 text-sm font-bold focus:ring-indigo-500 transition-all shadow-sm"
                                        {...register("email", { required: "Email is required" })}
                                    />
                                    {errors.email && <span className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{errors.email.message}</span>}
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="password" className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-2 ml-1">Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="bg-white border-slate-100 h-14 rounded-2xl px-6 text-sm font-bold focus:ring-indigo-500 transition-all shadow-sm"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Min 8 characters" }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{errors.password.message}</span>}
                            </Field>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] mt-4"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Account...
                                    </div>
                                ) : "Create Account"}
                            </Button>
                        </FieldGroup>
                    </form>

                    <div className="my-10 flex items-center gap-6 text-slate-300">
                        <div className="flex-1 h-[1px] bg-slate-200" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">External Auth</span>
                        <div className="flex-1 h-[1px] bg-slate-200" />
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={() => handleSocialSignIn('google')}
                            variant="outline"
                            className="w-full h-14 border-slate-100 hover:bg-white hover:border-indigo-100 hover:text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 transition-all active:scale-95 shadow-sm"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </Button>
                    </div>

                    <p className="mt-12 text-center text-slate-400 font-bold text-xs uppercase tracking-tight">
                        Registered already?{" "}
                        <Link href="/login" className="text-indigo-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
