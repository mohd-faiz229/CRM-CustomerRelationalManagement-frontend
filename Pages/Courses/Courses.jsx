import React, { useEffect, useState } from "react";
import { callApi } from "../../Services/Api.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaClock, FaWallet, FaLayerGroup } from "react-icons/fa";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                <FaLayerGroup size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-bold tracking-widest uppercase">No courses available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black  tracking-tight">Available Courses</h2>
                    <p className="text-[11px]  uppercase tracking-[0.2em] font-bold">Educational Catalog</p>
                </div>
                <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Total: {courses.length}
                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course, index) => {
                    const imageUrl = typeof course.courseImage === "string" && course.courseImage.startsWith("http")
                        ? course.courseImage
                        : "https://via.placeholder.com/600x400";

                    return (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group  border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col shadow-xl hover:border-blue-500/30 transition-all duration-300"
                        >
                            {/* COMPACT IMAGE ASPECT */}
                            <div className="relative h-32 overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={course.courseName}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121418] to-transparent opacity-60" />
                            </div>

                            {/* TIGHT CONTENT */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">
                                    {course.courseName || "Untitled"}
                                </h3>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className=" p-2.5 rounded-xl border border-white/[0.03]">
                                        <div className="flex items-center gap-2 text-blue-500 mb-0.5">
                                            <FaClock size={10} />
                                            <span className="text-[8px] font-black uppercase tracking-widest ">Duration</span>
                                        </div>
                                        <p className="text-xs font-bold ">{course.courseDuration || "N/A"}</p>
                                    </div>
                                    <div className=" p-2.5 rounded-xl border border-white/[0.03]">
                                        <div className="flex items-center gap-2 text-emerald-500 mb-0.5">
                                            <FaWallet size={10} />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fees</span>
                                        </div>
                                        <p className="text-xs font-bold ">
                                            ₹{typeof course.courseFee === "number" ? course.courseFee.toLocaleString() : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-4 italic">
                                    "{course.courseDescription || "No description provided."}"
                                </p>

                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Courses;