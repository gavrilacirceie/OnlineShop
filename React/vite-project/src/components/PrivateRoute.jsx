import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false, sellerOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles.includes("ROLE_SELLER");
    if (publicPage) {
        return user ? <Navigate to="/" /> : <Outlet />
    }

    if (adminOnly) {
        if (!isAdmin) return <Navigate to={isSeller ? "/seller/products" : "/"} replace />;
    }

    if (sellerOnly && !isSeller) {
        return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
    }

    if (!isAdmin && !isSeller) {
        return <Navigate to="/"/>
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute
