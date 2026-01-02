// ProtectedRoutes.tsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function ProtectedRoutes({ children, roles }) {
    const { role, isAuthorized } = useContext(AuthContext);

    if (!roles || isAuthorized === false) {
        return <Navigate to="/login" />;
    }

    if (!roles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoutes;
