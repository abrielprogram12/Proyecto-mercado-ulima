import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerIniciales, ROLES_USUARIO } from '../../data/contratoDatos';
import './Header.css';

export default function Header() {
  const { usuarioActual, rolActual, logout, cambiarSesionPrueba } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleBuscar = (e) => {
    e.preventDefault();
    const termino = busqueda.trim();
    if (rolActual === ROLES_USUARIO.ADMIN) {
      navigate(`/admin/reportes${termino ? `?q=${encodeURIComponent(termino)}` : ''}`);
    } else {
      navigate(`/catalogo${termino ? `?q=${encodeURIComponent(termino)}` : ''}`);
    }
  };

  const handleCambioSesion = (e) => {
    const valor = e.target.value;
    setMenuAbierto(false);
    const usuario = cambiarSesionPrueba(valor);
    if (!usuario) {
      navigate('/');
    } else if (usuario.rol === ROLES_USUARIO.ADMIN) {
      navigate('/admin/reportes');
    } else {
      navigate('/mi-cuenta');
    }
  };

  const valorSelectorActual = !usuarioActual
    ? 'visitante'
    : usuarioActual.id === 'u-admin'
      ? 'admin'
      : usuarioActual.id === 'u-2'
        ? 'diego'
        : 'rosa';

  const iniciales = usuarioActual
    ? obtenerIniciales(usuarioActual.nombres, usuarioActual.apellidos)
    : 'UL';

  const nombreCorto = usuarioActual
    ? `${usuarioActual.nombres.split(' ')[0]} ${usuarioActual.apellidos.split(' ')[0]}`
    : '';

  return (
    <header className="site-header">
      {/* Barra superior principal */}
      <div className="header-top">
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="header-logo-mark" aria-hidden="true" />
            <span className="header-logo-text">Tablón ULima</span>
          </Link>

          {rolActual === ROLES_USUARIO.ADMIN && (
            <span className="header-admin-pill">PANEL DE ADMINISTRACIÓN</span>
          )}

          {rolActual === ROLES_USUARIO.VISITANTE && (
            <nav className="header-visitor-nav" aria-label="Navegación pública">
              <Link to="/catalogo" className="visitor-nav-link">Catálogo</Link>
              <a href="/#como-funciona" className="visitor-nav-link">Cómo funciona</a>
              <a href="/#normas" className="visitor-nav-link">Normas del tablón</a>
              <a href="/#ayuda" className="visitor-nav-link">Ayuda</a>
            </nav>
          )}

          {(rolActual === ROLES_USUARIO.USUARIO || rolActual === ROLES_USUARIO.ADMIN) && (
            <form className="header-search-form" onSubmit={handleBuscar}>
              <input
                type="search"
                className="header-search-input"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={
                  rolActual === ROLES_USUARIO.ADMIN
                    ? 'Buscar por aviso, usuario o código…'
                    : 'Buscar libros, calculadoras, apuntes…'
                }
              />
            </form>
          )}
        </div>

        <div className="header-right">
          {/* Selector discreto de sesión de prueba para demostración del equipo */}
          <div className="demo-role-switcher" title="Cambiar sesión rápida de prueba">
            <span className="demo-switcher-label">Sesión demo:</span>
            <select
              value={valorSelectorActual}
              onChange={handleCambioSesion}
              className="demo-switcher-select"
              aria-label="Cambiar sesión de prueba"
            >
              <option value="visitante">Visitante (Sin sesión)</option>
              <option value="rosa">Rosa Quispe (Usuario)</option>
              <option value="diego">Diego Vargas (Usuario)</option>
              <option value="admin">Julio Mendoza (Admin)</option>
            </select>
          </div>

          {rolActual === ROLES_USUARIO.VISITANTE && (
            <>
              <span className="role-badge role-badge-visitante">VISITANTE</span>
              {location.pathname !== '/login' && (
                <Link to="/login" className="header-login-link">
                  Ingresar
                </Link>
              )}
              {location.pathname !== '/registro' && (
                <Link to="/registro" className="btn btn-primary btn-sm">
                  Crear cuenta
                </Link>
              )}
            </>
          )}

          {rolActual === ROLES_USUARIO.USUARIO && (
            <>
              <Link to="/nuevo-aviso" className="btn btn-primary btn-sm">
                Publicar aviso
              </Link>
              <span className="role-badge role-badge-usuario">USUARIO</span>
              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-menu-trigger"
                  onClick={() => setMenuAbierto((prev) => !prev)}
                >
                  <span className="user-avatar-chip">{iniciales}</span>
                  <span className="user-trigger-name">{nombreCorto} ▾</span>
                </button>
                {menuAbierto && (
                  <div className="user-dropdown card-surface">
                    <Link
                      to="/mi-cuenta"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Mi cuenta
                    </Link>
                    <Link
                      to="/mis-publicaciones"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Mis publicaciones
                    </Link>
                    <Link
                      to="/acceso-denegado"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Probar Acceso Denegado (1.6)
                    </Link>
                    <button
                      type="button"
                      className="dropdown-item dropdown-logout"
                      onClick={() => {
                        setMenuAbierto(false);
                        logout();
                        navigate('/login');
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {rolActual === ROLES_USUARIO.ADMIN && (
            <>
              <span className="role-badge role-badge-admin">ADMINISTRADOR</span>
              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-menu-trigger"
                  onClick={() => setMenuAbierto((prev) => !prev)}
                >
                  <span className="user-avatar-chip">{iniciales}</span>
                  <span className="user-trigger-name">{nombreCorto} ▾</span>
                </button>
                {menuAbierto && (
                  <div className="user-dropdown card-surface">
                    <Link
                      to="/admin/reportes"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Bandeja de reportes
                    </Link>
                    <button
                      type="button"
                      className="dropdown-item dropdown-logout"
                      onClick={() => {
                        setMenuAbierto(false);
                        logout();
                        navigate('/login');
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Barra inferior de pestañas — ROL USUARIO */}
      {rolActual === ROLES_USUARIO.USUARIO && (
        <nav className="header-subnav-user" aria-label="Menú de usuario">
          <NavLink to="/catalogo" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Catálogo
          </NavLink>
          <NavLink to="/mis-publicaciones" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Mis publicaciones
          </NavLink>
          <NavLink to="/favoritos" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Favoritos
          </NavLink>
          <NavLink to="/ofertas" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Ofertas
          </NavLink>
          <NavLink to="/acuerdos" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Acuerdos
          </NavLink>
          <NavLink to="/calificaciones" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Calificaciones
          </NavLink>
          <NavLink to="/mi-cuenta" className={({ isActive }) => `subnav-tab ${isActive ? 'active' : ''}`}>
            Mi cuenta
          </NavLink>
        </nav>
      )}

      {/* Barra inferior oscura — ROL ADMINISTRADOR */}
      {rolActual === ROLES_USUARIO.ADMIN && (
        <nav className="header-subnav-admin" aria-label="Menú de administración">
          <div className="admin-tabs-left">
            <NavLink to="/admin/reportes" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
              Reportes
            </NavLink>
            <NavLink to="/admin/usuarios" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
              Usuarios
            </NavLink>
            <NavLink to="/admin/metricas" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
              Tablero de métricas
            </NavLink>
            <span className="admin-tab admin-tab-static">Categorías y cursos</span>
            <span className="admin-tab admin-tab-static">Normas del tablón</span>
          </div>
          <span className="admin-alert-count">3 reportes nuevos por revisar</span>
        </nav>
      )}
    </header>
  );
}
