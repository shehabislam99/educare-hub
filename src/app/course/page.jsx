"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Users, Clock, ChevronDown, LayoutGrid, List, Sparkles, BookOpen, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoursesPage() {
     const [viewMode, setViewMode] = useState('grid');
     const [selectedCategory, setSelectedCategory] = useState('All');
     const [searchQuery, setSearchQuery] = useState('');
     const [courses, setCourses] = useState([]);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const fetchCourses = async () => {
               try {
                    const res = await fetch('/api/course');
                    if (res.ok) {
                         const data = await res.json();
                         setCourses(data);
                    }
               } catch (error) {
                    console.error("Error fetching courses:", error);
               } finally {
                    setIsLoading(false);
               }
          };
          fetchCourses();
     }, []);

     const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science'];

     const filteredCourses = courses.filter(course => {
          const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
          const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (course.instructorName || course.instructor || "").toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
     });

     return (
          <div className="min-h-screen bg-[#FDFDFF] pb-32">
               {/* Premium Header Section */}
               <div className="bg-slate-900 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,#4338ca_0%,transparent_50%)] opacity-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_120%,#312e81_0%,transparent_40%)] opacity-30" />

                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="max-w-3xl"
                         >
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 backdrop-blur-md">
                                   <Sparkles className="w-3 h-3 text-indigo-400" />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Learn New Skills</span>
                              </div>
                              <h1 className="text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight">
                                   Find the Best <br />
                                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-black italic">Courses for Your Future.</span>
                              </h1>
                              <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
                                   Explore professional courses designed for your career growth.
                                   Stay ahead with the latest skills.
                              </p>

                              {/* Search Bar Redesign */}
                              <div className="relative max-w-2xl group">
                                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
                                   <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden focus-within:bg-white/10 transition-all">
                                        <Search className="absolute left-6 text-slate-500 w-5 h-5 pointer-events-none" />
                                        <input
                                             type="text"
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             placeholder="Search for courses..."
                                             className="w-full bg-transparent text-white pl-16 pr-24 py-5 outline-none font-medium placeholder:text-slate-600 tracking-tight"
                                        />
                                        <button className="absolute right-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                                             Search
                                        </button>
                                   </div>
                              </div>
                         </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDFDFF] to-transparent" />
               </div>

               <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <div className="flex flex-col lg:flex-row gap-12">
                         {/* Sidebar Filters - Redesigned as a Floating Glass Panel */}
                         <aside className="hidden lg:block w-72 shrink-0">
                              <div className="sticky top-24 space-y-8 bg-white/70 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50">
                                   <div>
                                        <div className="flex items-center gap-2 mb-6">
                                             <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                                             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Categories</h3>
                                        </div>
                                        <div className="space-y-1.5">
                                             {categories.map((cat) => (
                                                  <button
                                                       key={cat}
                                                       onClick={() => setSelectedCategory(cat)}
                                                       className={`w-full group text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all relative overflow-hidden ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                                  >
                                                       <span className="relative z-10 flex items-center justify-between">
                                                            {cat}
                                                            {selectedCategory === cat && <motion.div layoutId="activeCat" className="w-1 h-1 bg-white rounded-full" />}
                                                       </span>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-2 mb-6 pt-6 border-t border-slate-50">
                                             <div className="w-1.5 h-4 bg-yellow-400 rounded-full" />
                                             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Rating</h3>
                                        </div>
                                        <div className="space-y-3">
                                             {[4.5, 4.0, 3.5].map((rating) => (
                                                  <label key={rating} className="flex items-center gap-4 cursor-pointer group px-2">
                                                       <div className="relative flex items-center justify-center">
                                                            <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-200 checked:bg-indigo-600 checked:border-indigo-600 transition-all" />
                                                            <X className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                       </div>
                                                       <div className="flex items-center gap-1.5">
                                                            <div className="flex gap-0.5">
                                                                 <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                            </div>
                                                            <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-900">{rating}+ Rating</span>
                                                       </div>
                                                  </label>
                                             ))}
                                        </div>
                                   </div>

                                   <div className="pt-8 group">
                                        <div className="bg-slate-900 p-6 rounded-[2rem] relative overflow-hidden">
                                             <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full" />
                                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Instructor Hub</p>
                                             <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">Want to teach your own courses?</p>
                                             <Link href="/signup?role=instructor" className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                                  Join Now <ArrowRight className="w-3 h-3" />
                                             </Link>
                                        </div>
                                   </div>
                              </div>
                         </aside>

                         {/* Main Content Area */}
                         <div className="flex-1">
                              {/* Top Bar / View Toggle */}
                              <div className="flex items-center justify-between mb-10">
                                   <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Courses</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black">
                                             {filteredCourses.length}
                                        </span>
                                   </div>

                                   <div className="flex items-center gap-6">
                                        <div className="flex bg-white/50 backdrop-blur border border-slate-100 rounded-2xl p-1 shadow-sm">
                                             <button
                                                  onClick={() => setViewMode('grid')}
                                                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                             >
                                                  <LayoutGrid className="w-4 h-4" />
                                             </button>
                                             <button
                                                  onClick={() => setViewMode('list')}
                                                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                             >
                                                  <List className="w-4 h-4" />
                                             </button>
                                        </div>
                                   </div>
                              </div>

                              <AnimatePresence mode="popLayout">
                                   {isLoading ? (
                                        <motion.div
                                             key="loading"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}
                                             className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                        >
                                             {[...Array(6)].map((_, i) => (
                                                  <div key={i} className="bg-white rounded-[2.5rem] h-[26rem] animate-pulse border border-slate-100 shadow-sm" />
                                             ))}
                                        </motion.div>
                                   ) : filteredCourses.length === 0 ? (
                                        <motion.div
                                             key="empty"
                                             initial={{ opacity: 0, scale: 0.95 }}
                                             animate={{ opacity: 1, scale: 1 }}
                                             className="bg-white p-32 rounded-[3.5rem] border border-slate-100 text-center shadow-2xl shadow-slate-200/50"
                                        >
                                             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                                  <BookOpen className="w-10 h-10 text-slate-300" />
                                             </div>
                                             <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display uppercase tracking-tight">No Courses Found</h2>
                                             <p className="text-slate-500 font-medium max-w-sm mx-auto">We couldn't find any courses matching your search.</p>
                                             <button
                                                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                                  className="mt-10 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all"
                                             >
                                                  Reset Search
                                             </button>
                                        </motion.div>
                                   ) : (
                                        <motion.div
                                             key="grid"
                                             layout
                                             className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}
                                        >
                                             {filteredCourses.map((course) => (
                                                  <motion.div
                                                       key={course._id || course.id}
                                                       layout
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       whileHover={{ y: -8 }}
                                                       transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                                  >
                                                       <Link
                                                            href={`/course/${course._id || course.id}`}
                                                            className={`block bg-white shadow-2xl shadow-slate-200 border border-slate-100 rounded-[2.5rem] overflow-hidden group h-full ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                                                       >
                                                            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-[28rem] h-64 md:h-auto' : 'h-56'}`}>
                                                                 <img
                                                                      src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                                                                      alt={course.title}
                                                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                                 />
                                                                 <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-xl shadow-black/5">
                                                                      {course.category}
                                                                 </div>
                                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>

                                                            <div className="p-8 flex-1 flex flex-col justify-between">
                                                                 <div>
                                                                      <div className="flex items-center gap-3 mb-5">
                                                                           <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">
                                                                                {(course.instructorName || course.instructor || "M")[0]}
                                                                           </div>
                                                                           <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{course.instructorName || course.instructor || "Instructor"}</span>
                                                                      </div>

                                                                      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                                           {course.title}
                                                                      </h3>

                                                                      <div className="flex items-center gap-5 mb-8">
                                                                           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                                <span className="text-xs font-black text-slate-800">{course.rating || "4.8"}</span>
                                                                           </div>
                                                                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{(course.reviewsCount || 0).toLocaleString()} Reviews</span>
                                                                      </div>

                                                                      {viewMode === 'list' && (
                                                                           <p className="text-sm text-slate-500 mb-8 max-w-2xl font-medium leading-relaxed italic">{course.description}</p>
                                                                      )}
                                                                 </div>

                                                                 <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                                                      <div className="flex flex-col">
                                                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</span>
                                                                           <span className="text-2xl font-black text-slate-900 tracking-tight">${course.price}</span>
                                                                      </div>

                                                                      <div className="flex items-center gap-5 px-5 py-3 bg-slate-50 rounded-2xl">
                                                                           <div className="flex items-center gap-2">
                                                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{course.duration || "45H"}</span>
                                                                           </div>
                                                                           <div className="w-px h-3 bg-slate-200" />
                                                                           <div className="flex items-center gap-2">
                                                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{(course.studentsCount || 0).toLocaleString()}</span>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </Link>
                                                  </motion.div>
                                             ))}
                                        </motion.div>
                                   )}
                              </AnimatePresence>

                              {/* Pagination Redesign as Premium Control */}
                              <div className="mt-24 flex flex-col items-center gap-8">
                                   <div className="h-px w-24 bg-slate-100" />
                                   <nav className="flex items-center gap-3">
                                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group">
                                             <ChevronDown className="w-5 h-5 rotate-90 group-hover:scale-110 transition-transform" />
                                        </button>

                                        {[1, 2, 3].map((page) => (
                                             <button
                                                  key={page}
                                                  className={`w-12 h-12 rounded-2xl font-black text-xs uppercase transition-all shadow-sm ${page === 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
                                             >
                                                  {page}
                                             </button>
                                        ))}

                                        <div className="px-3 text-slate-300 font-bold tracking-widest text-[10px] uppercase">Nexus</div>

                                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group">
                                             <ChevronDown className="w-5 h-5 -rotate-90 group-hover:scale-110 transition-transform" />
                                        </button>
                                   </nav>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">End of Result Node</p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}