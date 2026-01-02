import React, { createContext, useContext, useState, useEffect } from "react";
import Api from "../Services/Api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ✅ FIX: Initialize state directly from LocalStorage 
    // This prevents the "user not logged in" flicker on refresh
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                return { ...parsedUser, isAuthenticated: true };
            } catch (err) {
                console.error("Auth Initialization Error:", err);
                return null;
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(false); // Set to false since we initialize in useState

    const logout = async () => {
        // 1. CLEAR LOCALLY FIRST
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userid"); // Clear your legacy key too
        localStorage.removeItem("role");   // Clear your legacy key too
        setUser(null);

        try {
            // 2. Optional server call
            Api.post("/auth/logout");
        } catch (err) {
            console.warn("Logout server call failed, but local session cleared.");
        }

        // 3. Redirect
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);