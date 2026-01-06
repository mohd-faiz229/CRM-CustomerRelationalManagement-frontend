import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaBriefcase, FaUser, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import Api from "../../Services/Api";

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };
const headerScale = { hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

export default function Profile() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "General",
        status: "Active",
        profileImage: { url: "" },
    });

    // Initialize formData from context
    if (user && formData._id !== user._id) {
        setFormData({ ...user });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await Api.put(`/employee/${user._id}`, formData); // adjust route
            setUser(res.data);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append("image", file);

        try {
            const res = await Api.post("/upload/profile", data); // adjust route
            setFormData(prev => ({ ...prev, profileImage: { url: res.data.url, public_id: res.data.public_id } }));
        } catch (err) {
            console.error(err);
            toast.error("Image upload failed");
        }
    };

    const avatarUrl = formData.profileImage?.url || "";

    return (
        <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex justify-center p-6 bg-slate-900 min-h-screen"
        >
            <div className="w-full max-w-5xl space-y-8">

                {/* --- Header Card --- */}
                <motion.header
                    variants={headerScale}
                    className="relative bg-gradient-to-r from-blue-600/30 via-purple-600/20 to-pink-600/30 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl border border-white/10 backdrop-blur-md"
                >
                    {/* Avatar */}
                    <figure className="relative shrink-0">
                        <div className={`p-1 rounded-full border-4 transition-all duration-500 ${formData.status === "Active" ? "border-emerald-400" : "border-red-400"}`}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={formData.name} className="w-36 h-36 rounded-full object-cover shadow-xl" />
                            ) : (
                                <div className="w-36 h-36 rounded-full flex items-center justify-center bg-white/10 text-white">
                                    <FaUser size={56} />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <motion.label
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute bottom-0 right-0 p-3 bg-blue-600 rounded-full text-white border-4 border-slate-900 hover:bg-blue-500 transition-all cursor-pointer"
                            >
                                <FaCamera size={16} />
                                <input type="file" className="hidden" onChange={handleImageUpload} />
                            </motion.label>
                        )}
                    </figure>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="truncate">
                                <h2 className="text-4xl font-bold text-white tracking-tight">{formData.name}</h2>
                                <p className="text-blue-200 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <FaBriefcase /> {formData.role}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                                        >
                                            <FaSave /> Save
                                        </button>
                                        <button
                                            onClick={() => { setIsEditing(false); setFormData({ ...user }); }}
                                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/20"
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <dt className="text-xs text-white/50 uppercase tracking-wider">Employee ID</dt>
                                <dd className="text-sm font-mono text-white truncate">{formData._id?.slice(-6).toUpperCase() || "N/A"}</dd>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <dt className="text-xs text-white/50 uppercase tracking-wider">Department</dt>
                                <dd className="text-sm text-white truncate">{formData.department || "General"}</dd>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <dt className="text-xs text-white/50 uppercase tracking-wider">Status</dt>
                                <dd className={`text-sm font-bold ${formData.status === "Active" ? "text-emerald-400" : "text-red-400"}`}>
                                    {formData.status || "Active"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </motion.header>

                {/* --- Editable Personal Info --- */}
                <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md space-y-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaEnvelope /> Personal Info
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-white/50 ml-1">Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full mt-1 p-3 rounded-xl bg-white/5 border ${isEditing ? "border-blue-400 text-white" : "border-white/10 text-white/50"}`}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/50 ml-1">Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full mt-1 p-3 rounded-xl bg-white/5 border ${isEditing ? "border-blue-400 text-white" : "border-white/10 text-white/50"}`}
                                />
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.article>
    );
}
