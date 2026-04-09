import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
// import { createOrder } from "../services/api";
import { authFetch } from "../Utils/auth";


function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("null");


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
        const response = await authFetch('/api/orders/create/', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}) // add your data here
        });

        const data = await response.json();

        if (response.ok) {
            setMessage("Order placed successfully!");
            fetch(`${BASEURL}/api/cart/`);
            clearCart();
            setTimeout(() => navigate("/"), 2000);
        } else {
            setMessage(data.error || "Failed to place order");
        }

    } catch (error) {
        setMessage("An error occurred. Please try again later");
    }
};

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>


            <form onSubmit={handleSubmit} className="space-y-4">
                //lable and input for name, address, phone, payment method
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Address</label>
                    <textarea
                        name="address"
                        placeholder="Enter your address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                </div>
                <div>
                    <label className="block text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="phone no"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Payment Method</label>
                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="card">Credit Card</option>
                        <option value="Jazz Cash">Jazz Cash</option>
                    </select>

                    <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                    {message && <p className="text-center mt-4 text-green-600">{message}</p>}
                </div>
            </form>
            
        </div>
    </div>
  );
}

export default CheckoutPage;