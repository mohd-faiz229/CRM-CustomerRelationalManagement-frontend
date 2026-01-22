import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaEnvelope, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { callApi } from "../../Services/Api";

export default function Profile() {
    const { user, loading, updateAuthUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        role: "",
        profileImage: "",
    });

    // Normalize profileImage to always be string URL
    const normalizeFormData = (u) => ({
        _id: u._id || "",
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role || "",
        profileImage:
            typeof u.profileImage === "string"
                ? u.profileImage
                : u.profileImage?.url || "",
    });

    useEffect(() => {
        if (user) {
            setFormData(normalizeFormData(user));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        if (user) setFormData(normalizeFormData(user));
        setIsEditing(false);
    };

    const handleSave = async () => {
        setUpdating(true);
        const tid = toast.loading("Syncing profile data...");
        try {
            const res = await callApi.put(`admin/updateUser/${formData._id}`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            });

            const updatedUser = res.data?.data;
            updateAuthUser(updatedUser); // updates context + localStorage
            setFormData(normalizeFormData(updatedUser));

            toast.success("Profile updated", { id: tid });
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed", { id: tid });
        } finally {
            setUpdating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return toast.error("No file selected");
        if (file.size > 2 * 1024 * 1024) return toast.error("File too large (Max 2MB)");

        const tid = toast.loading("Uploading avatar...");
        try {
            const data = new FormData();
            data.append("profileImage", file);

            const res = await callApi.put(`/admin/updateUser/${formData._id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedUser = res.data?.data;
            updateAuthUser(updatedUser);
            setFormData(normalizeFormData(updatedUser));

            toast.success("Avatar updated", { id: tid });
        } catch (err) {
            toast.error("Upload failed", { id: tid });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user) return (
        <div className="p-10 font-black uppercase text-center tracking-widest text-[var(--text-primary)]">
            Access Denied
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen p-4 lg:p-10 flex justify-center">
            <div className="w-full max-w-2xl space-y-6">

                {/* HERO SECTION */}
                <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--input-border)] rounded-[2.5rem] p-8 relative shadow-2xl transition-all">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* AVATAR */}
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 
                                ${isEditing ? 'border-[var(--accent-color)] shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105' : 'border-[var(--input-border)]'}`}>
                                {formData.profileImage ? (
                                    <img
                                        src={formData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?background=014f86&color=fff&name=${formData.name}`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] bg-[var(--input-bg)]">
                                        <FaUser size={40} />
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 bg-[var(--accent-color)] text-white p-3 rounded-2xl cursor-pointer hover:brightness-110 transition-transform active:scale-90 shadow-xl">
                                    <FaCamera size={14} />
                                    <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                </label>
                            )}
                        </div>

                        {/* INFO */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-[var(--text-primary)]">
                                {isEditing ? (
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-[var(--accent-color)] outline-none w-full animate-pulse"
                                    />
                                ) : formData.name}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[var(--accent-color)]/20">
                                    {formData.role}
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)}
                                    className="p-4 bg-[var(--input-bg)] text-[var(--text-primary)] rounded-2xl border border-[var(--input-border)] hover:border-[var(--accent-color)]/50 transition-all">
                                    <FaEdit size={16} />
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleSave} disabled={updating}
                                        className="p-4 bg-[var(--accent-color)] text-white rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50">
                                        <FaSave size={16} />
                                    </button>
                                    <button onClick={handleCancel}
                                        className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 active:scale-95">
                                        <FaTimes size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* DETAILS GRID */}
                <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard
                        icon={<FaEnvelope />}
                        label="System Email"
                        name="email"
                        value={formData.email}
                        isEditing={isEditing}
                        onChange={handleChange}
                    />
                    <DataCard
                        icon={<FaPhone />}
                        label="Verified Phone"
                        value={formData.phone}
                    />
                </div>
            </div>
        </motion.div>
    );
}

const DetailCard = ({ icon, label, name, value, isEditing, onChange }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--input-border)] p-6 rounded-[2rem] space-y-2 shadow-lg transition-all">
        <div className="flex items-center gap-3 text-[var(--text-muted)] uppercase tracking-widest text-[9px] font-black">
            <span className="text-[var(--accent-color)]">{icon}</span> {label}
        </div>
        <input
            name={name}
            value={value}
            onChange={onChange}
            disabled={!isEditing}
            className={`w-full bg-transparent text-sm font-bold outline-none transition-all
                ${isEditing
                    ? 'text-[var(--text-primary)] border-b border-[var(--accent-color)] pb-1'
                    : 'text-[var(--text-muted)] opacity-70 cursor-not-allowed'}`}
        />
    </div>
);

const DataCard = ({ icon, label, value }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--input-border)] p-6 rounded-[2rem] space-y-2 shadow-lg">
        <div className="flex items-center gap-3 text-[var(--text-muted)] uppercase tracking-widest text-[9px] font-black">
            <span className="text-[var(--accent-color)]">{icon}</span> {label}
        </div>
        <p className="text-sm font-bold text-[var(--text-muted)] opacity-70">{value || "Not Set"}</p>
    </div>
);

