import './App.css'
import './components/product/Products.jsx'
import Products from "./components/product/Products.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/home/home.jsx";
import Navbar from "./components/common/Navbar.jsx";
import About from "./components/about/About.jsx";
import Contact from "./contact/Contact.jsx";
import React, {useEffect} from "react";
import {Toaster} from "react-hot-toast";
import Cart from "./components/cart/Cart.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Chat from "./components/chat/Chat.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import Checkout from "./components/checkout/Checkout.jsx";
import {useDispatch} from "react-redux";
import {loadCurrentUser} from "./store/actions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(loadCurrentUser());
  }, [dispatch]);

  return (
    <React.Fragment>
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        </Routes>
        <Chat />
    </Router>
    <Toaster position="bottom-center"/>
    </React.Fragment>
  )
}

export default App
