import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading, isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    // Wait for auth state to initialize before making access decisions
    if (loading) return null;

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but user object hasn't loaded yet, wait briefly
    if (!user) return null;

    // If no specific roles required, allow any authenticated user
    if (roles.length === 0) {
        return children;
    }

    if (!hasRole(roles)) {
        // User authenticated but not authorized — redirect to dashboard instead of a dead-end
        // This handles edge cases where role doesn't match (e.g., stale token)
        console.warn(`[ProtectedRoute] User role "${user.role}" not in allowed roles:`, roles);
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
