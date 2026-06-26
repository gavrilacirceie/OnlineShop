import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    if (user && user.id) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestRoute;

