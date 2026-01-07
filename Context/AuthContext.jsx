import React, { createContext, useContext, useEffect, useState } from "react";
import Api from "../Services/Api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken");
            const savedUser = localStorage.getItem("user");

            if (!token || !savedUser) {
                setLoading(false);
                return;
            }

            // 🔑 CRITICAL FIX
            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            try {
                // optional optimistic set
                setUser(JSON.parse(savedUser));

                // hard validation
                const res = await Api.get("/auth/me");
                const freshUser = res.data?.data || res.data;

                setUser(freshUser);
                localStorage.setItem("user", JSON.stringify(freshUser));
            } catch (err) {
                localStorage.clear();
                setUser(null);
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const logout = async () => {
        localStorage.clear();
        setUser(null);

        try {
            await Api.post("/auth/logout");
        } catch (_) { }

        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
