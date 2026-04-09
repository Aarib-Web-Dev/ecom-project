import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    // Basic check: is the token there and not just an empty string?
    const token = localStorage.getItem("access_token");
    return !!token && token !== "undefined" && token !== "null";
};

export default function PrivateRoute({ redirectTo = "/login" }) {
    // If authenticated, render the nested routes (<Outlet />)
    // If not, redirect to the login page
    return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} replace />;
}