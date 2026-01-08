import { useState } from 'react';
import toast from 'react-hot-toast';
import { callApi } from '../../Services/Api';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

const AddCourse = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);
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
            const file = files[0];
            if (file) {
                setFormData({ ...formData, courseImage: file });
                setPreview(URL.createObjectURL(file)); // Create local preview URL
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Brutal Validation: Don't let empty requests hit your server
        if (!formData.courseImage) return toast.error("Course image is mandatory");
        if (Number(formData.courseFee) <= 0) return toast.error("Fee must be a positive number");

        setIsSubmitting(true);
        const toastId = toast.loading("Uploading course assets...");

        const data = new FormData();
        data.append("courseName", formData.courseName.trim());
        data.append("courseDuration", formData.courseDuration.trim());
        data.append("courseFee", formData.courseFee);
        data.append("courseDescription", formData.courseDescription.trim());
        data.append("courseImage", formData.courseImage);

        try {
            await callApi.post('/counsellor/createCourse', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Course published successfully!", { id: toastId });

            // Reset Form and Preview
            setFormData({
                courseName: '',
                courseDuration: '',
                courseFee: '',
                courseDescription: '',
                courseImage: null
            });
            setPreview(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Upload failed";
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight italic">Curriculum Expansion</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Create New Educational Track</p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121418] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">

                {/* Course Name */}
                <InputField label="Course Title" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g. Full Stack Development" required />

                {/* Duration */}
                <InputField label="Duration" name="courseDuration" value={formData.courseDuration} onChange={handleChange} placeholder="e.g. 6 Months" required />

                {/* Fee */}
                <InputField label="Tuition Fee (USD/INR)" type="number" name="courseFee" value={formData.courseFee} onChange={handleChange} placeholder="0.00" required />

                {/* File Upload Area */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Course Banner</label>
                    <div className="relative group">
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center w-full h-14 bg-[#0a0c10] border border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <FaCloudUploadAlt size={18} />
                                    <span className="text-xs font-bold">Upload Image</span>
                                </div>
                                <input type="file" name="courseImage" accept="image/*" onChange={handleChange} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative h-14 w-full rounded-2xl overflow-hidden border border-white/10">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <span className="text-[10px] text-white font-bold truncate max-w-[150px]">{formData.courseImage?.name}</span>
                                    <button type="button" onClick={() => { setPreview(null); setFormData({ ...formData, courseImage: null }) }} className="text-red-500 hover:text-red-400">
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Course Curriculum Overview</label>
                    <textarea
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Detail the modules, technologies, and outcomes..."
                        className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all resize-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="md:col-span-2 bg-blue-600 hover:bg-blue-500 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    {isSubmitting ? "Uploading to Cloud..." : "Finalize and Publish Course"}
                </button>
            </form>
        </div>
    );
};

// Reusable Input Sub-component
const InputField = ({ label, type = "text", ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">{label}</label>
        <input
            type={type}
            {...props}
            className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
        />
    </div>
);

export default AddCourse;