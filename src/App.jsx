// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Importamos el componente compartido
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';

function App() {
  return (
    <BrowserRouter>
      {/* El Header se mostrará en TODAS las vistas, tal como dice el mockup */}
      <Header />

      {/* El contenido principal que cambia según la ruta */}
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          {/* Aquí el equipo irá agregando las demás rutas: /registro, /mis-publicaciones, etc. */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;


