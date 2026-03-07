"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Users, Clock, Globe, Award, PlayCircle, ChevronDown, CheckCircle, Share2, Heart, ShieldCheck, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function CourseDetailsPage() {
     const params = useParams();
     const id = params?.id;
     const { data: session } = useSession();

     const [course, setCourse] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [activeTab, setActiveTab] = useState('overview');
     const [expandedSections, setExpandedSections] = useState(['s1']);
     const [isAddingToCart, setIsAddingToCart] = useState(false);
     const [isBuying, setIsBuying] = useState(false);
     const [cartMessage, setCartMessage] = useState("");

     useEffect(() => {
          if (!id) return;
          const fetchCourse = async () => {
               try {
                    const res = await fetch(`/api/course/${id}`);
                    if (res.ok) {
                         const data = await res.json();
                         setCourse(data);
                    }
               } catch (error) {
                    console.error("Error fetching course:", error);
               } finally {
                    setIsLoading(false);
               }
          };
          fetchCourse();
     }, [id]);

     const toggleSection = (sectionId) => {
          setExpandedSections(prev =>
               prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
          );
     };

     const handleAddToCart = () => {
          setIsAddingToCart(true);
          setTimeout(() => {
               setIsAddingToCart(false);
               setCartMessage("Added to cart!");
               setTimeout(() => setCartMessage(""), 3000);
          }, 800);
     };

     const handleBuyNow = () => {
          setIsBuying(true);
          setTimeout(() => {
               setIsBuying(false);
               alert("Redirecting to checkout...");
          }, 800);
     };

     if (isLoading) {
          return (
               <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Course Details...</p>
               </div>
          );
     }

     if (!course) {
          return (
               <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                         <ShieldCheck className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="text-center">
                         <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
                         <p className="text-slate-500 mb-8">The course you are looking for was not found.</p>
                         <Link href="/course" className="btn-primary px-8 py-3">Explore Other Courses</Link>
                    </div>
               </div>
          );
     }

     const isInstructor = session?.user?.role === "instructor";

     return (
          <div className="min-h-screen bg-white">
               {/* Hero Header */}
               <div className="bg-slate-900 text-white pt-12 pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="grid lg:grid-cols-3 gap-12">
                              <div className="lg:col-span-2">
                                   <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider mb-6">
                                        <Link href="/course" className="hover:text-white transition-colors">Courses</Link>
                                        <span>/</span>
                                        <span>{course.category}</span>
                                   </div>
                                   <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">{course.title}</h1>
                                   <p className="text-xl text-slate-300 mb-8 leading-relaxed">{course.description}</p>

                                   <div className="flex flex-wrap items-center gap-6 mb-8">
                                        <div className="flex items-center gap-2">
                                             <div className="flex gap-0.5">
                                                  {[1, 2, 3, 4, 5].map((i) => (
                                                       <Star key={i} className={`w-4 h-4 ${i <= Math.floor(course?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                                                  ))}
                                             </div>
                                             <span className="text-yellow-400 font-bold">{course?.rating || 0}</span>
                                             <span className="text-slate-400">({course?.reviewsCount || 0} ratings)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <Users className="w-4 h-4" />
                                             <span>{(course?.studentsCount || 0).toLocaleString()} students</span>
                                        </div>
                                   </div>

                                   <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center">
                                             {course.instructorImage ? (
                                                  <img src={course.instructorImage} alt={course.instructorName || course.instructor} className="w-full h-full object-cover" />
                                             ) : (
                                                  <span className="text-xl font-black text-slate-500">{(course.instructorName || course.instructor || "I")[0]}</span>
                                             )}
                                        </div>
                                        <div>
                                             <p className="text-sm text-slate-400">Created by</p>
                                             <p className="font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors">{course.instructorName || course.instructor}</p>
                                        </div>
                                        <div className="ml-8 flex items-center gap-6 text-sm text-slate-400">
                                             <div className="flex items-center gap-2">
                                                  <Globe className="w-4 h-4" /> English
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <Award className="w-4 h-4" /> Certificate
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Main Content */}
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                    <div className="grid lg:grid-cols-3 gap-12">
                         {/* Left Column */}
                         <div className="lg:col-span-2 pb-20">
                              {/* Tabs */}
                              <div className="flex border-b border-slate-100 mb-8 overflow-x-auto">
                                   {['overview', 'curriculum', 'reviews'].map((tab) => (
                                        <button
                                             key={tab}
                                             onClick={() => setActiveTab(tab)}
                                             className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                        >
                                             {tab}
                                        </button>
                                   ))}
                              </div>

                              <AnimatePresence mode="wait">
                                   {activeTab === 'overview' && (
                                        <motion.div
                                             initial={{ opacity: 0, y: 10 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             exit={{ opacity: 0, y: -10 }}
                                             className="space-y-12"
                                        >
                                             <div>
                                                  <div className="flex items-center justify-between mb-6">
                                                       <h2 className="text-2xl font-bold text-slate-900">What you'll learn</h2>
                                                       <button
                                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                                                       >
                                                            <Sparkles className="w-4 h-4" /> AI Summary
                                                       </button>
                                                  </div>

                                                  <div className="grid md:grid-cols-2 gap-4">
                                                       {[
                                                            'Build 16 web development projects for your portfolio',
                                                            'Master React Hooks, Context API, and Redux',
                                                            'Build professional websites with Tailwind CSS',
                                                            'Create backend APIs with Node.js and Express',
                                                            'Deploy your applications to Vercel and Netlify',
                                                            'Learn modern JavaScript (ES6+) fundamentals'
                                                       ].map((item, i) => (
                                                            <div key={i} className="flex gap-3">
                                                                 <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                                 <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>

                                             <div>
                                                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Requirements</h2>
                                                  <ul className="list-disc list-inside space-y-3 text-slate-600 text-sm">
                                                       <li>No prior coding experience required - we start from scratch!</li>
                                                       <li>A computer (Windows, Mac, or Linux) with internet access</li>
                                                       <li>Basic understanding of how to use a web browser</li>
                                                  </ul>
                                             </div>
                                        </motion.div>
                                   )}

                                   {activeTab === 'curriculum' && (
                                        <motion.div
                                             initial={{ opacity: 0, y: 10 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             exit={{ opacity: 0, y: -10 }}
                                             className="space-y-4"
                                        >
                                             <div className="flex justify-between items-center mb-6">
                                                  <p className="text-sm text-slate-500 font-medium">
                                                       {course.curriculum.length} sections • {course.curriculum.reduce((acc, s) => acc + s.lessons.length, 0)} lectures • {course.duration} total length
                                                  </p>
                                                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Expand all sections</button>
                                             </div>

                                             {course.curriculum.map((section) => (
                                                  <div key={section.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                                                       <button
                                                            onClick={() => toggleSection(section.id)}
                                                            className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
                                                       >
                                                            <div className="flex items-center gap-4">
                                                                 <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`} />
                                                                 <span className="font-bold text-slate-900">{section.title}</span>
                                                            </div>
                                                            <span className="text-sm text-slate-500">{section.lessons.length} lectures</span>
                                                       </button>

                                                       <AnimatePresence>
                                                            {expandedSections.includes(section.id) && (
                                                                 <motion.div
                                                                      initial={{ height: 0 }}
                                                                      animate={{ height: 'auto' }}
                                                                      exit={{ height: 0 }}
                                                                      className="overflow-hidden bg-white"
                                                                 >
                                                                      {section.lessons.map((lesson) => (
                                                                           <div key={lesson.id} className="flex items-center justify-between p-5 border-t border-slate-50 hover:bg-slate-50 transition-colors group">
                                                                                <div className="flex items-center gap-4">
                                                                                     <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                                                                                     <span className="text-sm text-slate-700">{lesson.title}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                     <span className="text-xs text-slate-400">{lesson.duration}</span>
                                                                                     {!lesson.isLocked ? (
                                                                                          <button className="text-xs font-bold text-indigo-600 hover:underline">Preview</button>
                                                                                     ) : (
                                                                                          <ShieldCheck className="w-4 h-4 text-slate-300" />
                                                                                     )}
                                                                                </div>
                                                                           </div>
                                                                      ))}
                                                                 </motion.div>
                                                            )}
                                                       </AnimatePresence>
                                                  </div>
                                             ))}
                                        </motion.div>
                                   )}
                              </AnimatePresence>
                         </div>

                         {/* Right Column - Floating Sidebar */}
                         <div className="relative">
                              <div className="sticky top-24 space-y-6">
                                   <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-indigo-100 overflow-hidden">
                                        <div className="relative aspect-video group cursor-pointer">
                                             <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                                       <PlayCircle className="w-8 h-8 text-indigo-600 fill-indigo-600" />
                                                  </div>
                                             </div>
                                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-bold drop-shadow-md">Preview this course</div>
                                        </div>

                                        <div className="p-8">
                                             <div className="flex items-baseline gap-3 mb-6">
                                                  <span className="text-4xl font-bold text-slate-900">${course.price}</span>
                                                  <span className="text-lg text-slate-400 line-through">$129.99</span>
                                                  <span className="text-sm font-bold text-green-600">31% off</span>
                                             </div>

                                             {!isInstructor ? (
                                                  <div className="space-y-4 mb-8">
                                                       <button
                                                            onClick={handleAddToCart}
                                                            disabled={isAddingToCart}
                                                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                                                       >
                                                            {isAddingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add to Cart"}
                                                       </button>
                                                       <button
                                                            onClick={handleBuyNow}
                                                            disabled={isBuying}
                                                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
                                                       >
                                                            {isBuying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buy Now"}
                                                       </button>

                                                       <AnimatePresence>
                                                            {cartMessage && (
                                                                 <motion.p
                                                                      initial={{ opacity: 0, y: 10 }}
                                                                      animate={{ opacity: 1, y: 0 }}
                                                                      exit={{ opacity: 0 }}
                                                                      className="text-center text-green-600 font-bold text-xs uppercase tracking-widest"
                                                                 >
                                                                      {cartMessage}
                                                                 </motion.p>
                                                            )}
                                                       </AnimatePresence>
                                                  </div>
                                             ) : (
                                                  <div className="mb-8 p-6 bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                                                       <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                       <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] text-center mb-2">Professional Access</p>
                                                       <p className="text-slate-400 text-[10px] text-center font-bold leading-relaxed px-4">
                                                            Acquisition protocols are disabled for instructor accounts.
                                                       </p>
                                                  </div>
                                             )}

                                             <p className="text-center text-xs text-slate-400 mb-8">30-Day Money-Back Guarantee</p>

                                             <div className="space-y-4">
                                                  <h4 className="text-sm font-bold text-slate-900">This course includes:</h4>
                                                  <div className="space-y-3">
                                                       {[
                                                            { icon: Clock, text: course.duration || '45.5 hours on-demand video' },
                                                            { icon: Award, text: 'Certificate of completion' },
                                                            { icon: Globe, text: 'Full lifetime access' },
                                                            { icon: ShieldCheck, text: 'Access on mobile and TV' }
                                                       ].map((item, i) => (
                                                            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                                 <item.icon className="w-4 h-4 text-slate-400" />
                                                                 <span>{item.text}</span>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>

                                             <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-slate-50">
                                                  <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                                                       <Share2 className="w-4 h-4" /> Share
                                                  </button>
                                                  <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors">
                                                       <Heart className="w-4 h-4" /> Wishlist
                                                  </button>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Instructor Card */}
                                   <div className="card p-6 bg-slate-50 border-slate-200">
                                        <div className="flex items-center gap-4 mb-4">
                                             <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl font-black text-slate-300 overflow-hidden">
                                                  {course.instructorImage ? (
                                                       <img src={course.instructorImage} alt="" className="w-full h-full object-cover" />
                                                  ) : (
                                                       (course.instructorName || course.instructor || "I")[0]
                                                  )}
                                             </div>
                                             <div>
                                                  <h4 className="font-bold text-slate-900">{course.instructorName || course.instructor}</h4>
                                                  <p className="text-xs text-slate-500">Professional Mentor</p>
                                             </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                             <div className="text-center p-3 bg-slate-50 rounded-xl">
                                                  <p className="text-lg font-bold text-slate-900">{course.rating || "4.8"}</p>
                                                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rating</p>
                                             </div>
                                             <div className="text-center p-3 bg-slate-50 rounded-xl">
                                                  <p className="text-lg font-bold text-slate-900">{(course.studentsCount || 0).toLocaleString()}</p>
                                                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Students</p>
                                             </div>
                                        </div>
                                        <button className="w-full btn-secondary py-2 text-sm">View Profile</button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}