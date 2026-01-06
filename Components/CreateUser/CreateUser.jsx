import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserTie, FaEyeSlash, FaEye, FaPhone, FaCamera } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from "axios";
import CustomSelect from "../CustomSelect/CustomSelect";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { callApi } from "../../Services/Api";

// Animation Variants for staggering the input fields
const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            staggerChildren: 0.08, // Inputs will pop in one after another
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export const CreateUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm();

    const selectedRole = watch("role", "");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("role", data.role);
            formData.append("password", data.password);
            if (file) formData.append("profileImage", file);

            const res = await callApi("/admin/createUser", "post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(res.data.message || "Account created successfully");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    const glassBase = `w-full text-sm text-white bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10`;

    return (
        <div className="w-full flex items-start justify-center p-4 min-h-full">
            <motion.form
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit(onSubmit)}
                className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-8 py-10 w-full max-w-lg flex flex-col gap-6 relative"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Add New Member</h2>
                    <p className="text-white/50 text-sm mt-2">Assign roles and set permissions for new staff.</p>
                </motion.div>

                {/* Profile Image Section */}
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 transition-colors group-hover:border-blue-400">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserTie className="text-white/20 text-4xl" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-500 transition-all shadow-lg border-2 border-slate-900 active:scale-90">
                            <FaCamera size={12} />
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Profile Photo</span>
                </motion.div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                        <label className="text-white/70 text-xs font-medium ml-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`${glassBase} pr-10 ${errors.name ? 'border-red-400/50' : ''}`}
                                {...register("name", { required: "Name is required" })}
                            />
                            <FaUserTie className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                        <label className="text-white/70 text-xs font-medium ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="john@company.com"
                                className={`${glassBase} pr-10 ${errors.email ? 'border-red-400/50' : ''}`}
                                {...register("email", { required: "Email is required" })}
                            />
                            <BiLogoGmail className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                        <label className="text-white/70 text-xs font-medium ml-1">Phone Number</label>
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="+91 00000 00000"
                                className={`${glassBase} pr-10 ${errors.phone ? 'border-red-400/50' : ''}`}
                                {...register("phone", { required: "Phone is required" })}
                            />
                            <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                        <label className="text-white/70 text-xs font-medium ml-1">Access Role</label>
                        <CustomSelect
                            options={[
                                { value: "admin", label: "Administrator" },
                                { value: "counselor", label: "Counsellor" },
                                { value: "hr", label: "HR Manager" },
                                { value: "accountant", label: "Accountant" },
                            ]}
                            value={selectedRole}
                            placeholder="Select role"
                            onChange={(val) => setValue("role", val, { shouldValidate: true })}
                        />
                        {errors.role && <span className="text-red-400 text-[10px] ml-1">Please select a role</span>}
                    </motion.div>
                </div>

                {/* Password Field */}
                <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                    <label className="text-white/70 text-xs font-medium ml-1">Security Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`${glassBase} pr-10 ${errors.password ? 'border-red-400/50' : ''}`}
                            {...register("password", { required: "Password is required", minLength: 6 })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                            {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                        </button>
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-4 font-bold py-3.5 rounded-xl transition-all duration-300 shadow-xl ${isSubmitting
                            ? "bg-white/10 text-white/30 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20"
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating Account...
                        </span>
                    ) : "Register Member"}
                </motion.button>
            </motion.form>
        </div>
    );
};

export default CreateUser;