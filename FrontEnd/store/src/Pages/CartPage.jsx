import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  // Ensure the variable name matches your .env (VITE_BASE_URL or VITE_BASEURL)
  const BASEURL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_BASEURL;

  // Safety check: If cartItems hasn't loaded yet, don't try to read .length
  if (!cartItems) {
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Optional Loading Text */}
        <p className="text-gray-500 font-medium animate-pulse">Loading your cart...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 mb-6 border-b pb-4">
              <img
                src={item.product_image ? `${BASEURL}${item.product_image}` : "https://via.placeholder.com/150"}
                alt={item.product_name}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">
                {/* ✅ Use product_name and product_price from your Serializer */}
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-gray-600">${Number(item.product_price).toFixed(2)}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} // ✅ Change item.id to item.product
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                > - </button>

                <span className="font-bold px-2">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} // ✅ Change item.id to item.product
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                > + </button>

                <button
                  onClick={() => removeFromCart(item.id)} // ✅ Change item.id to item.product
                  className="bg-red-500 text-white px-3 py-1 rounded ml-4 hover:bg-red-600"
                > Remove </button>
              </div>
            </div>
          ))
        )}

        <div className="text-right mt-6 text-xl font-bold">
          Total: ${Number(total || 0).toFixed(2)}

          <Link to="/checkout" className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;