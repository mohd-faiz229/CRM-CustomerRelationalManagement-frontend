import React, { useEffect, useState } from "react";
import { callApi } from "../../Services/Api.js";
import toast from "react-hot-toast";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await callApi.get("/counsellor/courses");
                const courseList = res?.data?.data;

                if (!Array.isArray(courseList)) {
                    throw new Error("Courses data is not an array");
                }

                setCourses(courseList);
            } catch (error) {
                console.error("Courses fetch failed:", error);
                toast.error(
                    error?.response?.data?.message || "Failed to load courses"
                );
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading courses...
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-400">
                No courses available.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-10">
                    Available Courses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => {
                        // ✅ Safe image URL logic
                        const imageUrl =
                            typeof course.courseImage === "string" &&
                                course.courseImage.startsWith("http")
                                ? course.courseImage
                                : "https://via.placeholder.com/600x400";

                        return (
                            <div
                                key={course._id}
                                className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6"
                            >
                                {/* IMAGE */}
                                <img
                                    src={imageUrl}
                                    alt={course.courseName || "Course"}
                                    className="w-full h-40 object-cover rounded-xl"
                                    loading="lazy"
                                />

                                {/* CONTENT */}
                                <h3 className="text-xl font-bold text-white mt-4 mb-1">
                                    {course.courseName || "Untitled Course"}
                                </h3>

                                <p className="text-slate-400 text-sm">
                                    Duration: {course.courseDuration || "N/A"}
                                </p>

                                <p className="text-slate-400 text-sm">
                                    Fee: ₹{typeof course.courseFee === "number" ? course.courseFee.toLocaleString() : "N/A"}
                                </p>

                                <p className="text-slate-400 text-sm mt-2">
                                    {course.courseDescription || "No description provided."}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Courses;
