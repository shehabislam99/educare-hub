"use client";

import React from 'react';
import { BookOpen, Globe, Zap } from 'lucide-react';

const features = [
     {
          icon: BookOpen,
          title: 'Expert Instructors',
          desc: 'Learn from industry professionals with years of experience.',
          color: 'indigo',
     },
     {
          icon: Globe,
          title: 'Learn Anywhere',
          desc: 'Access your courses on any device, anytime, anywhere in the world.',
          color: 'blue',
     },
     {
          icon: Zap,
          title: 'Lifetime Access',
          desc: 'Once you enroll, you have lifetime access to the course materials.',
          color: 'orange',
     },
];

const FeaturesSection = () => {
     return (
       <section>
         <div className="mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">
               Why Choose EduFlow?
             </h2>
             <p className="text-slate-600">
               We provide the best learning experience with top-notch features
               designed for your success.
             </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {features.map((feature, i) => (
               <div
                 key={i}
                 className="bg-white  shadow-md shadow-indigo-50 border border-slate-300 rounded-3xl p-8 group"
               >
                 <div
                   className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                 >
                   <feature.icon
                     className={`text-${feature.color}-600 w-8 h-8`}
                   />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">
                   {feature.title}
                 </h3>
                 <p className="text-slate-600 leading-relaxed">
                   {feature.desc}
                 </p>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
};

export default FeaturesSection;