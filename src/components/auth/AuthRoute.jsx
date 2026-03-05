import { Navigate } from 'react-router-dom';

export default function AuthRoute({ children }) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
