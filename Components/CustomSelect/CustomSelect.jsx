import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ options, value, onChange, placeholder, error }) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

    // Logic kept exactly as original
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Find the label to display (Logic)
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={selectRef} className="relative w-full">
            <div
                onClick={() => setOpen(!open)}
                className={`w-full px-3 py-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all duration-300 border
                    ${open ? "bg-white/20 border-white/40" : "bg-white/10 border-white/20 hover:bg-white/15"} 
                    ${error ? "border-red-500/50 bg-red-500/10" : ""}
                `}
            >
                {/* Changed text color from PrimaryBlue to white/opacity variants */}
                <span className={`text-sm ${value ? "text-white font-medium" : "text-white/60"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-300 text-white/70 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full backdrop-blur-xl bg-[#1e293b]/95 border border-white/20 rounded-2xl shadow-2xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1.5">
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`px-3 py-2.5 my-0.5 cursor-pointer rounded-xl text-sm transition-all duration-200
                                    ${value === opt.value
                                        ? "bg-white text-slate-900 font-bold shadow-md"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;