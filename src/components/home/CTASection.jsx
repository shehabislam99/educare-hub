"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CTASection = () => {
     return (
          <section className="py-24 bg-indigo-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 skew-x-12 -translate-x-1/2" />
               <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                         <h2 className="text-4xl font-bold font-display text-white mb-6">Ready to Start Learning?</h2>
                         <p className="text-indigo-100 text-lg mb-10">Join millions of students from around the world already learning on EduFlow.</p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm">
                                   <Link href="/signup">Create Free Account</Link>
                              </Button>
                              <Button asChild size="lg" className="bg-indigo-500 text-white hover:bg-indigo-400 border border-indigo-400 shadow-sm">
                                   <Link href="/course">Browse Courses</Link>
                              </Button>
                         </div>
                    </div>
               </div>
          </section>
     );
};

export default CTASection;
