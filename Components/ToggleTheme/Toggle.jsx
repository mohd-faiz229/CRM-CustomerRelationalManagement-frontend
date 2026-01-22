import { useEffect } from "react";

export default function ThemeToggle({ lightMode, setLightMode }) {

    // Sync the DOM with the state
    useEffect(() => {
        const root = document.documentElement;

        if (lightMode) {
            root.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            root.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }, [lightMode]);

    const handleToggle = () => {
        console.log("toggle is getting hit")
        if (typeof setLightMode === 'function') {
            setLightMode(prev => !prev);
        } else {
            console.error("Critical: 'setLightMode' prop is missing. Check your App.js.");
        }
    };

    return (
        <button
            onClick={handleToggle}
            // Using your CSS variable for the accent color
            className="fixed top-6 right-6  rounded-full shadow-xs z-[100] 
                         bg-accent text-white
                       transition-all  duration-300 hover:scale-110 active:scale-95"
        >
            {lightMode ? "🌙" : "☀️"}
        </button>
    );
}