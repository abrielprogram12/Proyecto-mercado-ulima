// src/components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ backgroundColor: '#1a1a1a', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Logo a la izquierda */}
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Tablón ULima</Link>
      </div>
      
      {/* Enlaces a la derecha según el mockup */}
      <nav style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Catálogo</Link>
        <Link to="/como-funciona" style={{ color: 'white', textDecoration: 'none' }}>Cómo funciona</Link>
        <Link to="/normas" style={{ color: 'white', textDecoration: 'none' }}>Normas del tablón</Link>
        <Link to="/ayuda" style={{ color: 'white', textDecoration: 'none' }}>Ayuda</Link>
        <Link to="/login" style={{ color: '#ff6b00', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</Link>
        <Link to="/registro" style={{ color: 'white', textDecoration: 'none', border: '1px solid white', padding: '5px 10px', borderRadius: '5px' }}>Regístrate</Link>
      </nav>
    </header>
  );
}

export default Header;