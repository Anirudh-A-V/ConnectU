import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Login from "./Pages/Login"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
