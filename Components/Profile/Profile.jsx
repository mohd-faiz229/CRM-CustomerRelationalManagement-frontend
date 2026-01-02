import { useState, useEffect } from "react";
import { FaEnvelope, FaPhoneAlt, FaBriefcase, FaUser, FaEdit, FaSave, FaTimes, FaIdBadge, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // Added import

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

const headerScale = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function Profile({ employee }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "General",
        status: "Active",
        profileImage: { url: "" }
    });

    useEffect(() => {
        if (employee) {
            setFormData({ ...employee });
        }
    }, [employee]);

    if (!employee) {
        return (
            <div className="w-full flex justify-center p-10">
                <div className="animate-pulse flex space-x-4 bg-white/5 p-10 rounded-3xl border border-white/10 w-full max-w-4xl">
                    <div className="rounded-full bg-slate-700 h-20 w-20"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-slate-700 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            console.log("Saving updated profile:", formData);
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const avatarUrl = formData.profileImage?.url || employee.profileImage?.url;

    return (
        <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex justify-center items-start min-h-full p-4"
        >
            <div className="w-full max-w-4xl space-y-6 transition-all duration-500 ease-in-out">

                {/* --- Profile Header Card --- */}
                <motion.header
                    variants={headerScale}
                    className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" aria-hidden="true" />

                    <div className="relative p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Avatar Figure */}
                        <figure className="relative shrink-0 group">
                            <div className={`p-1 rounded-full border-2 transition-colors duration-500 ${formData.status === "Active" ? "border-emerald-400" : "border-red-400"}`}>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={formData.name}
                                        className="w-32 h-32 rounded-full object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white/10 text-white">
                                        <FaUser size={48} />
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white border-4 border-slate-900 hover:bg-blue-500 transition-all shadow-xl"
                                >
                                    <FaCamera size={14} />
                                </motion.button>
                            )}
                        </figure>

                        <div className="flex-1 text-center md:text-left min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="truncate">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">{formData.name}</h2>
                                    <p className="text-blue-300 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                        <FaBriefcase size={14} /> {formData.role}
                                    </p>
                                </div>

                                <nav className="flex gap-2 justify-center shrink-0">
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
                                            <FaEdit /> <span>Edit Info</span>
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/20">
                                                <FaSave /> Save
                                            </button>
                                            <button onClick={() => { setIsEditing(false); setFormData({ ...employee }); }} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/20">
                                                <FaTimes /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </nav>
                            </div>

                            {/* Stats List */}
                            <dl className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <dt className="text-[10px] text-white/50 uppercase tracking-wider">Employee ID</dt>
                                    <dd className="text-sm font-mono text-white truncate">{formData._id?.slice(-6).toUpperCase() || 'N/A'}</dd>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <dt className="text-[10px] text-white/50 uppercase tracking-wider">Department</dt>
                                    <dd className="text-sm text-white truncate">{formData.department || "Operations"}</dd>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <dt className="text-[10px] text-white/50 uppercase tracking-wider">Status</dt>
                                    <dd className={`text-sm font-bold ${formData.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {formData.status || "Active"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </motion.header>

                {/* --- Details Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    <motion.section variants={itemVariants} className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FaUser className="text-blue-400" /> Personal Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/50 ml-1">Email Address</label>
                                <input
                                    name="email"
                                    disabled={!isEditing}
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className={`w-full mt-1 p-3 rounded-xl bg-white/5 border transition-all ${isEditing ? 'border-blue-400 text-white' : 'border-white/10 text-white/50'}`}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/50 ml-1">Phone Number</label>
                                <input
                                    name="phone"
                                    disabled={!isEditing}
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    className={`w-full mt-1 p-3 rounded-xl bg-white/5 border transition-all ${isEditing ? 'border-blue-400 text-white' : 'border-white/10 text-white/50'}`}
                                />
                            </div>
                        </div>
                    </motion.section>

                    <motion.section variants={itemVariants} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FaIdBadge className="text-purple-400" /> System Info
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <p className="text-xs text-white/40">User Role</p>
                                <p className="text-white font-medium uppercase text-sm tracking-wider">{formData.role}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <p className="text-xs text-white/40">Database ID</p>
                                <p className="text-white/60 font-mono text-[10px] truncate">{formData._id}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <p className="text-xs text-white/40">Account Permissions</p>
                                <p className="text-emerald-400 text-xs mt-1 italic">Standard Access Enabled</p>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.article>
    );
}