import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Importamos los estilos

function Dashboard() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [newListName, setNewListName] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskReminder, setNewTaskReminder] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- FUNCIONES DE LISTAS ---
  const handleCreateList = async (e) => {
    e.preventDefault();
    if (newListName.trim().length < 2)
      return showError("El nombre de la lista es demasiado corto");

    setIsLoading(true);
    try {
      await esperar(800);
      const res = await api.post("/lists", { name: newListName });
      setLists([...lists, res.data]);
      setNewListName("");
      setSelectedList(res.data._id);
    } catch (err) {
      showError("Error al crear la lista");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteList = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta lista y sus tareas?"))
      return;
    setIsLoading(true);
    try {
      await esperar(800);
      await api.delete(`/lists/${id}`);
      setLists(lists.filter((list) => list._id !== id));
      if (selectedList === id) setSelectedList(null);
    } catch (err) {
      showError("Error al borrar la lista");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameList = async (id, currentName) => {
    const newName = window.prompt("Nuevo nombre de la lista:", currentName);
    if (!newName || newName.trim() === currentName) return;
    setIsLoading(true);
    try {
      await esperar(800);
      const res = await api.put(`/lists/${id}`, { name: newName });
      setLists(lists.map((list) => (list._id === id ? res.data : list)));
    } catch (err) {
      showError("Error al renombrar la lista");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIONES DE TAREAS ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedList) return showError("Selecciona una lista primero");
    setIsLoading(true);
    try {
      await esperar(800);
      const payload = {
        listId: selectedList,
        text: newTaskText,
        priority: newTaskPriority,
      };
      if (newTaskReminder)
        payload.reminderAt = new Date(newTaskReminder).toISOString();

      const res = await api.post("/tasks", payload);
      setTasks([...tasks, res.data]);
      setNewTaskText("");
      setNewTaskPriority("medium");
      setNewTaskReminder("");
    } catch (err) {
      showError("Error al crear tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("¿Borrar esta tarea?")) return;
    setIsLoading(true);
    try {
      await esperar(500);
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      showError("Error al borrar tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    setIsLoading(true);
    try {
      await esperar(500);
      const res = await api.put(`/tasks/${id}`, updates);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      showError("Error al actualizar tarea");
    } finally {
      setIsLoading(false);
    }
  };

  // --- EFECTOS DE CARGA DE DATOS ---
  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      try {
        await esperar(600);
        const res = await api.get("/lists");
        setLists(res.data);
      } catch (err) {
        showError("Error al cargar tus listas");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      const fetchTasks = async () => {
        setIsLoading(true);
        try {
          await esperar(600);
          const res = await api.get(`/tasks?listId=${selectedList}`);
          setTasks(res.data);
        } catch (err) {
          showError("Error al cargar las tareas");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [selectedList]);

  useEffect(() => {
    const checkReminders = () => {
      const ahora = new Date();
      tasks.forEach((task) => {
        if (!task.completed && task.reminderAt) {
          const fechaTarea = new Date(task.reminderAt);
          if (fechaTarea <= ahora && !task.reminderSent) {
            alert(`¡RECORDATORIO!: ${task.text}`);
            handleUpdateTask(task._id, { reminderSent: true });
          }
        }
      });
    };
    const timer = setInterval(checkReminders, 30000);
    return () => clearInterval(timer);
  }, [tasks]);

  // --- RENDERIZADO ---
  return (
    <div className="dashboard-page-container">
      <div className="dashboard-wrapper">
        {/* Cabecera / Navbar intacta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h2>Mi Gestor de Tareas</h2>
          <button
            onClick={handleLogout}
            style={{
              background: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* ZONA DE ALERTAS (Errores y Cargando) */}
        {isLoading && (
          <div
            style={{
              background: "#e3f2fd",
              color: "#0d47a1",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            >
              <polyline points="12 2 12 6"></polyline>
              <polyline points="12 18 12 22"></polyline>
              <polyline points="4.93 4.93 7.76 7.76"></polyline>
              <polyline points="16.24 16.24 19.07 19.07"></polyline>
              <polyline points="2 12 6 12"></polyline>
              <polyline points="18 12 22 12"></polyline>
              <polyline points="4.93 19.07 7.76 16.24"></polyline>
              <polyline points="16.24 7.76 19.07 4.93"></polyline>
            </svg>
            Cargando...
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "bold",
              border: "1px solid #ef9a9a",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            {errorMsg}
          </div>
        )}

        {/* APLICAMOS LAS CLASES CSS AQUÍ */}
        <div
          className="dashboard-content"
          style={{
            opacity: isLoading ? 0.6 : 1,
            pointerEvents: isLoading ? "none" : "auto",
            transition: "0.3s",
          }}
        >
          {/* COLUMNA IZQUIERDA: LISTAS */}
          <div className="sidebar">
            <h3>Listas</h3>
            <form onSubmit={handleCreateList} className="form-container">
              <input
                type="text"
                placeholder="Nueva lista..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="input-modern"
                required
              />
              <button type="submit" disabled={isLoading} className="btn-modern">
                Crear
              </button>
            </form>

            {lists.map((list) => (
              <div
                key={list._id}
                className={`list-item ${selectedList === list._id ? "active" : ""}`}
              >
                <span
                  onClick={() => setSelectedList(list._id)}
                  style={{
                    cursor: "pointer",
                    flex: 1,
                    fontWeight: selectedList === list._id ? "bold" : "normal",
                  }}
                >
                  {list.name}
                </span>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {/* Icono Editar Lista */}
                  <button
                    onClick={() => handleRenameList(list._id, list.name)}
                    disabled={isLoading}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#555",
                      display: "flex",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  {/* Icono Borrar Lista */}
                  <button
                    onClick={() => handleDeleteList(list._id)}
                    disabled={isLoading}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#d32f2f",
                      display: "flex",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: TAREAS */}
          <div className="main-content">
            {selectedList ? (
              <>
                <h3>Tareas</h3>
                <form onSubmit={handleCreateTask} className="form-container">
                  <input
                    type="text"
                    placeholder="¿Qué hay que hacer?"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className="input-modern"
                    required
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="input-modern"
                    style={{ flex: "none", width: "120px" }}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                  <input
                    type="datetime-local"
                    value={newTaskReminder}
                    onChange={(e) => setNewTaskReminder(e.target.value)}
                    className="input-modern"
                    style={{ flex: "none" }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-modern"
                  >
                    Añadir
                  </button>
                </form>

                {tasks.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {tasks.map((task) => (
                      <li
                        key={task._id}
                        className={`task-item ${task.completed ? "completed" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) =>
                            handleUpdateTask(task._id, {
                              completed: e.target.checked,
                            })
                          }
                          disabled={isLoading}
                          style={{ transform: "scale(1.5)", cursor: "pointer" }}
                        />

                        <span
                          style={{
                            flex: 1,
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {task.text}
                        </span>

                        <select
                          value={task.priority}
                          onChange={(e) =>
                            handleUpdateTask(task._id, {
                              priority: e.target.value,
                            })
                          }
                          disabled={isLoading}
                          style={{
                            padding: "5px",
                            fontWeight: "bold",
                            border: "none",
                            background: "transparent",
                            color:
                              task.priority === "high"
                                ? "#d32f2f"
                                : task.priority === "medium"
                                  ? "#ed6c02"
                                  : "#2e7d32",
                          }}
                        >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                        </select>

                        {task.reminderAt && (
                          <small
                            style={{
                              color: "#666",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {/* Icono Reloj Recordatorio */}
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ marginRight: "4px" }}
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {new Date(task.reminderAt).toLocaleString()}
                          </small>
                        )}

                        {/* Icono Borrar Tarea */}
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={isLoading}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#d32f2f",
                            display: "flex",
                            padding: "5px",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#666" }}>
                    No hay tareas. ¡Empieza añadiendo una!
                  </p>
                )}
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "50px",
                  color: "#888",
                }}
              >
                <p>← Crea una lista o selecciona una para empezar a trabajar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
