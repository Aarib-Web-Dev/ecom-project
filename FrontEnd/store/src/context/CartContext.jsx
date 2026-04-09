import { useContext, createContext, useState, useEffect } from 'react';
import { authFetch, getAccessToken } from '../Utils/auth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  // 1. Add loading state initialized to true
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    // If there is no token at all, don't even try to fetch; just stop loading.
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true); 
      const res = await authFetch('/api/cart/');

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setTotal(data.total || 0);
      } else if (res.status === 401) {
        // 2. Handle Backend Rejection: Stop loading so the UI can show "Empty" or "Login"
        console.warn("Unauthorized: Clearing cart state.");
        clearCart();
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      // 3. Ensure loading is set to false regardless of success or 401 failure
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    try {
      await authFetch('/api/cart/add/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      fetchCart();
    } catch (error) { console.error(error); }
  };

  const removeFromCart = async (productId) => {
    try {
      await authFetch('/api/cart/remove/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }) 
      });  
      fetchCart();
    } catch (error) { console.error(error); }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      const res = await authFetch('/api/cart/update/', {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: cartItemId, quantity: quantity })
      });
      if (res.ok) await fetchCart();
    } catch (error) { console.error(error); }
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
  };

  return (
    // 4. Pass 'loading' in the provider value
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, total, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);