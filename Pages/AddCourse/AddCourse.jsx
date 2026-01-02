import { useState } from 'react';
import toast from 'react-hot-toast';
import { callApi } from '../../Services/Api';

const AddCourse = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        courseDuration: '',
        courseFee: '',
        courseDescription: '',
        courseImage: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Course:", formData);

        try {
            await callApi("/counsellor/createCourse", "POST", formData);

            toast.success("Course created successfully!");
            setFormData({
                courseName: '',
                courseDuration: '',
                courseFee: '',
                courseDescription: '',
                courseImage: ''
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                toast.error(error.response.data.message || "Server Error");
            } else if (error.request) {
                toast.error("Network Error: Cannot reach the server");
            } else {
                toast.error("Request Error: " + error.message);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-slate-900 border border-white/10 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Course</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Course Name</label>
                    <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Course Duration */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Course Duration</label>
                    <input
                        type="text"
                        name="courseDuration"
                        value={formData.courseDuration}
                        onChange={handleChange}
                        required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Course Fee */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Course Fee</label>
                    <input
                        type="number"
                        name="courseFee"
                        value={formData.courseFee}
                        onChange={handleChange}
                        required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Course Image URL */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Course Image URL</label>
                    <input
                        type="text"
                        name="courseImage"
                        value={formData.courseImage}
                        onChange={handleChange}
                        required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Course Description (Full Width) */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-400">Course Description</label>
                    <textarea
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    ></textarea>
                </div>

                <div className="md:col-span-2 pt-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20"
                    >
                        Add Course
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourse;
