"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Users,
  Clock,
  Globe,
  Award,
  PlayCircle,
  ChevronDown,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const { data: session } = useSession();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState([0]);

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/course/${id}`, { cache: "no-store" });
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
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Loading Course Details...
        </p>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            The course you are looking for was not found.
          </p>
          <Link
            href="/course"
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold"
          >
            Explore Other Courses
          </Link>
        </div>
      </div>
    );
  }

  const isInstructor = session?.user?.role === "instructor";
  const toggleSection = (index) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/course"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-600 hover:bg-white/20 border border-white/10  text-xs font-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Explore Courses
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider mb-6">
                <Link
                  href="/course"
                  className="hover:text-white transition-colors"
                >
                  Courses
                </Link>
                <span>/</span>
                <span>{course.category}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i <= Math.floor(course?.rating || 0) ?
                            "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold">
                    {course?.rating || 0}
                  </span>
                  <span className="text-slate-400">
                    ({course?.reviewsCount || 0} ratings)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {(course?.studentsCount || 0).toLocaleString()} students
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center">
                  {course.instructorImage ?
                    <img
                      src={course.instructorImage}
                      alt={course.instructorName || course.instructor}
                      className="w-full h-full object-cover"
                    />
                  : <span className="text-xl font-black text-slate-500">
                      {(course.instructorName || course.instructor || "I")[0]}
                    </span>
                  }
                </div>
                <div>
                  <p className="text-sm text-slate-400">Created by</p>
                  <p className="font-bold text-white">
                    {course.instructorName || course.instructor}
                  </p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 pb-20">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-3">
                Course Structure
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight">
                Curriculum
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-2">
                Expand each section to preview lesson flow and video topics.
              </p>
            </div>
            {Array.isArray(course.curriculum) && course.curriculum.length > 0 ?
              <div className="space-y-3">
                {course.curriculum.map((section, idx) => (
                  <div
                    key={section.id || section._id || idx}
                    className="border border-slate-300 rounded-2xl overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full p-5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            expandedSections.includes(idx) ? "rotate-180" : ""
                          }`}
                        />
                        <p className="font-bold text-slate-900">
                          {typeof section === "string" ?
                            section
                          : section.title || `Section ${idx + 1}`}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {Array.isArray(section?.lessons) ?
                          section.lessons.length
                        : 0}{" "}
                        Lessons
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedSections.includes(idx) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 space-y-2 border-t border-slate-100">
                            {(
                              Array.isArray(section?.lessons) &&
                              section.lessons.length > 0
                            ) ?
                              section.lessons.map((lesson, lessonIdx) => (
                                <div
                                  key={`${idx}-${lessonIdx}`}
                                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-medium text-slate-700">
                                      {typeof lesson === "string" ?
                                        lesson
                                      : lesson?.title ||
                                        `Lesson ${lessonIdx + 1}`
                                      }
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    Video
                                  </span>
                                </div>
                              ))
                            : <p className="text-sm text-slate-500 italic px-2">
                                No lessons available in this section.
                              </p>
                            }
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            : <p className="text-slate-500 text-sm italic">
                Curriculum details are not available yet.
              </p>
            }
          </div>

          <div className="relative">
            <div className="sticky mb-10 top-24 space-y-6">
              <div className="bg-white border border-slate-300 rounded-3xl shadow-md shadow-indigo-50 overflow-hidden">
                <div className="relative aspect-video group cursor-pointer">
                  <img
                    src={course.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <PlayCircle className="w-8 h-8 text-indigo-600 fill-indigo-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-bold drop-shadow-md">
                    Preview this course
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold text-slate-900">
                      ${course.price}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      $129.99
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      31% off
                    </span>
                  </div>

                  {!isInstructor ?
                    <div className="space-y-4 mb-8">
                      <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isAddingToCart ?
                          <Loader2 className="w-5 h-5 animate-spin" />
                        : "Add to Cart"}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={isBuying}
                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isBuying ?
                          <Loader2 className="w-5 h-5 animate-spin" />
                        : "Buy Now"}
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
                  : <div className="mb-8 p-6 bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] text-center mb-2">
                        Professional Access
                      </p>
                      <p className="text-slate-400 text-[10px] text-center font-bold leading-relaxed px-4">
                        Acquisition protocols are disabled for instructor
                        accounts.
                      </p>
                    </div>
                  }

                  <p className="text-center text-xs text-slate-400 mb-8">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">
                      This course includes:
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          icon: Clock,
                          text: course.duration || "45.5 hours on-demand video",
                        },
                        { icon: Award, text: "Certificate of completion" },
                        { icon: Globe, text: "Full lifetime access" },
                        { icon: ShieldCheck, text: "Access on mobile and TV" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm text-slate-600"
                        >
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
