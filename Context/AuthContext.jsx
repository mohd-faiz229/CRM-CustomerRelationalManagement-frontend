import  { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const normalizeUser = (u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        profileImage:
            typeof u.profileImage === "string"
                ? u.profileImage
                : u.profileImage?.url || null
    });

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(normalizeUser(parsedUser));
            } catch {
                localStorage.clear();
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        setLoading(false);
    }, []);

    const updateAuthUser = (userData) => {
        const normalized = normalizeUser(userData);
        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
    };
    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, updateAuthUser, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
