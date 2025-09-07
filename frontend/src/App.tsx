import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//PAGES

import Home from "./pages/Home"
import Login from "./pages/Login";
import CadastraUsuario from "./pages/CadastraUsuario";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/cadastrausuario" element={<CadastraUsuario />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
