import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Convert backend user to standard format
    const normalizeUser = (u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        profileImage: typeof u.profileImage === "string" ? u.profileImage : u.profileImage?.url || null,
    });

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(normalizeUser(parsedUser));
            } catch {
                localStorage.clear();
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // Call this whenever you get new user data (login, profile update, etc.)
    const updateAuthUser = (userData) => {
        const normalized = normalizeUser(userData);
        setUser(normalized); // update context
        localStorage.setItem("user", JSON.stringify(normalized)); // persist
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
