import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user?.id) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
