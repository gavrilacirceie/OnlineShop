import { useState } from 'react'
import './App.css'
import './components/product/Products.jsx'
import { FaBeer } from 'react-icons/fa';
import Products from "./components/product/Products.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/home/home.jsx";
import Navbar from "./components/common/Navbar.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
        </Routes>
    </Router>
  )
}

export default App
