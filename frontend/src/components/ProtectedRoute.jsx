import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ children, role }) {

    const { user, isAuthenticated } = useAuth();

    // User is not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role restriction
    if (role && user?.role !== role) {
        if (user?.role === "CANDIDATE") {
            return <Navigate to="/candidate/dashboard" replace />;
        }

        if (user?.role === "RECRUITER") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;