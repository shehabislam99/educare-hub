"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Users, Clock, ChevronDown, LayoutGrid, List } from 'lucide-react';

export default function CoursesPage() {
     const [viewMode, setViewMode] = useState('grid');
     const [selectedCategory, setSelectedCategory] = useState('All');
     const [courses, setCourses] = useState([]);
     const [isLoading, setIsLoading] = useState(true);

     React.useEffect(() => {
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

     return (
          <div className="min-h-screen bg-slate-50 pt-8 pb-20">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12">
                         <h1 className="text-4xl font-bold font-display text-slate-900 mb-4">Explore Courses</h1>
                         <p className="text-slate-600">Discover your next skill from our library of expert-led courses.</p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-12">
                         <div className="flex-1 relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                              <input
                                   type="text"
                                   placeholder="Search for anything (React, UX Design, Business...)"
                                   className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
                              />
                         </div>
                         <div className="flex gap-3">
                              <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                                   <Filter className="w-5 h-5" /> Filters
                              </button>
                              <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                                   <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                        <LayoutGrid className="w-5 h-5" />
                                   </button>
                                   <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                        <List className="w-5 h-5" />
                                   </button>
                              </div>
                         </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                         {/* Sidebar Filters */}
                         <aside className="hidden lg:block w-64 space-y-8">
                              <div>
                                   <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
                                   <div className="space-y-2">
                                        {categories.map((cat) => (
                                             <button
                                                  key={cat}
                                                  onClick={() => setSelectedCategory(cat)}
                                                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
                                             >
                                                  {cat}
                                             </button>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Ratings</h3>
                                   <div className="space-y-2">
                                        {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                             <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                                  <div className="flex items-center gap-1">
                                                       <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((i) => (
                                                                 <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                                            ))}
                                                       </div>
                                                       <span className="text-sm text-slate-600 group-hover:text-slate-900">{rating} & up</span>
                                                  </div>
                                             </label>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price</h3>
                                   <div className="space-y-2">
                                        {['Free', 'Paid', 'On Sale'].map((price) => (
                                             <label key={price} className="flex items-center gap-3 cursor-pointer group">
                                                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{price}</span>
                                             </label>
                                        ))}
                                   </div>
                              </div>
                         </aside>

                         {/* Course Grid */}
                         <div className="flex-1">
                              {isLoading ? (
                                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {[...Array(6)].map((_, i) => (
                                             <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100 shadow-sm" />
                                        ))}
                                   </div>
                              ) : courses.length === 0 ? (
                                   <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center shadow-sm">
                                        <p className="text-xl font-bold text-slate-900">No courses available yet.</p>
                                        <p className="text-slate-500">Check back later or try a different filter.</p>
                                   </div>
                              ) : (
                                   <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                                        {courses.map((course) => (
                                             <Link
                                                  key={course._id || course.id}
                                                  href={`/course/${course._id || course.id}`}
                                                  className={`bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl overflow-hidden group ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                                             >
                                                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-72 h-48 md:h-auto' : 'h-48'}`}>
                                                       <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                                            {course.category}
                                                       </div>
                                                  </div>
                                                  <div className="p-6 flex-1 flex flex-col">
                                                       <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                                                                 {(course.instructorName || course.instructor || "I")[0]}
                                                            </div>
                                                            <span className="text-xs font-medium text-slate-500">{course.instructorName || course.instructor || "Instructor"}</span>
                                                       </div>
                                                       <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                            {course.title}
                                                       </h3>
                                                       <div className="flex items-center gap-4 mb-4">
                                                            <div className="flex items-center gap-1">
                                                                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                 <span className="text-sm font-bold text-slate-700">{course.rating || 0}</span>
                                                            </div>
                                                            <span className="text-sm text-slate-400">({course.reviewsCount || 0})</span>
                                                       </div>

                                                       {viewMode === 'list' && (
                                                            <p className="text-sm text-slate-500 mb-6 line-clamp-2 italic">{course.description}</p>
                                                       )}

                                                       <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                                            <span className="text-xl font-bold text-slate-900">${course.price}</span>
                                                            <div className="flex items-center gap-4">
                                                                 <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                                      <Clock className="w-4 h-4" /> {course.duration || "N/A"}
                                                                 </div>
                                                                 <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                                      <Users className="w-4 h-4" /> {(course.studentsCount || 0).toLocaleString()}
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </Link>
                                        ))}
                                   </div>
                              )}
                         </div>

                         {/* Pagination */}
                         <div className="mt-16 flex justify-center">
                              <nav className="flex items-center gap-2">
                                   <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
                                        <ChevronDown className="w-5 h-5 rotate-90" />
                                   </button>
                                   {[1, 2, 3, '...', 12].map((page, i) => (
                                        <button
                                             key={i}
                                             className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${page === 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                                        >
                                             {page}
                                        </button>
                                   ))}
                                   <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors">
                                        <ChevronDown className="w-5 h-5 -rotate-90" />
                                   </button>
                              </nav>
                         </div>
                    </div>
               </div>
          </div>
     );
}