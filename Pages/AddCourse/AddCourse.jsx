import { useState } from 'react';
import toast from 'react-hot-toast';
import { callApi } from '../../Services/Api';

const AddCourse = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        courseDuration: '',
        courseFee: '',
        courseDescription: '',
        courseImage: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "courseImage") {
            setFormData({ ...formData, courseImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("courseName", formData.courseName);
        data.append("courseDuration", formData.courseDuration);
        data.append("courseFee", formData.courseFee);
        data.append("courseDescription", formData.courseDescription);
        data.append("courseImage", formData.courseImage);

        try {
            await callApi(
                "/counsellor/createCourse",
                "POST",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Course created successfully!");

            setFormData({
                courseName: '',
                courseDuration: '',
                courseFee: '',
                courseDescription: '',
                courseImage: null
            });
        } catch (err) {
            toast.error("Upload failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-slate-900 border border-white/10 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">
                Add New Course
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                    type="text"
                    name="courseName"
                    placeholder="Course Name"
                    onChange={handleChange}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white"
                />

                <input
                    type="text"
                    name="courseDuration"
                    placeholder="Duration"
                    onChange={handleChange}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white"
                />

                <input
                    type="number"
                    name="courseFee"
                    placeholder="Fee"
                    onChange={handleChange}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white"
                />

                <input
                    type="file"
                    name="courseImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white"
                />

                <textarea
                    name="courseDescription"
                    placeholder="Description"
                    onChange={handleChange}
                    rows="4"
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white md:col-span-2"
                />

                <button
                    type="submit"
                    className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl"
                >
                    Add Course
                </button>
            </form>
        </div>
    );
};

export default AddCourse;
