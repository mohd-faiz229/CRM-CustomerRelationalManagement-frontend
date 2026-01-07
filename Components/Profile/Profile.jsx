import { useState, useEffect } from "react";
import {
    FaEnvelope,
    FaBriefcase,
    FaUser,
    FaEdit,
    FaSave,
    FaTimes,
    FaCamera,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import Api from "../../Services/Api";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export default function Profile() {
    const { user, setUser, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "General",
        status: "Active",
        profileImage: { url: "" },
    });

    /* ---------- WAIT FOR AUTH ---------- */
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                Loading profile...
            </div>
        );
    }

    /* ---------- SYNC USER → FORM ---------- */
    useEffect(() => {
        if (!user) return;

        setFormData({
            _id: user._id,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "",
            department: user.department || "General",
            status: user.status || "Active",
            profileImage: user.profileImage?.url
                ? user.profileImage
                : { url: user.profileImage || "" },
        });
    }, [user]);

    /* ---------- INPUT ---------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /* ---------- SAVE PROFILE ---------- */
    const handleSave = async () => {
        try {
            const res = await Api.put(`/employee/${formData._id}`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                profileImage: formData.profileImage,
            });

            const updatedUser = res.data?.data || res.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated");
            setIsEditing(false);
        } catch {
            toast.error("Update failed");
        }
    };

    /* ---------- IMAGE UPLOAD ---------- */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = new FormData();
            data.append("image", file);

            const uploadRes = await Api.post("/upload/profile", data);
            const imageUrl =
                uploadRes.data?.data?.url || uploadRes.data?.url;

            if (!imageUrl) throw new Error("Invalid upload response");

            // UI update
            setFormData((prev) => ({
                ...prev,
                profileImage: { url: imageUrl },
            }));

            // Persist
            const saveRes = await Api.put(`/employee/${formData._id}`, {
                profileImage: { url: imageUrl },
            });

            const updatedUser = saveRes.data?.data || saveRes.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile photo updated");
        } catch {
            toast.error("Image upload failed");
        }
    };

    /* ---------- NO USER ---------- */
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                No user found
            </div>
        );
    }

    return (
        <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-slate-900 p-6 flex justify-center"
        >
            <div className="w-full max-w-5xl space-y-6">

                {/* HEADER */}
                <header className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* AVATAR */}
                        <div className="relative">
                            <div className="p-1 rounded-full border-4 border-emerald-500">
                                {formData.profileImage.url ? (
                                    <img
                                        src={formData.profileImage.url}
                                        className="w-40 h-40 rounded-full object-cover"
                                        alt="profile"
                                    />
                                ) : (
                                    <div className="w-40 h-40 bg-slate-800 rounded-full flex items-center justify-center">
                                        <FaUser size={40} />
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-full cursor-pointer">
                                    <FaCamera className="text-white" />
                                    <input type="file" hidden onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        {/* INFO */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white">
                                {formData.name || "Unnamed User"}
                            </h1>
                            <p className="text-blue-400 flex items-center gap-2">
                                <FaBriefcase /> {formData.role || "No role"}
                            </p>

                            <div className="mt-4 flex gap-3 justify-center md:justify-start">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-white/10 rounded-xl"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2 bg-emerald-600 rounded-xl"
                                        >
                                            <FaSave /> Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-xl"
                                        >
                                            <FaTimes />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTACT */}
                <section className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl">
                        <label className="text-xs text-white/40">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full mt-2 p-4 rounded-xl bg-slate-800"
                        />
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl">
                        <label className="text-xs text-white/40">Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full mt-2 p-4 rounded-xl bg-slate-800"
                        />
                    </div>
                </section>
            </div>
        </motion.article>
    );
}
