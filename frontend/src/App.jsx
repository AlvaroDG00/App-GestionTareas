import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* El Dashboard será tu panel de Listas y Tareas */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Si el usuario entra en una ruta que no existe, al Login */}
        <Route path="*" element={<Navigate to="/login" />} />

        {/* Ruta para registro */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
