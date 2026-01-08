import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { callApi } from '../../Services/Api';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaGraduationCap, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFingerprint } from 'react-icons/fa';

const AddStudent = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]); // To fetch real courses
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Fetch courses so the user can select a VALID course name/ID
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await callApi.get("/counsellor/courses");
                setCourses(res.data.data);
            } catch (err) {
                console.error("Failed to load courses for dropdown");
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // DATA FIX: Ensure 'age' is sent as a Number to satisfy the Backend Controller
        const submissionData = {
            ...formData,
            age: Number(formData.age),
            email: formData.email.toLowerCase().trim()
        };

        const toastId = toast.loading("Enrolling student...");

        try {
            await callApi.post('/counsellor/createStudent', submissionData);
            toast.success("Student assigned to your roster!", { id: toastId });
            navigate("/dashboard/students", { replace: true });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid Data Provided";
            toast.error(errorMsg, { id: toastId });
            console.error("Submission Error:", error.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight italic">Enrollment Intake</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">New Student Registration</p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT COLUMN: PRIMARY INFO */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-[#121418] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Full Name" icon={<FaUserPlus />} name="name" value={formData.name} onChange={handleChange} required />
                            <InputField label="Email Address" icon={<FaEnvelope />} type="email" name="email" value={formData.email} onChange={handleChange} required />
                            <InputField label="Phone Number" icon={<FaPhoneAlt />} name="number" value={formData.number} onChange={handleChange} required />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Gender Identity</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required
                                    className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Residential Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} required rows="3"
                                className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all resize-none" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: COURSE & STATUS */}
                <div className="space-y-6">
                    <div className="bg-[#121418] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <InputField label="Age" icon={<FaFingerprint />} type="number" name="age" value={formData.age} onChange={handleChange} required />
                        <InputField label="Highest Qualification" icon={<FaGraduationCap />} name="quallification" value={formData.quallification} onChange={handleChange} required />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Target Course</label>
                            <select name="appliedCourse" value={formData.appliedCourse} onChange={handleChange} required
                                className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none">
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course.courseName}>{course.courseName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Current Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none">
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="graduated">Graduated</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {isSubmitting ? "Processing..." : "Sync to Database"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Internal Helper for Inputs
const InputField = ({ label, icon, type = "text", ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-2">
            <span className="text-blue-500">{icon}</span> {label}
        </label>
        <input
            type={type}
            {...props}
            className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
        />
    </div>
);

export default AddStudent;