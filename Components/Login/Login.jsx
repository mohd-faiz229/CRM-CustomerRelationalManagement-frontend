import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { callApi}  from "../../Services/Api.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { updateAuthUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: localStorage.getItem("loginEmail") || "",
        password: "",
    });

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

            if (res.status === 201 && data?.email) {
                toast.success("OTP sent to your email");
                return navigate("/otp-verify", { state: { email: data.email }, replace: true });
            }

            if (res.status === 200 && data?.accessToken && data?.user) {
                const { accessToken, user } = data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("userid", user._id);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));
                updateAuthUser({
                    ...user,
                    profileImage: user.profileImage || null, // keep object
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Glows (Matching the blue/purple orbs in your image) */}
            <div className="absolute top-[20%] left-[15%] w-72 h-72 bg-blue-600/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-purple-600/20 blur-[130px] rounded-full" />

            {/* Main Glass Card */}
            <div className="relative z-10 w-full max-w-[480px] p-10  backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">

                <div className="mb-8 flex flex-col items-center justify-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 mb-6 group cursor-default">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 ">
                            <span className="  font-brand font-extrabold text-xl">R</span>
                        </div>
                        <h1 className=" text-lg font-brand font-bold tracking-tight">
                            Relatio <span className="text-blue-500">CRM</span>
                        </h1>
                    </div>

                    {/* Heading Section */}
                    <h2 className=" text-3xl font-brand font-bold mb-2 tracking-tight">
                        Welcome back<span className="text-blue-500">.</span>
                    </h2>
                    <p className=" text-sm font-medium">Please enter your credentials to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px]  uppercase tracking-[0.2em] font-bold ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="name@gmail.com"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10  placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px]  uppercase tracking-[0.2em] font-bold">
                                Password
                            </label>





                            
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10  placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500  font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? "Logging in..." : "Log in"}
                        {!loading && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-xs">
                        Don't have an account?{" "}
                        <span className="text-blue-500 cursor-pointer hover:underline font-bold">
                            Contact Admin
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { Login };