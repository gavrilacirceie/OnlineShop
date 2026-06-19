import { useState } from 'react'
import './App.css'
import './components/product/Products.jsx'
import { FaBeer } from 'react-icons/fa';
import Products from "./components/product/Products.jsx";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Products />
    </div>
  )
}

export default App
