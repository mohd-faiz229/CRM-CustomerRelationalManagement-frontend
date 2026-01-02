import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const primaryBlue = "#01497C";
const inputTextColor = "#012A4A";
const buttonTextColor = "#013A63";
const errorMaroon = "#800000";

export const Otp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [email, setEmail] = useState("");

    // Get email from navigation state
    useEffect(() => {
        const navState = window.history.state?.user;
        if (navState?.email) {
            setEmail(navState.email);
        } else {
            toast.error("No email found, redirecting to login");
            navigate("/login");
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("http://localhost:3000/api/auth/otp-verify", {
                email,
                otp: Number(data.otp),
            });
            toast.success(res.data.message);
          
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verification failed");
        }
    };

    const inputBaseStyles = `w-full text-sm text-[${inputTextColor}] border-b-2 bg-transparent px-3 py-2 outline-0 transition-all duration-200 rounded-2xl shadow-sm focus:border-[${primaryBlue}]`;

    if (!email) return null; // wait until email is set

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="backdrop-blur-xs bg-white/60 border border-white/30 shadow-2xl rounded-3xl px-6 py-6 sm:px-8 sm:py-8 w-full max-w-md flex flex-col gap-4"
            >
                <h2
                    className={`text-2xl sm:text-3xl font-bold text-[${primaryBlue}] tracking-wide mb-2 text-center`}
                    style={{ fontFamily: "Fira Sans, sans-serif" }}
                >
                    Enter OTP
                </h2>
                <p className={`text-center text-sm sm:text-base mb-4 w-full text-[.5rem] text-blue-900`}>
                    OTP sent to <strong className="flex flex-wrap items-center justify-center">{email}</strong>
                </p>

                {/* OTP Input */}
                <div className="flex flex-col gap-1">
                    <label className={`text-[${primaryBlue}] font-semibold ml-1`}>OTP</label>
                    <input
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        {...register("otp", {
                            required: "OTP is required",
                            minLength: { value: 4, message: "OTP must be 4 digits" },
                            maxLength: { value: 4, message: "OTP must be 4 digits" },
                        })}
                        className={`${inputBaseStyles} ${errors.otp ? `border-[${errorMaroon}] bg-red-50/10` : `border-[${primaryBlue}]/50`}`}
                    />
                    {errors.otp && <p className={`text-[${errorMaroon}] text-xs sm:text-sm ml-1`}>{errors.otp.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 font-bold py-2 sm:py-3 text-sm sm:text-base rounded-2xl shadow-lg transition-all duration-300 ${isSubmitting
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : `bg-[#e6ecf3]/80 hover:bg-[#d7e0ea] text-[${buttonTextColor}] hover:shadow-xl`
                        }`}
                >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
};
