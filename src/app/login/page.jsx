"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, BookOpen, Star, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();

    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // Effect to redirect when session is established
    React.useEffect(() => {
        if (status === "authenticated" && session?.user?.role) {
            const role = session.user.role;
            if (role === "instructor") {
                router.push("/dashboard/instructor");
            } else {
                router.push("/dashboard/student");
            }
        }
    }, [status, session, router]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                alert("Invalid email or password");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
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
                        Welcome <br />
                        <span className="text-indigo-200">Back.</span>
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-md leading-relaxed font-medium">
                        Log back into your account and continue learning new skills.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 max-w-md shadow-2xl"
                >
                    <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <p className="text-xl italic mb-10 text-indigo-50 font-medium leading-relaxed">
                        "The best learning platform I've used. Everything is so easy and clear."
                    </p>
                    <div className="flex items-center gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
                            alt="Student"
                            className="w-16 h-16 rounded-2xl border-2 border-white/30 shadow-xl"
                        />
                        <div>
                            <p className="font-black text-xl tracking-tight text-white">Alex Johnson</p>
                            <p className="text-xs text-indigo-200 font-black uppercase tracking-widest">Lead Developer</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Right Side: Login Form */}
            <section className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <CheckCircle className="w-3 h-3" />
                            Secure Login
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Login</h2>
                        <p className="text-slate-500 font-medium">Please sign in to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <FieldGroup className="gap-6">
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

                            <Field>
                                <div className="flex items-center justify-between mb-2 ml-1">
                                    <FieldLabel htmlFor="password" className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Password</FieldLabel>
                                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="bg-white border-slate-100 h-14 rounded-2xl px-6 text-sm font-bold focus:ring-indigo-500 transition-all shadow-sm"
                                        {...register("password", { required: "Password is required" })}
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
                                        Checking...
                                    </div>
                                ) : "Sign In"}
                            </Button>
                        </FieldGroup>
                    </form>

                    <div className="my-10 flex items-center gap-6 text-slate-300">
                        <div className="flex-1 h-[1px] bg-slate-200" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">External Sync</span>
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
                        New entity?{" "}
                        <Link href="/signup" className="text-indigo-600 hover:underline">
                            Initialize Identity
                        </Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
