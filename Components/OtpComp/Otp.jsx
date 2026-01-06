import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { callApi } from "../../Services/Api";

const primaryBlue = "#01497C";
const inputTextColor = "#012A4A";
const buttonTextColor = "#013A63";
const errorMaroon = "#800000";

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
            const res = await callApi("/auth/otp-verify", "post", {
                email,
                otp: data.otp, // keep as string
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

    const inputBaseStyles = `w-full text-sm border-b-2 bg-transparent px-3 py-2 outline-none transition-all duration-200 rounded-2xl shadow-sm`;

    if (!email) return null; // wait until email is set

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="backdrop-blur-xs bg-white/60 border border-white/30 shadow-2xl rounded-3xl px-6 py-6 sm:px-8 sm:py-8 w-full max-w-md flex flex-col gap-4"
            >
                <h2
                    className="text-2xl sm:text-3xl font-bold mb-2 text-center"
                    style={{ color: primaryBlue, fontFamily: "Fira Sans, sans-serif" }}
                >
                    Enter OTP
                </h2>
                <p className="text-center text-sm sm:text-base mb-4 text-blue-900">
                    OTP sent to <strong>{email}</strong>
                </p>

                {/* OTP Input */}
                <div className="flex flex-col gap-1">
                    <label style={{ color: primaryBlue }} className="font-semibold ml-1">OTP</label>
                    <input
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        {...register("otp", {
                            required: "OTP is required",
                            minLength: { value: 5, message: "OTP must be 5 digits" },
                            maxLength: { value: 5, message: "OTP must be 5 digits" },
                        })}
                        className={`${inputBaseStyles} ${errors.otp ? "border-[maroon] bg-red-50/10" : "border-gray-300"}`}
                        style={{ color: inputTextColor, borderColor: errors.otp ? errorMaroon : "#ccc" }}
                    />
                    {errors.otp && <p style={{ color: errorMaroon }} className="text-xs sm:text-sm ml-1">{errors.otp.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 font-bold py-2 sm:py-3 text-sm sm:text-base rounded-2xl shadow-lg transition-all duration-300 ${isSubmitting
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#e6ecf3]/80 hover:bg-[#d7e0ea] text-[#013A63] hover:shadow-xl"
                        }`}
                >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
};
export default Otp;