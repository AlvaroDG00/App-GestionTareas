# 📝 Gestor de Tareas - Frontend (React + Vite)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

Interfaz de usuario moderna y responsive para una aplicación Full-Stack de gestión de tareas. Este proyecto permite a los usuarios organizar su día a día mediante listas personalizadas, tareas con niveles de prioridad y un sistema de recordatorios en tiempo real.

## ✨ Características Principales

* **🔐 Autenticación Segura:** Sistema de registro e inicio de sesión protegido con JSON Web Tokens (JWT).
* **📁 Gestión de Listas:** Crea, renombra y elimina listas de tareas para organizar diferentes ámbitos (trabajo, personal, estudios).
* **✅ Control Total de Tareas:** * Añade tareas específicas a cada lista.
  * Marca tareas como completadas (con feedback visual).
  * Asigna niveles de prioridad (Baja, Media, Alta) con indicadores de color.
* **⏰ Sistema de Recordatorios:** Alertas automáticas en segundo plano cuando la fecha y hora de una tarea expira.
* **🎨 UI/UX Moderna:** Interfaz limpia centrada en la pantalla, con estados de carga (Loading spinners) y manejo visual de errores sin utilizar molestos `alerts` nativos.

## 🛠️ Tecnologías Utilizadas

* **Librería Principal:** React.js (Hooks funcionales: `useState`, `useEffect`)
* **Bundler:** Vite (para un entorno de desarrollo ultrarrápido)
* **Enrutamiento:** React Router DOM (Single Page Application)
* **Peticiones HTTP:** Axios (con interceptores para inyección automática de tokens)
* **Estilos:** CSS3 nativo (Flexbox, variables, diseño modular y centrado)

## 🚀 Instalación y Uso Local

Para ejecutar este proyecto en tu máquina local, asegúrate de tener [Node.js](https://nodejs.org/) instalado y de que el **Backend** de la aplicación esté corriendo simultáneamente.

### 1. Clonar el repositorio
```bash
git clone https://github.com/AlvaroDG00/App-GestionTareas
cd App-GestionTareas

### 2. Instalar dependencias
npm install

### 3. Iniciar proyecto
npm run dev

📂 Estructura del Proyecto
src/
 ├── api.js              # Configuración de Axios e interceptores JWT
 ├── App.jsx             # Enrutador principal y protección de rutas
 ├── main.jsx            # Punto de entrada de React
 └── pages/
      ├── Auth.css       # Estilos compartidos para Login/Registro
      ├── Dashboard.css  # Estilos principales de la interfaz de tareas
      ├── Dashboard.jsx  # Componente principal (Gestor, Listas, Recordatorios)
      ├── Login.jsx      # Pantalla de inicio de sesión
      └── Register.jsx   # Pantalla de creación de cuenta

👨‍💻 Autor
Desarrollado como proyecto académico y de portfolio personal.
