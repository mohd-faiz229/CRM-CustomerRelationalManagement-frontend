import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { callApi } from "../../Services/Api.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import toast from "react-hot-toast";
// Import icons from react-icons
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const { updateAuthUser } = useContext(AuthContext);

    // States
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [form, setForm] = useState({
        email: localStorage.getItem("loginEmail") || "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Toggle function for the eye icon
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const normalizedEmail = form.email.trim().toLowerCase();
            const res = await callApi.post("/auth/login", {
                ...form,
                email: normalizedEmail,
            });

            const { data } = res.data;

            // Scenario 1: OTP Required (Status 201)
            if (res.status === 201 && data?.email) {
                toast.success("OTP sent to your email");
                return navigate("/otp-verify", { state: { email: data.email }, replace: true });
            }

            // Scenario 2: Direct Login (Status 200)
            if (res.status === 200 && data?.accessToken && data?.user) {
                const { accessToken, user } = data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("userid", user._id);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));

                updateAuthUser({
                    ...user,
                    profileImage: user.profileImage || null,
                    isAuthenticated: true
                });

                toast.success("Welcome back!");
                return navigate("/dashboard", { replace: true });
            }

            toast.error("Login failed");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans  text-white">
            {/* Background Glows */}
            <div className="absolute top-[20%] left-[15%] w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-purple-600/10 blur-[130px] rounded-full" />

            {/* Main Glass Card */}
            <div className="relative z-10 w-full max-w-[460px] p-10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl ">

                <div className="mb-10 flex flex-col items-center justify-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-6 group cursor-default">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                            <span className="font-extrabold text-2xl">R</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            Relatio <span className="text-blue-500">CRM</span>
                        </h1>
                    </div>

                    <h2 className="text-3xl font-bold mb-2 tracking-tight">
                        Welcome back<span className="text-blue-500">.</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium text-center">Enter your details to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <FaEnvelope size={14} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                required
                                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <FaLock size={14} />
                            </div>
                            <input
                                // Beginner Tip: We use a ternary operator to switch types
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-medium"
                            />
                            {/* Eye Toggle Button */}
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-6 text-sm uppercase tracking-widest"
                    >
                        {loading ? "Processing..." : "Log in"}
                        {!loading && <FaArrowRight size={14} />}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 text-xs font-medium">
                        Don't have an account?{" "}
                        <span className="text-blue-500 cursor-pointer hover:text-blue-400 hover:underline font-bold transition-all ml-1">
                            Contact Admin
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { Login };