"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Save, X, Camera, Loader2, Plus, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";

const emptySection = { title: "", lessons: [""] };

function normalizeCurriculum(input) {
  if (!Array.isArray(input) || input.length === 0) {
    return [{ ...emptySection }];
  }

  return input.map((section) => ({
    title: section?.title || "",
    lessons:
      Array.isArray(section?.lessons) && section.lessons.length > 0
        ? section.lessons.map((lesson) => lesson || "")
        : [""],
  }));
}

export default function CourseForm({
  mode = "create",
  initialValues = {},
  sessionUser,
  onSubmitCourse,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      rating: "",
      reviewsCount: "",
      studentsCount: "",
      duration: "",
      level: "",
      category: "",
      lastUpdated: "",
      thumbnail: "",
      ...initialValues,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(initialValues?.thumbnail || null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [curriculum, setCurriculum] = React.useState(
    normalizeCurriculum(initialValues?.curriculum)
  );

  React.useEffect(() => {
    const merged = {
      title: "",
      description: "",
      price: "",
      rating: "",
      reviewsCount: "",
      studentsCount: "",
      duration: "",
      level: "",
      category: "",
      lastUpdated: "",
      thumbnail: "",
      ...initialValues,
    };
    reset(merged);
    setImagePreview(merged.thumbnail || null);
    setSelectedFile(null);
    setCurriculum(normalizeCurriculum(merged.curriculum));
  }, [initialValues, reset]);

  const creatorName =
    sessionUser?.name ||
    sessionUser?.username ||
    initialValues?.instructorName ||
    initialValues?.instructor ||
    "Instructor";

  const creatorImage = sessionUser?.image || initialValues?.instructorImage || "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const updateSectionTitle = (sectionIndex, value) => {
    setCurriculum((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex ? { ...section, title: value } : section
      )
    );
  };

  const updateLesson = (sectionIndex, lessonIndex, value) => {
    setCurriculum((prev) =>
      prev.map((section, sIdx) =>
        sIdx === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIdx) =>
                lIdx === lessonIndex ? value : lesson
              ),
            }
          : section
      )
    );
  };

  const addSection = () => {
    setCurriculum((prev) => [...prev, { ...emptySection }]);
  };

  const removeSection = (sectionIndex) => {
    setCurriculum((prev) => prev.filter((_, idx) => idx !== sectionIndex));
  };

  const addLesson = (sectionIndex) => {
    setCurriculum((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? { ...section, lessons: [...section.lessons, ""] }
          : section
      )
    );
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setCurriculum((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.filter((_, lIdx) => lIdx !== lessonIndex),
            }
          : section
      )
    );
  };

  const submitForm = async (formValues) => {
    if (!sessionUser) {
      alert("You must be logged in to continue");
      return;
    }

    setIsSubmitting(true);
    let imageUrl = (formValues.thumbnail || "").trim() || imagePreview || "";

    try {
      if (selectedFile) {
        setIsUploading(true);
        imageUrl = await uploadImage(selectedFile);
      }

      if (!imageUrl) {
        alert("Please upload a course thumbnail or provide a thumbnail URL");
        return;
      }

      const normalizedCurriculum = curriculum
        .map((section) => ({
          title: section.title.trim(),
          lessons: section.lessons.map((lesson) => lesson.trim()).filter(Boolean),
        }))
        .filter((section) => section.title || section.lessons.length > 0);

      const instructorName = creatorName;

      const payload = {
        title: formValues.title,
        instructor: instructorName,
        instructorName,
        instructorImage: creatorImage,
        thumbnail: imageUrl,
        price: Number(formValues.price || 0),
        rating: Number(formValues.rating || 0),
        reviewsCount: Number(formValues.reviewsCount || 0),
        studentsCount: Number(formValues.studentsCount || 0),
        duration: formValues.duration,
        level: formValues.level,
        category: formValues.category,
        description: formValues.description,
        lastUpdated: formValues.lastUpdated,
        curriculum: normalizedCurriculum,
        instructorId: sessionUser.id || sessionUser.email,
      };

      await onSubmitCourse(payload);
    } catch (error) {
      alert(error?.message || "Unable to save course");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            {isEdit ? "Update Course" : "Create Course"}
          </h1>
          <p className="text-slate-500 font-medium">
            One unified form for course create and update.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm flex items-center gap-2 group"
          type="button"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest hidden md:inline">
            Cancel
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
           
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              Course Metadata
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Complete Web Development Bootcamp 2024"
              />
              {errors.title && (
                <span className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={5}
                className="w-full bg-slate-50 border border-slate-300 rounded-[1.5rem] p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Master HTML, CSS, JavaScript, React, and Node.js from scratch..."
              />
              {errors.description && (
                <span className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
              Pricing & Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Price"
              />
              <input
                type="number"
                step="0.1"
                {...register("rating")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Rating"
              />
              <input
                type="number"
                {...register("reviewsCount")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Reviews Count"
              />
              <input
                type="number"
                {...register("studentsCount")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Students Count"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                {...register("duration")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Duration (e.g. 45h 30m)"
              />
              <input
                {...register("lastUpdated")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Last Updated (e.g. Jan 2024)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                {...register("level")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                {...register("category")}
                className="bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tighter">
              Visuals
            </h2>
            <div className="relative group aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200">
              {imagePreview ?
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              : <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-6">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Upload Thumbnail
                  </p>
                </div>
              }

              {isUploading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}

              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <input
              {...register("thumbnail", {
                onChange: (e) => {
                  const url = e.target.value?.trim();
                  if (!selectedFile) {
                    setImagePreview(url || null);
                  }
                },
              })}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl h-12 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Or paste thumbnail URL"
            />
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
              Curriculum
            </h2>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {curriculum.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border border-slate-100 rounded-2xl p-5 space-y-3"
              >
                <div className="flex gap-3">
                  <input
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(sectionIndex, e.target.value)
                    }
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl h-11 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Section ${sectionIndex + 1} title`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    disabled={curriculum.length === 1}
                    className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex gap-3">
                      <input
                        value={lesson}
                        onChange={(e) =>
                          updateLesson(
                            sectionIndex,
                            lessonIndex,
                            e.target.value,
                          )
                        }
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl h-10 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Lesson ${lessonIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeLesson(sectionIndex, lessonIndex)}
                        disabled={section.lessons.length === 1}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addLesson(sectionIndex)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                >
                  <Plus className="w-3 h-3" />
                  Add Lesson
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center gap-8 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-black py-4 px-12 rounded-2xl border border-slate-300 text-slate-400 hover:bg-indigo-400 hover:text-slate-600 uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-50 flex items-center gap-3 uppercase text-xs tracking-[0.2em]"
          >
            {isSubmitting ?
              <Loader2 className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />}
            {isSubmitting ?
              "Saving..."
            : isEdit ?
              "Update Course"
            : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
