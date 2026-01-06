import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { callApi } from '../../Services/Api';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        address: '',
        email: '',
        quallification: '',
        number: '',
        status: 'pending',
        appliedCourse: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Log the data being sent to verify it matches your schema
        console.log("Submitting Data:", formData);

        try { await callApi("/admin/createStudent", "POST", formData); // OK


            console.log("Success Response:", formData);
            toast.success("Student added successfully!");

            // Reset form...
        } catch (error) {
            // 2. Log the detailed error object
            console.error("FULL ERROR OBJECT:", error);

            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.log("SERVER ERROR DATA:", error.response.data);
                console.log("SERVER ERROR STATUS:", error.response.status);
                toast.error(`Server Error: ${error.response.data.message || "Invalid Data"}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.log("NETWORK ERROR (No Response):", error.request);
                toast.error("Network Error: Cannot reach the server");
            } else {
                // Something happened in setting up the request
                console.log("REQUEST SETUP ERROR:", error.message);
                toast.error("Request Error: " + error.message);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-slate-900 border border-white/10 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Enroll New Student</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Age */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                {/* Number */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Phone Number</label>
                    <input type="text" name="number" value={formData.number} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                {/* Qualification */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Qualification</label>
                    <input type="text" name="quallification" value={formData.quallification} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                {/* Course */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Applied Course</label>
                    <input type="text" name="appliedCourse" value={formData.appliedCourse} onChange={handleChange} required
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-400">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="graduated">Graduated</option>
                        <option value="dropped">Dropped</option>
                    </select>
                </div>

                {/* Address (Full Width) */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-400">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows="3"
                        className="bg-slate-800 border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                </div>

                <div className="md:col-span-2 pt-4">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20">
                        Register Student
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;