import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Register from "./Pages/Register"
import User from "./Pages/User"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/in/:id" element={<User />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
