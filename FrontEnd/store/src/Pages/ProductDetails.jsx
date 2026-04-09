import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const BASEURL = import.meta.env.VITE_BASE_URL;
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        // Ensure the ID exists before fetching
        if (!id) return;

        fetch(`${BASEURL}/api/products/${id}/`)
            .then((response) => {
                if (!response.ok) throw new Error("Product not found");
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, BASEURL]);

    const handleAddToCart = () => {
        const token = localStorage.getItem("access_token");
        if (!token || token === "undefined") {
            // Use navigate instead of window.location for better performance
            navigate("/login");
            return;
        }
        addToCart(product.id);
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-red-500 text-lg mb-4">Error: {error}</p>
            <Link to="/" className="text-blue-500 hover:underline">Return to Gallery</Link>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-gray-50">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Image Section */}
                    <div className="md:w-1/2">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-xl shadow-sm"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                        <p className="text-2xl font-bold text-blue-600 mb-8">${product.price}</p>
                        
                        <button 
                            onClick={handleAddToCart} 
                            className="w-full md:w-max bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer shadow-md active:transform active:scale-95"
                        >
                            Add to Cart
                        </button>

                        <div className="mt-8 border-t pt-6">
                            <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center gap-2 transition">
                                <span>&larr;</span> Back to Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;