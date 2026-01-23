import React, { useEffect, useState } from "react";
import { callApi } from "../../Services/Api.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaWallet, FaLayerGroup, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null); // Track which card is expanded

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await callApi.get("/counsellor/courses");
                const courseList = res?.data?.data;
                if (!Array.isArray(courseList)) throw new Error("Data error");
                setCourses(courseList);
            } catch (error) {
                toast.error("Failed to load courses");
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const toggleDescription = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <FaLayerGroup size={40} className="mb-4 opacity-10" />
                <p className="text-sm font-bold tracking-widest uppercase">No courses available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Available Courses</h2>
                    <p className="text-[11px] text-blue-500 uppercase tracking-[0.2em] font-bold">Educational Catalog</p>
                </div>
                <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Total: {courses.length}
                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {courses.map((course, index) => {
                    const isExpanded = expandedId === course._id;
                    const imageUrl = typeof course.courseImage === "string" && course.courseImage.startsWith("http")
                        ? course.courseImage
                        : "https://via.placeholder.com/600x400";

                    return (
                        <motion.div
                            key={course._id}
                            layout // Framer motion magic to animate height changes
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0F172A] border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col shadow-xl hover:border-blue-500/30 transition-all duration-300"
                        >
                            {/* IMAGE SECTION */}
                            <div className="relative h-32 overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={course.courseName}
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80" />
                            </div>

                            {/* CONTENT */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold mb-3 text-white">
                                    {course.courseName || "Untitled"}
                                </h3>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 text-blue-400 mb-0.5">
                                            <FaClock size={10} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Duration</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-200">{course.courseDuration || "N/A"}</p>
                                    </div>
                                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-400 mb-0.5">
                                            <FaWallet size={10} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Fees</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-200">
                                            ₹{typeof course.courseFee === "number" ? course.courseFee.toLocaleString() : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* FULL DESCRIPTION LOGIC */}
                                <div className="relative">
                                    <p className={`text-[12px] text-slate-400 leading-relaxed transition-all duration-300 ${isExpanded ? "" : "line-clamp-3"}`}>
                                        {course.courseDescription || "No description provided."}
                                    </p>

                                    {course.courseDescription?.length > 80 && (
                                        <button
                                            onClick={() => toggleDescription(course._id)}
                                            className="mt-2 text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-blue-400 transition-colors"
                                        >
                                            {isExpanded ? (
                                                <>Show Less <FaChevronUp size={8} /></>
                                            ) : (
                                                <>Read More <FaChevronDown size={8} /></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Courses;