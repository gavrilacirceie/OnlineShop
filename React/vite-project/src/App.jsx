import './App.css'
import './components/product/Products.jsx'
import Products from "./components/product/Products.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/home/home.jsx";
import Navbar from "./components/common/Navbar.jsx";
import About from "./components/about/About.jsx";
import Contact from "./contact/Contact.jsx";

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    </Router>
  )
}

export default App
