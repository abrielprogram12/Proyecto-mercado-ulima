import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { CARRERAS_ULIMA, obtenerIniciales } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../../components/Notificacion/Notificacion';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import ModalBloquearCuenta from '../../../components/Modales/ModalBloquearCuenta';
import {
  esUsuarioBloqueado,
  usuarioTieneReportes,
  filtrarUsuariosPadron
} from '../adminUtils';
import '../admin.css';

export default function GestionUsuariosPage() {
  const navigate = useNavigate();
  const { usuarios, setUsuarios } = useAuth();
  const { setAvisos } = useAviso();

  const [tabActivo, setTabActivo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [filtroCarrera, setFiltroCarrera] = useState('Todas');
  const [filtroReputacion, setFiltroReputacion] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuarioParaBloquear, setUsuarioParaBloquear] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const POR_PAGINA = 6;

  const cuentasEstudiantes = useMemo(
    () => usuarios.filter((u) => u.rol !== 'admin'),
    [usuarios]
  );

  const conteos = useMemo(() => {
    const bloqueados = cuentasEstudiantes.filter(esUsuarioBloqueado).length;
    const conReportes = cuentasEstudiantes.filter(usuarioTieneReportes).length;
    return {
      todos: 248,
      activos: 248 - bloqueados - conReportes,
      conReportes,
      bloqueados: Math.max(bloqueados, 3)
    };
  }, [cuentasEstudiantes]);

  const usuariosFiltrados = useMemo(() => {
    return filtrarUsuariosPadron(cuentasEstudiantes, {
      tabActivo,
      filtroCarrera,
      filtroReputacion,
      busqueda
    });
  }, [cuentasEstudiantes, tabActivo, filtroCarrera, filtroReputacion, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / POR_PAGINA)
  );
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaSegura - 1) * POR_PAGINA,
    paginaSegura * POR_PAGINA
  );

  const handleConfirmarBloqueo = ({ motivo, detalle }) => {
    if (!usuarioParaBloquear) return;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioParaBloquear.id
          ? {
              ...u,
              estadoCuenta: 'Bloqueado',
              motivoBloqueo: motivo,
              detalleBloqueo: detalle
            }
          : u
      )
    );

    if (setAvisos) {
      setAvisos((prev) =>
        prev.map((a) =>
          a.vendedorId === usuarioParaBloquear.id
            ? { ...a, estado: 'Retirado' }
            : a
        )
      );
    }

    setFeedback({
      tipo: 'exito',
      titulo: 'Cuenta bloqueada.',
      mensaje: `Se suspendió la cuenta de ${usuarioParaBloquear.nombres} ${usuarioParaBloquear.apellidos} (${motivo}) y se retiraron sus avisos activos.`
    });
    setUsuarioParaBloquear(null);
  };

  const handleDesbloquear = (usuario) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuario.id
          ? {
              ...u,
              estadoCuenta: 'Activo',
              motivoBloqueo: undefined
            }
          : u
      )
    );

    setFeedback({
      tipo: 'info',
      titulo: 'Bloqueo levantado.',
      mensaje: `La cuenta de ${usuario.nombres} ${usuario.apellidos} vuelve a estar activa en el tablón.`
    });
  };

  const handleVerMotivo = (usuario) => {
    setFeedback({
      tipo: 'advertencia',
      titulo: `Motivo de bloqueo · ${usuario.nombres} ${usuario.apellidos}`,
      mensaje:
        usuario.motivoBloqueo ||
        'Cuenta suspendida preventivamente por acumular múltiples reportes verificados en moderación.'
    });
  };

  const limpiarFiltros = () => {
    setTabActivo('Todos');
    setBusqueda('');
    setFiltroCarrera('Todas');
    setFiltroReputacion('Todas');
    setPaginaActual(1);
  };

  return (
    <div className="page-container">
      <div className="adm-header-row">
        <div>
          <h1 className="title-screen">Gestión de usuarios</h1>
          <p className="text-aux adm-header-subtitle">
            Cuentas registradas con correo institucional @ulima.edu.pe o @aloe.ulima.edu.pe.
          </p>
        </div>

        <div className="adm-controls-inline">
          <input
            type="text"
            className="form-input adm-search-inline"
            placeholder="Buscar por nombre o correo institucional…"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          <select
            className="form-select adm-select-inline"
            value={filtroCarrera}
            onChange={(e) => {
              setFiltroCarrera(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="Todas">Carrera: Todas</option>
            {CARRERAS_ULIMA.map((c) => (
              <option key={c} value={c}>
                Carrera: {c}
              </option>
            ))}
          </select>

          <select
            className="form-select adm-select-inline"
            value={filtroReputacion}
            onChange={(e) => {
              setFiltroReputacion(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="Todas">Reputación: Todas</option>
            <option value="Alta">Reputación: 4.5 ★ o más</option>
            <option value="Baja">Reputación: Menor a 4.0 ★</option>
            <option value="Sin calificaciones">Sin calificaciones</option>
          </select>
        </div>
      </div>

      {feedback && (
        <Notificacion
          tipo={feedback.tipo}
          titulo={feedback.titulo}
          mensaje={feedback.mensaje}
          onClose={() => setFeedback(null)}
        />
      )}

      <div className="adm-tabs-bar">
        {[
          { id: 'Todos', label: `Todos · ${conteos.todos}` },
          { id: 'Activos', label: `Activos · ${conteos.activos}` },
          { id: 'Con reportes', label: `Con reportes · ${conteos.conReportes}` },
          { id: 'Bloqueados', label: `Bloqueados · ${conteos.bloqueados}` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`adm-tab-btn ${
              tabActivo === tab.id ? 'adm-tab-btn--active' : ''
            }`}
            onClick={() => {
              setTabActivo(tab.id);
              setPaginaActual(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {usuariosPaginados.length === 0 ? (
        <EstadoVacio
          icono="👤"
          titulo="No se encontraron cuentas"
          descripcion="Ningún estudiante coincide con los filtros de búsqueda seleccionados."
          textoBoton="Restablecer filtros"
          onAccion={limpiarFiltros}
        />
      ) : (
        <div className="card-surface adm-table-card">
          <table className="adm-data-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>CARRERA / CICLO</th>
                <th>REPUTACIÓN</th>
                <th>AVISOS / ACUERDOS</th>
                <th>ESTADO</th>
                <th className="adm-th-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((u) => {
                const bloqueado = esUsuarioBloqueado(u);
                const bajaRep =
                  u.totalCalificaciones > 0 && (u.reputacion || 0) < 3.5;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-avatar-circle">
                          {u.fotoPerfil ? (
                            <img
                              src={u.fotoPerfil}
                              alt={u.nombres}
                              className="media-img-cover"
                            />
                          ) : (
                            obtenerIniciales(u.nombres, u.apellidos)
                          )}
                        </div>
                        <div>
                          <div className="adm-user-name-bold">
                            {u.nombres} {u.apellidos}
                          </div>
                          <div className="text-aux text-mono adm-user-email">
                            {u.correo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-motivo-text">
                        {u.carrera} · {u.ciclo}
                      </span>
                    </td>
                    <td>
                      {u.totalCalificaciones > 0 ? (
                        <span className={bajaRep ? 'adm-rep-low' : ''}>
                          <strong>{u.reputacion.toFixed(1)}</strong>{' '}
                          <span className="adm-star-gold">★</span>{' '}
                          <span className="text-aux">
                            ({u.totalCalificaciones})
                          </span>
                        </span>
                      ) : (
                        <span className="text-aux">Sin calificaciones</span>
                      )}
                    </td>
                    <td>
                      <span className="text-aux">
                        {u.avisosPublicadosCount || 0} avisos ·{' '}
                        {u.acuerdosCerrados || 0} acuerdos
                      </span>
                    </td>
                    <td>
                      <BadgeEstado estado={u.estadoCuenta} />
                    </td>
                    <td className="adm-td-right">
                      <div className="adm-actions-end">
                        {bloqueado ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDesbloquear(u)}
                            >
                              Desbloquear
                            </button>
                            <button
                              type="button"
                              className="btn btn-tertiary btn-sm"
                              onClick={() => handleVerMotivo(u)}
                            >
                              Motivo
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => navigate(`/vendedor/${u.id}`)}
                            >
                              Ver perfil
                            </button>
                            <button
                              type="button"
                              className="btn btn-tertiary btn-sm adm-link-danger"
                              onClick={() => setUsuarioParaBloquear(u)}
                            >
                              Bloquear
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="adm-pagination-bar">
            <span className="text-aux">
              Mostrando {(paginaSegura - 1) * POR_PAGINA + 1}–
              {Math.min(paginaSegura * POR_PAGINA, usuariosFiltrados.length)} de{' '}
              {conteos.todos} usuarios
            </span>
            <div className="adm-page-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={paginaSegura <= 1}
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPaginas }, (_, idx) => idx + 1).map(
                (num) => (
                  <button
                    key={num}
                    type="button"
                    className={`btn btn-sm ${
                      paginaSegura === num ? 'btn-primary' : 'btn-secondary'
                    }`}
                    onClick={() => setPaginaActual(num)}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={paginaSegura >= totalPaginas}
                onClick={() =>
                  setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                }
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalBloquearCuenta
        abierto={Boolean(usuarioParaBloquear)}
        onClose={() => setUsuarioParaBloquear(null)}
        usuario={usuarioParaBloquear}
        onConfirmar={handleConfirmarBloqueo}
      />
    </div>
  );
}
