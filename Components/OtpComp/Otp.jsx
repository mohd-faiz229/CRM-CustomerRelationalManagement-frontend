import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { callApi } from "../../Services/Api";
import axios from "axios";

// UPDATED COLORS TO MATCH YOUR UI SCREENSHOT
const primaryBlue = "#3b82f6"; // The Electric Blue from your 'Relatio CRM' logo
const bgDark = "#0f172a";      // The deep navy from your sidebar
const cardDark = "#121418";    // The card background color
const inputTextColor = "#ffffff";
const buttonTextColor = "#ffffff";
const errorRed = "#ef4444";    // Modern red for dark mode, not muddy maroon

export const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [email, setEmail] = useState("");

    // Get email from navigation state
    useEffect(() => {
        const navEmail = location.state?.email;
        if (navEmail) {
            setEmail(navEmail);
        } else {
            toast.error("No email found, redirecting to login");
            navigate("/login", { replace: true });
        }
    }, [location.state, navigate]);

    const onSubmit = async (data) => {
        try {
            console.log("OTP SUBMIT TRIGGERED", data);
            const res = await callApi.post("/auth/otp-verify", {
                email,
                otp: data.otp,
            });

            if (res.status === 200) {
                toast.success(res.data.message || "OTP verified successfully");
                navigate("/dashboard", { replace: true });
            } else {
                toast.error(res.data.message || "OTP verification failed");
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || "OTP verification failed";
            toast.error(message);
            console.error("OTP ERROR →", err);
        }
    };

    // Styling logic preserved, just updated border colors to match your UI's 5% white borders
    const inputBaseStyles = `w-full text-sm border-b-2 bg-[#0a0c10] px-3 py-2 outline-none transition-all duration-200 rounded-2xl shadow-sm`;

    if (!email) return null; // wait until email is set

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050a14] px-4 py-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-[#0f172a] border border-white/5 shadow-2xl rounded-3xl px-6 py-6 sm:px-8 sm:py-8 w-full max-w-md flex flex-col gap-4"
            >
                {/* Branding matching your Dashboard Logo */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg">R</div>
                    <h2
                        className="text-2xl sm:text-3xl font-bold text-center"
                        style={{ color: "#ffffff", fontFamily: "Fira Sans, sans-serif" }}
                    >
                        Relatio <span style={{ color: primaryBlue }}>CRM</span>
                    </h2>
                </div>

                <p className="text-center text-sm sm:text-base mb-4 text-slate-400">
                    OTP sent to <strong className="text-white">{email}</strong>
                </p>

                {/* OTP Input */}
                <div className="flex flex-col gap-1">
                    <label style={{ color: "#94a3b8" }} className="text-xs font-semibold uppercase tracking-wider ml-1">Verification Code</label>
                    <input
                        type="text"
                        placeholder="Enter 5-digit OTP"
                        {...register("otp", {
                            required: "OTP is required",
                            minLength: { value: 5, message: "OTP must be 5 digits" },
                            maxLength: { value: 5, message: "OTP must be 5 digits" },
                        })}
                        className={`${inputBaseStyles} ${errors.otp ? "border-red-500/50" : "border-white/10"}`}
                        style={{ color: inputTextColor, borderColor: errors.otp ? errorRed : "rgba(255,255,255,0.1)" }}
                    />
                    {errors.otp && <p style={{ color: errorRed }} className="text-xs sm:text-sm ml-1">{errors.otp.message}</p>}
                </div>

                {/* Submit Button - Updated to match the blue primary color of your CRM */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 font-bold py-2 sm:py-3 text-sm sm:text-base rounded-2xl shadow-lg transition-all duration-300 ${isSubmitting
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20"
                        }`}
                >
                    {isSubmitting ? "Verifying..." : "Verify Identity"}
                </button>
            </form>
        </div>
    );
};
export default Otp;