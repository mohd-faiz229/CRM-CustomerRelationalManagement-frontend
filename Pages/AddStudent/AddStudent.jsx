import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { callApi } from '../../Services/Api';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaGraduationCap, FaPhoneAlt, FaEnvelope, FaFingerprint } from 'react-icons/fa';
import CustomSelect from "../../Components/CustomSelect/CustomSelect.jsx";

const AddStudent = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        address: '',
        email: '',
        quallification: '', // Matches your schema typo
        number: '',
        status: 'pending',
        appliedCourse: ""
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await callApi.get("/counsellor/courses");
                const options = res.data.data.map(c => ({
                    value: c.courseName,
                    label: c.courseName,
                    color: "text-blue-400 bg-blue-400/10"
                }));
                setCourses(options);
            } catch (err) {
                toast.error("API Error: Course sync failed");
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation Check
        if (!formData.gender || !formData.appliedCourse) {
            return toast.error("Missing required selections");
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Processing Enrollment...");

        try {
            const submissionData = {
                ...formData,
                age: Number(formData.age),
                email: formData.email.toLowerCase().trim()
            };

            await callApi.post('/counsellor/student', submissionData);
            toast.success("Student System Entry Complete", { id: toastId });
            navigate("/dashboard/students", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h2 className="text-3xl font-black tracking-tight italic ">Enrollment Intake</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 text-blue-500">Secure Registration Terminal</p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2 space-y-6">
                    <div className=" border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Full Name" icon={<FaUserPlus />} name="name" value={formData.name} onChange={handleChange} required />
                            <InputField label="Email Address" icon={<FaEnvelope />} type="email" name="email" value={formData.email} onChange={handleChange} required />
                            <InputField label="Phone Number" icon={<FaPhoneAlt />} name="number" value={formData.number} onChange={handleChange} required />

                            <div className="space-y-2 relative z-50">
                                <label className="text-[9px] font-black uppercase ml-2 tracking-widest text-slate-400">Gender Identity</label>
                                <CustomSelect
                                    value={formData.gender}
                                    onChange={(val) => handleSelectChange('gender', val)}
                                    placeholder="Select Gender"
                                    options={[
                                        { value: 'Male', label: 'Male', color: 'text-blue-400 bg-blue-400/10' },
                                        { value: 'Female', label: 'Female', color: 'text-pink-400 bg-pink-400/10' },
                                        { value: 'Other', label: 'Other', color: 'text-slate-400 bg-slate-400/10' }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase ml-2 tracking-widest text-slate-400">Residential Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full  border border-white/10 rounded-2xl p-4 text-xs font-bold  outline-none focus:border-blue-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className=" border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <InputField label="Age" icon={<FaFingerprint />} type="number" name="age" value={formData.age} onChange={handleChange} required />
                        <InputField label="Highest Qualification" icon={<FaGraduationCap />} name="quallification" value={formData.quallification} onChange={handleChange} required />

                        <div className="space-y-2 relative z-30">
                            <label className="text-[9px] font-black uppercase ml-2 tracking-widest text-slate-400">Target Course</label>
                            <CustomSelect
                                value={formData.appliedCourse}
                                onChange={(val) => handleSelectChange('appliedCourse', val)}
                                placeholder="Select Course"
                                options={courses}
                            />
                        </div>

                        <div className="space-y-2 relative z-20">
                            <label className="text-[9px] font-black uppercase ml-2 tracking-widest text-slate-400">Initial Status</label>
                            <CustomSelect
                                value={formData.status}
                                onChange={(val) => handleSelectChange('status', val)}
                                options={[
                                    { value: 'pending', label: 'Pending', color: 'text-amber-400 bg-amber-400/10' },
                                    { value: 'active', label: 'Active', color: 'text-emerald-400 bg-emerald-400/10' },
                                    { value: 'placed', label: 'Placed', color: 'text-blue-400 bg-blue-400/10' },
                                    { value: 'dropped', label: 'Dropped', color: 'text-rose-400 bg-rose-400/10' }
                                ]}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl text-[10px] font-black  uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {isSubmitting ? "Syncing..." : "Execute Enrollment"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const InputField = ({ label, icon, type = "text", ...props }) => (
    <div className="space-y-2">
        <label className="text-[9px] font-black uppercase ml-2 tracking-widest flex items-center gap-2 text-slate-400">
            <span className="text-blue-500">{icon}</span> {label}
        </label>
        <input
            type={type}
            {...props}
            className="w-full  border border-white/10 rounded-2xl p-4 text-xs font-bold  outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
        />
    </div>
);

export default AddStudent;