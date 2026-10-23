import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReporte } from '../../context/ReporteContext';
import { ROLES_USUARIO, obtenerIniciales } from '../../data/contratoDatos';
import './Header.css';

export default function Header() {
  const {
    usuarioActual,
    rolActual,
    logout
  } = useAuth();
  const { obtenerConteosReportes } = useReporte();

  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const conteosReportes = obtenerConteosReportes ? obtenerConteosReportes() : { nuevos: 3 };

  const handleSubmitBusqueda = (e) => {
    e.preventDefault();
    const limpio = terminoBusqueda.trim();
    if (limpio) {
      navigate(`/catalogo?q=${encodeURIComponent(limpio)}`);
    } else {
      navigate('/catalogo');
    }
  };

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    logout();
    navigate('/');
  };

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
            <span className="header-logo-mark" />
            <span className="header-logo-text">Tablón ULima</span>
          </Link>

          {rolActual === ROLES_USUARIO.ADMIN && (
            <span className="header-admin-pill">PANEL DE ADMINISTRACIÓN</span>
          )}

          {rolActual === ROLES_USUARIO.VISITANTE && (
            <nav className="header-visitor-nav">
              <NavLink to="/catalogo" className="visitor-nav-link">
                Catálogo
              </NavLink>
              <a href="/#como-funciona" className="visitor-nav-link">
                Cómo funciona
              </a>
            </nav>
          )}

          {rolActual === ROLES_USUARIO.USUARIO && (
            <form className="header-search-form" onSubmit={handleSubmitBusqueda}>
              <input
                type="search"
                className="header-search-input"
                placeholder="Buscar por libro, curso o autor..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </form>
          )}
        </div>

        <div className="header-right">
          {/* Insignia de Rol */}
          {rolActual === ROLES_USUARIO.VISITANTE && (
            <>
              <span className="role-badge role-badge-visitante">VISITANTE</span>
              <Link to="/login" className="header-login-link">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn btn-primary btn-sm">
                Crear cuenta
              </Link>
            </>
          )}

          {rolActual === ROLES_USUARIO.USUARIO && (
            <>
              <span className="role-badge role-badge-usuario">USUARIO</span>
              <Link to="/nuevo-aviso" className="btn btn-primary btn-sm">
                + Publicar aviso
              </Link>

              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-menu-trigger"
                  onClick={() => setMenuAbierto((prev) => !prev)}
                >
                  <span className="user-avatar-chip">
                    {usuarioActual?.fotoPerfil ? (
                      <img
                        src={usuarioActual.fotoPerfil}
                        alt={nombreCorto}
                        className="media-img-cover user-avatar-img"
                      />
                    ) : (
                      iniciales
                    )}
                  </span>
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
                      to={`/reputacion/${usuarioActual.id}`}
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Mi perfil público
                    </Link>
                    <Link
                      to="/calificaciones"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Mis calificaciones
                    </Link>
                    <button
                      type="button"
                      className="dropdown-item dropdown-logout"
                      onClick={handleCerrarSesion}
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
                  <span className="user-avatar-chip">
                    {usuarioActual?.fotoPerfil ? (
                      <img
                        src={usuarioActual.fotoPerfil}
                        alt={nombreCorto}
                        className="media-img-cover user-avatar-img"
                      />
                    ) : (
                      iniciales
                    )}
                  </span>
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
                    <Link
                      to="/admin/usuarios"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Gestión de usuarios
                    </Link>
                    <Link
                      to="/admin/metricas"
                      className="dropdown-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      Tablero de métricas
                    </Link>
                    <button
                      type="button"
                      className="dropdown-item dropdown-logout"
                      onClick={handleCerrarSesion}
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

      {/* Sub-barra de navegación para Estudiante (Usuario) */}
      {rolActual === ROLES_USUARIO.USUARIO && (
        <nav className="header-subnav-user">
          <NavLink to="/catalogo" className="subnav-tab">
            Catálogo
          </NavLink>
          <NavLink to="/mis-publicaciones" className="subnav-tab">
            Mis publicaciones
          </NavLink>
          <NavLink to="/ofertas" className="subnav-tab">
            Ofertas
          </NavLink>
          <NavLink to="/acuerdos" className="subnav-tab">
            Acuerdos
          </NavLink>
          <NavLink to="/favoritos" className="subnav-tab">
            Favoritos
          </NavLink>
          <NavLink to="/calificaciones" className="subnav-tab">
            Calificaciones
          </NavLink>
          <NavLink to="/mi-cuenta" className="subnav-tab">
            Mi cuenta
          </NavLink>
        </nav>
      )}

      {/* Sub-barra oscura para Administrador */}
      {rolActual === ROLES_USUARIO.ADMIN && (
        <nav className="header-subnav-admin">
          <div className="admin-tabs-left">
            <NavLink to="/admin/reportes" className="admin-tab">
              Bandeja de reportes
            </NavLink>
            <NavLink to="/admin/usuarios" className="admin-tab">
              Gestión de usuarios
            </NavLink>
            <NavLink to="/admin/metricas" className="admin-tab">
              Tablero de métricas
            </NavLink>
            <NavLink to="/catalogo" className="admin-tab">
              Catálogo y categorías
            </NavLink>
          </div>
          <span className="admin-alert-count">
            {conteosReportes.nuevos}{' '}
            {conteosReportes.nuevos === 1 ? 'reporte nuevo' : 'reportes nuevos'} por revisar
          </span>
        </nav>
      )}
    </header>
  );
}
