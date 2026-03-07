"use client";

import React from 'react';
import Link from 'next/link';

const CTASection = () => {
     return (
          <section className="py-24 bg-indigo-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 skew-x-12 -translate-x-1/2" />
               <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                         <h2 className="text-4xl font-bold font-display text-white mb-6">Ready to Start Learning?</h2>
                         <p className="text-indigo-100 text-lg mb-10">Join millions of students from around the world already learning on EduFlow.</p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Link href="/signup" className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl">
                                   Create Free Account
                              </Link>
                              <Link href="/course" className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all border border-indigo-400">
                                   Browse Courses
                              </Link>
                         </div>
                    </div>
               </div>
          </section>
     );
};

export default CTASection;