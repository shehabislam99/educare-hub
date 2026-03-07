"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Star, Users, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingCard from './FloatingCard';
import { Button } from '@/components/ui/button';
import image from '../../assets/photo-1522202176988-66273c2fd55f.avif';

const HeroSection = () => {
     const [courseCount, setCourseCount] = useState(0);

     useEffect(() => {
          const fetchCounts = async () => {
               try {
                    const res = await fetch('/api/course', { cache: 'no-store' });
                    if (res.ok) {
                         const courses = await res.json();
                         setCourseCount(courses.length);
                    }
               } catch (error) {
                    console.error("Error fetching course counts:", error);
               }
          };
          fetchCounts();
     }, []);

     return (
          <section className="relative py-24 overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
               </div>

               <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                         {/* Left: Text Content */}
                         <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6 }}
                              
                         >
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 mb-6">
                                   <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                                   <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">New Courses Available</span>
                              </div>
                              <h1 className="text-5xl lg:text-7xl font-bold font-display tracking-tight leading-[1.1] mb-6">
                                   Master New Skills <br />
                                   <span className="text-indigo-600">Anytime, Anywhere</span>
                              </h1>
                              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                                   Join over 25 thousand learners and start your journey today. Access high-quality courses from industry experts and top universities.
                              </p>
                              <div className="flex flex-col sm:flex-row gap-4">
                                   <Button asChild size="lg" className="text-lg">
                                        <Link href="/course">
                                             Get Started <ArrowRight className="w-5 h-5" />
                                        </Link>
                                   </Button>
                                   <Button variant="outline" size="lg" className="text-lg hover:bg-indigo-50 hover:border-indigo-300">
                                        <Play className="w-5 h-5 " /> Watch Demo
                                   </Button>
                              </div>

                              {/* Social Proof */}
                              <div className="mt-12 flex items-center gap-8 ">
                                   <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                             <img
                                                  key={i}
                                                  className="w-10 h-10 rounded-full border-2 border-white"
                                                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                                  alt="User"
                                             />
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                                             +5k
                                        </div>
                                   </div>
                                   <div>
                                        <div className="flex items-center gap-1 mb-1">
                                             {[1, 2, 3, 4, 5].map((i) => (
                                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                             ))}
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Trusted by 25,000+ students</p>
                                   </div>
                              </div>
                         </motion.div>

                         {/* Right: Hero Image with Floating Cards */}
                         <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="relative"
                         >
                              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-indigo-950/60 border-8 border-white dark:border-slate-900">
                                   <img
                                        src={image.src || image}
                                        alt="Students learning"
                                        className="w-full h-full object-cover"
                                   />
                              </div>

                              <FloatingCard className="-top-6 -right-6 p-4 animate-bounce-slow">
                                   <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                             <Award className="text-green-600 w-6 h-6" />
                                        </div>
                                        <div>
                                             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certified Courses</p>
                                             <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{courseCount || "Loading..."}+ Available</p>
                                        </div>
                                   </div>
                              </FloatingCard>

                              <FloatingCard className="-bottom-10 -left-10 p-6">
                                   <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                             <Users className="text-indigo-600 w-6 h-6" />
                                        </div>
                                        <div>
                                             <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">25k+</p>
                                             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Learners</p>
                                        </div>
                                   </div>
                              </FloatingCard>
                         </motion.div>
                    </div>
               </div>
          </section>
     );
};

export default HeroSection;
