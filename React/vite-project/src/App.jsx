import './App.css'
import './components/product/Products.jsx'
import Products from "./components/product/Products.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/home/home.jsx";
import Navbar from "./components/common/Navbar.jsx";
import About from "./components/about/About.jsx";
import Contact from "./contact/Contact.jsx";
import React, {useState} from "react";
import {Toaster} from "react-hot-toast";
import Cart from "./components/cart/Cart.jsx";

function App() {
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
        </Routes>
    </Router>
    <Toaster position="bottom-center"/>
    </React.Fragment>
  )
}

export default App
