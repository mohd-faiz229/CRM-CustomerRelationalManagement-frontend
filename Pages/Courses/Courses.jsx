import React, { useEffect, useState } from 'react';
import { callApi } from "../../Services/Api.js"; // adjust path

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await callApi("/counsellor/getAllCourses", "GET"); // make sure route is correct
            console.log("COURSES API RESPONSE 👉", res);
            setCourses(res?.data.data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    if (loading) {
        return <div className="p-10 text-white text-center">Loading courses...</div>;
    }

    if (!courses.length) {
        return <div className="p-10 text-white text-center">No courses available.</div>;
    }

    return (
        <div className="p-10 bg-[#0F172A] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-10">Available Courses</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="group bg-[#1E293B] rounded-4xl border border-slate-700/50 p-8 shadow-xs hover:border-slate-600 hover:shadow-gray-500 transition-all duration-300"
                        >
                            {/* Title */}
                            <h3 className="text-2xl font-bold text-slate-100 mt-6 mb-3 leading-tight">
                                {course.courseName}
                            </h3>

                            {/* Duration */}
                            <p className="text-slate-400 text-sm mb-2">Duration: {course.courseDuration}</p>

                            {/* Fee */}
                            <p className="text-slate-400 text-sm mb-4">Fee: ₹{course.courseFee.toLocaleString()}</p>

                            {/* Description */}
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                {course.courseDescription}
                            </p>

                            {/* Footer: Image & Action */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                                {course.courseImage && (
                                    <img
                                        src={course.courseImage}
                                        alt={course.courseName}
                                        className="w-full md:w-24 h-24 rounded-xl object-cover"
                                    />
                                )}
                                <button className="w-full md:w-auto font-bold bg-blue-600 hover:bg-blue-700 text-white border border-slate-700 rounded-xl px-4 py-2 text-sm transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;
