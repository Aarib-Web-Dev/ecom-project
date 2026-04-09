import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProductDetails from "./Pages/ProductDetails";
import CartPage from "./Pages/CartPage";
import ProductList from "./Pages/ProducList"
import Navbar from "./Components/Navbar";
import CheckoutPage from "./Pages/checkoutPage";
import PrivateRoute from "./Components/privateRoute";
import Signup from "./Pages/Singup";
import Login from "./Pages/Login";
function App() {
  return (
    <Router>
      <Navbar />   
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route   element={<PrivateRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        
      </Routes>
    </Router>
  );
  
}

export default App;