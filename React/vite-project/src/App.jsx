import { useState } from 'react'
import './App.css'
import './components/Products.jsx'
import { FaBeer } from 'react-icons/fa';
import Products from "./components/Products.jsx";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Products />
    </div>
  )
}

export default App
