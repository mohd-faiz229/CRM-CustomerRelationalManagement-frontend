import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { callApi } from "../../Services/Api.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: localStorage.getItem("loginEmail") || "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const normalizedEmail = form.email.trim().toLowerCase();
            console.log("📨 FRONTEND: Sending email →", normalizedEmail);

            const res = await callApi("/auth/login", "post", {
                ...form,
                email: normalizedEmail,
            });

            console.log("LOGIN RESPONSE →", res);

            if (!res || !res.data) throw new Error("No response from server");

            const payload = res.data.data;       // backend payload
            const httpStatus = res.status;       // actual HTTP status

            // ---- OTP FLOW ----
            if (httpStatus === 201 && payload?.email) {
                toast.success("OTP sent to your email"); // ✅ green toast
                return navigate("/otp-verify", {
                    state: { email: payload.email },
                    replace: true,
                });
            }

            // ---- VERIFIED LOGIN FLOW ----
            // ---- VERIFIED LOGIN FLOW ----
            // ---- VERIFIED LOGIN FLOW ----
            // ---- VERIFIED LOGIN FLOW ----
            if (httpStatus === 200 && payload?.accessToken) {
                const { accessToken, user } = payload;

                // 1. Save keys for legacy components
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("userid", user._id);
                localStorage.setItem("role", user.role);

                // 2. Save the FULL object for AuthContext and Header
                localStorage.setItem("user", JSON.stringify(user));

                // 3. Update Global Context State immediately
                setUser({ ...user, isAuthenticated: true });

                toast.success("Welcome back!");
                return navigate("/dashboard", { replace: true });
            }

            // Fallback
            throw new Error(res.data?.message || "Login failed");

        } catch (err) {
            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(message);
            console.log("LOGIN ERROR →", err);
        } finally {
            setLoading(false);
        }
    };



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };   
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-8 lg:p-0">
            <div className="flex w-full max-w-4xl min-h-[600px] bg-[#1e293b] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-700">
                {/* Brand Panel */}
                <div className="hidden md:flex md:w-1/2 relative bg-[#13233a] items-center justify-center">
                    <img src="/Login_Image.png" alt="Relatio CRM" className="object-cover w-full h-full" />
                </div>

                {/* Form Panel */}
                <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-[#1e293b]">
                    <div className="mb-10">
                        <h2 className="text-white text-4xl font-bold tracking-tight mb-2">Welcome back</h2>
                        <p className="text-slate-400 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-semibold ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-slate-300 text-sm font-semibold">Password</label>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Log In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { Login };
