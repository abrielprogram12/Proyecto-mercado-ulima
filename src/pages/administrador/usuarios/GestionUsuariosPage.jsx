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

  const POR_PAGINA = 8;

  // Excluir la cuenta administrativa del listado de estudiantes
  const cuentasEstudiantes = useMemo(
    () => usuarios.filter((u) => u.rol !== 'admin'),
    [usuarios]
  );

  const conteos = useMemo(() => {
    const bloqueados = cuentasEstudiantes.filter(esUsuarioBloqueado).length;
    const conReportes = cuentasEstudiantes.filter(usuarioTieneReportes).length;
    const activos = cuentasEstudiantes.length - bloqueados;
    return {
      todos: 248,
      activos: 240 + activos,
      conReportes,
      bloqueados
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

  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAGINA));
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

  const limpiarFiltros = () => {
    setTabActivo('Todos');
    setBusqueda('');
    setFiltroCarrera('Todas');
    setFiltroReputacion('Todas');
    setPaginaActual(1);
  };

  return (
    <div className="container">
      {/* Encabezado */}
      <div className="adm-header-row">
        <div>
          <span className="label-upper">ADMINISTRACIÓN DEL PADRÓN · HU-7</span>
          <h1 className="mt-4">Gestión de usuarios</h1>
          <p className="text-aux">
            Supervisa las cuentas institucionales registradas, su reputación y sus antecedentes de reportes.
          </p>
        </div>
        <div className="flex-row gap-8">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/admin/reportes')}
          >
            Bandeja de reportes
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/admin/metricas')}
          >
            Tablero de métricas
          </button>
        </div>
      </div>

      {feedback && (
        <Notificacion
          tipo={feedback.tipo}
          titulo={feedback.titulo}
          mensaje={feedback.mensaje}
        />
      )}

      {/* Pestañas y barra de filtros */}
      <div className="card adm-filters-card">
        <div className="adm-tabs-top">
          <div className="tabs-bar adm-tabs-bar-clean">
            {[
              { id: 'Todos', label: `Todos · ${conteos.todos}` },
              { id: 'Activos', label: `Activos · ${conteos.activos}` },
              { id: 'Con reportes', label: `Con reportes · ${conteos.conReportes}` },
              { id: 'Bloqueados', label: `Bloqueados · ${conteos.bloqueados}` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${tabActivo === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setTabActivo(tab.id);
                  setPaginaActual(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-aux">
            {usuariosFiltrados.length} cuentas coinciden con la vista actual
          </span>
        </div>

        <div className="adm-filters-grid">
          <div>
            <label className="form-label">Buscar estudiante</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nombre, apellido o correo @aloe.ulima.edu.pe..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <div>
            <label className="form-label">Carrera</label>
            <select
              className="form-select"
              value={filtroCarrera}
              onChange={(e) => {
                setFiltroCarrera(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="Todas">Todas las carreras</option>
              {CARRERAS_ULIMA.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Reputación</label>
            <select
              className="form-select"
              value={filtroReputacion}
              onChange={(e) => {
                setFiltroReputacion(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="Todas">Cualquier reputación</option>
              <option value="Alta">4.5 ★ o más</option>
              <option value="Baja">Menor a 4.0 ★</option>
              <option value="Sin calificaciones">Sin calificaciones</option>
            </select>
          </div>

          {(busqueda ||
            filtroCarrera !== 'Todas' ||
            filtroReputacion !== 'Todas' ||
            tabActivo !== 'Todos') && (
            <button
              type="button"
              className="btn btn-tertiary btn-sm"
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla de usuarios */}
      {usuariosPaginados.length === 0 ? (
        <EstadoVacio
          icono="👤"
          titulo="No se encontraron cuentas"
          descripcion="Ningún estudiante coincide con los filtros de búsqueda seleccionados."
          textoBoton="Restablecer filtros"
          onAccion={limpiarFiltros}
        />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ESTUDIANTE</th>
                <th>CARRERA / CICLO</th>
                <th>REPUTACIÓN</th>
                <th>ACTIVIDAD</th>
                <th>REPORTES</th>
                <th>ESTADO</th>
                <th className="adm-th-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((u) => {
                const bloqueado = esUsuarioBloqueado(u);
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="flex-row gap-12">
                        <div className="avatar-circle">
                          {obtenerIniciales(u.nombres, u.apellidos)}
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
                      <div className="adm-motivo-text">{u.carrera}</div>
                      <div className="text-aux">{u.ciclo} ciclo</div>
                    </td>
                    <td>
                      {u.totalCalificaciones > 0 ? (
                        <div>
                          <span className="adm-star-gold">★</span>{' '}
                          <strong>{u.reputacion.toFixed(1)}</strong>{' '}
                          <span className="text-aux">({u.totalCalificaciones})</span>
                        </div>
                      ) : (
                        <span className="text-aux">Sin calificaciones</span>
                      )}
                    </td>
                    <td>
                      <div>{u.avisosPublicadosCount || 0} avisos</div>
                      <div className="text-aux">{u.acuerdosCerrados || 0} acuerdos</div>
                    </td>
                    <td>
                      {u.reportesAcumulados > 0 ? (
                        <span
                          className={`adm-reports-count ${
                            u.reportesAcumulados >= 2
                              ? 'adm-reports-count--high'
                              : ''
                          }`}
                        >
                          {u.reportesAcumulados}{' '}
                          {u.reportesAcumulados === 1 ? 'reporte' : 'reportes'}
                        </span>
                      ) : (
                        <span className="text-aux">0 reportes</span>
                      )}
                    </td>
                    <td>
                      <BadgeEstado estado={u.estadoCuenta} />
                      {bloqueado && u.motivoBloqueo && (
                        <div className="text-aux adm-block-reason-hint">
                          {u.motivoBloqueo}
                        </div>
                      )}
                    </td>
                    <td className="adm-td-right">
                      <div className="adm-actions-end">
                        <button
                          type="button"
                          className="btn btn-tertiary btn-sm"
                          onClick={() => navigate(`/vendedor/${u.id}`)}
                        >
                          Perfil
                        </button>
                        {bloqueado ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDesbloquear(u)}
                          >
                            Desbloquear
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-destructive btn-sm"
                            onClick={() => setUsuarioParaBloquear(u)}
                          >
                            Bloquear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="adm-pagination-bar">
            <span className="text-aux">
              Mostrando {(paginaSegura - 1) * POR_PAGINA + 1}–
              {Math.min(paginaSegura * POR_PAGINA, usuariosFiltrados.length)} de{' '}
              {usuariosFiltrados.length} cuentas detalladas (248 registradas en el ciclo)
            </span>
            <div className="flex-row gap-8">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={paginaSegura <= 1}
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, idx) => idx + 1).map((num) => (
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
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={paginaSegura >= totalPaginas}
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de bloqueo de cuenta */}
      <ModalBloquearCuenta
        abierto={Boolean(usuarioParaBloquear)}
        onClose={() => setUsuarioParaBloquear(null)}
        usuario={usuarioParaBloquear}
        onConfirmar={handleConfirmarBloqueo}
      />
    </div>
  );
}
