import { useState } from 'react'
import './App.css'
import { FaBeer } from 'react-icons/fa';


function App() {
  const [count, setCount] = useState(0)

  return (
    <h3> Lets go for a <FaBeer />? </h3>
  )
}

export default App
