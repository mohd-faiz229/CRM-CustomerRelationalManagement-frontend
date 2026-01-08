import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaEnvelope, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { callApi } from "../../Services/Api";

export default function Profile() {
    const { user, setUser, loading } = useAuth();
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

    useEffect(() => {
        if (user) {
            setFormData({
                _id: user._id || "",
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                role: user.role || "",
                // Ensure we get the string URL
                profileImage: user.profileImage?.url || user.profileImage || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // HANDLES TEXT UPDATES
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
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated", { id: tid });
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed", { id: tid });
        } finally {
            setUpdating(false);
        }
    };

    // HANDLES IMAGE UPLOAD SEPARATELY
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (file.size > 2 * 1024 * 1024) return toast.error("File too large (Max 2MB)");

        const tid = toast.loading("Uploading avatar...");
        try {
            const data = new FormData();
            data.append("profileImage", file);

            // IMPORTANT: This request updates ONLY the image
            const res = await callApi.put(`/admin/updateUser/${formData._id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedUser = res.data?.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Sync local form state with new image URL from server
            setFormData(prev => ({
                ...prev,
                profileImage: updatedUser.profileImage?.url || updatedUser.profileImage
            }));

            toast.success("Avatar updated", { id: tid });
        } catch (err) {
            console.error(err);
            toast.error("Upload failed", { id: tid });
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!user) return <div className="p-10 text-gray-500 font-black uppercase text-center tracking-widest">Access Denied</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a0c10] p-4 lg:p-10 flex justify-center">
            <div className="w-full max-w-2xl space-y-6">
                <div className="bg-[#121418] border border-white/5 rounded-[2.5rem] p-8 relative shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* AVATAR SECTION */}
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${isEditing ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-white/10'}`}>
                                {formData.profileImage ? (
                                    <img
                                        src={formData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://ui-avatars.com/api/?name=" + formData.name;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#1c1f26] flex items-center justify-center text-gray-600">
                                        <FaUser size={40} />
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl cursor-pointer hover:bg-blue-500 transition-transform active:scale-90 shadow-xl">
                                    <FaCamera className="text-white text-sm" />
                                    <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                </label>
                            )}
                        </div>

                        {/* INFO SECTION */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
                                {isEditing ? (
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-blue-500/50 outline-none w-full"
                                    />
                                ) : formData.name}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                                    {formData.role}
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="p-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl border border-white/5 transition-colors">
                                    <FaEdit size={16} />
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleSave} disabled={updating} className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95">
                                        <FaSave size={16} />
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl active:scale-95">
                                        <FaTimes size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard icon={<FaEnvelope />} label="System Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
                    <DataCard icon={<FaPhone />} label="Verified Phone" value={formData.phone} />
                </div>
            </div>
        </motion.div>
    );
}

const DetailCard = ({ icon, label, name, value, isEditing, onChange }) => (
    <div className="bg-[#121418] border border-white/5 p-6 rounded-[2rem] space-y-2">
        <div className="flex items-center gap-3 text-gray-500 uppercase tracking-widest text-[9px] font-black">
            <span className="text-blue-500">{icon}</span> {label}
        </div>
        <input
            name={name}
            value={value}
            onChange={onChange}
            disabled={!isEditing}
            className={`w-full bg-transparent text-sm font-bold outline-none transition-all ${isEditing ? 'text-white border-b border-blue-500/30 pb-1' : 'text-gray-500'}`}
        />
    </div>
);

const DataCard = ({ icon, label, value }) => (
    <div className="bg-[#121418] border border-white/5 p-6 rounded-[2rem] space-y-2">
        <div className="flex items-center gap-3 text-gray-500 uppercase tracking-widest text-[9px] font-black">
            <span className="text-blue-500">{icon}</span> {label}
        </div>
        <p className="text-sm font-bold text-gray-500">{value || "Not Set"}</p>
    </div>
);