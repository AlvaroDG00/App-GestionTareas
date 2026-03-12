import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // <-- Importamos los estilos

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("¡Usuario creado con éxito! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar el usuario.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>

        {error && <div className="error-box"> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Nombre completo"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-modern"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="input-modern"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="input-modern"
            required
          />
          <button type="submit" className="btn-modern">
            Registrarse
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
