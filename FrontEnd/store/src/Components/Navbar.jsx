import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearToken, getAccessToken } from "../Utils/auth";
function Navbar() {
    const { cartItems } = useCart();
    const navigate = useNavigate();


    // Add the "?" and "|| []" to handle the undefined state safely
    const cartCount = (cartItems || []).reduce((total, item) => total + item.quantity, 0);


    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearToken();
        navigate("/login");
    }
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">My Store</Link>
            <div className="flex items-center gap-6">
                {isLoggedIn ? (
                    /* If logged in, show Logout */
                    <button onClick={handleLogout} className="hover:text-yellow-300">
                        Logout
                    </button>
                ) : (
                    /* If NOT logged in, show Login/Signup */
                    <>
                        <Link to="/login" className="hover:text-yellow-300">Login</Link>
                        <Link to="/signup" className="hover:text-yellow-300">Signup</Link>
                    </>
                )}
            </div>
            <Link to="/cart" className="relative text-yellow-300 hover:text-yellow-400 cursor-pointer">
                Cart
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {cartCount}
                    </span>
                )}
            </Link>
        </nav>
    );
}


export default Navbar;