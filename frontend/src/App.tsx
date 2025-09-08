import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//PAGES

import Home from "./pages/Home"
import Login from "./pages/Login";
import CadastraUsuario from "./pages/CadastraUsuario";
import Musica from "./pages/Musica";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/cadastrausuario" element={<CadastraUsuario />} />
          <Route path="/login" element={<Login />} />
          <Route path="/musica/:id" element={<Musica />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
