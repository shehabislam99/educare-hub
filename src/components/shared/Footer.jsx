import React from "react";
import Link from "next/link";
import logo from "../../assets/istockphoto-1215255370-612x612.jpg"

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-12">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center overflow-hidden">
                                <img src={logo.src || logo} alt="EduHub Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold font-display tracking-tight text-white hover:text-indigo-400 transition-colors">
                                EduHub
                            </span>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed text-sm font-medium">
                            Empowering learners worldwide with high-quality,
                            accessible education from industry experts. Join our community of learners.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-6">Platform</h4>
                        <ul className="space-y-4 text-slate-400 text-sm font-bold">
                            <li>
                                <Link href="/course" className="hover:text-white transition-colors">
                                    Browse Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/instructor" className="hover:text-white transition-colors">
                                    Instructor Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/student" className="hover:text-white transition-colors">
                                    Student Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-6">Company</h4>
                        <ul className="space-y-4 text-slate-400 text-sm font-bold">
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        © 2024 EduHub Inc. All Rights Reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><span className="text-[10px] font-black uppercase tracking-widest">Twitter</span></a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
