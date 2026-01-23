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
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.courseImage) return toast.error("Course image is mandatory");
        if (Number(formData.courseFee) <= 0) return toast.error("Fee must be a positive number");

        setIsSubmitting(true);
        const toastId = toast.loading("Adding course assets...");

        const data = new FormData();
        data.append("courseName", formData.courseName.trim());
        data.append("courseDuration", formData.courseDuration.trim());
        data.append("courseFee", formData.courseFee);
        data.append("courseDescription", formData.courseDescription.trim());
        data.append("courseImage", formData.courseImage);

        try {
            await callApi.post('/counsellor/course', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Course published successfully!", { id: toastId });
            setFormData({ courseName: '', courseDuration: '', courseFee: '', courseDescription: '', courseImage: null });
            setPreview(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Upload failed";
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4">
            <header className="mb-6">
                <h2 className="text-2xl font-black tracking-tight italic ">Curriculum Expansion</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-1 text-blue-500">Create New Educational Track</p>
            </header>

            {/* Tightened p-6 and gap-5 */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 border border-slate-800 p-6 rounded-[1.5rem] shadow-2xl">

                <InputField label="Course Title" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g. Full Stack Development" required />
                <InputField label="Duration" name="courseDuration" value={formData.courseDuration} onChange={handleChange} placeholder="e.g. 6 Months" required />
                <InputField label="Tuition Fee (USD/INR)" type="number" name="courseFee" value={formData.courseFee} onChange={handleChange} placeholder="0.00" required />

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase ml-1 tracking-widest text-slate-400">Course Banner</label>
                    <div className="relative group">
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center w-full h-[42px] border border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-blue-500/50 transition-all ">
                                <div className="flex items-center gap-2  group-hover:text-blue-400">
                                    <FaCloudUploadAlt size={14} />
                                    <span className="text-[10px] font-bold">Upload Image</span>
                                </div>
                                <input type="file" name="courseImage" accept="image/*" onChange={handleChange} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative h-[42px] w-full rounded-xl overflow-hidden border border-slate-700 ">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-30" />
                                <div className="absolute inset-0 flex items-center justify-between px-3">
                                    <span className="text-[9px]  font-bold truncate max-w-[120px]">{formData.courseImage?.name}</span>
                                    <button type="button" onClick={() => { setPreview(null); setFormData({ ...formData, courseImage: null }) }} className="text-red-500 hover:text-red-400">
                                        <FaTrash size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[9px] font-black uppercase ml-1 tracking-widest text-slate-400">Course Curriculum Overview</label>
                    <textarea
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Detail the modules, technologies, and outcomes..."
                        className="w-full  border border-slate-700 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none placeholder:text-slate-600"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="md:col-span-2 bg-blue-600 hover:bg-blue-500 py-3.5 mt-2 rounded-xl text-[10px] font-black  uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    {isSubmitting ? "Adding ..." : "Add Course"}
                </button>
            </form>
        </div>
    );
};

const InputField = ({ label, type = "text", ...props }) => (
    <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase ml-1 tracking-widest text-slate-400">{label}</label>
        <input
            type={type}
            {...props}
            className="w-full h-[42px] border border-slate-700 rounded-xl px-4 text-xs font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
        />
    </div>
);

export default AddCourse;