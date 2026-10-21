import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReporte } from '../../../context/ReporteContext';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import { filtrarReportesBandeja } from '../adminUtils';
import '../admin.css';

export default function BandejaReportesPage() {
  const navigate = useNavigate();
  const { reportes, iniciarRevision, obtenerConteosReportes } = useReporte();

  const [tabEstado, setTabEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [rangoFechas, setRangoFechas] = useState('Últimos 30 días');

  const conteos = obtenerConteosReportes();

  const reportesFiltrados = useMemo(() => {
    return filtrarReportesBandeja(reportes, {
      tabEstado,
      filtroTipo,
      busqueda
    });
  }, [reportes, tabEstado, filtroTipo, busqueda]);

  const handleAccionReporte = (reporte) => {
    if (reporte.estado === 'Nuevo') {
      iniciarRevision(reporte.id);
    }
    navigate(`/admin/reportes/${reporte.id}`);
  };

  const limpiarFiltros = () => {
    setTabEstado('Todos');
    setBusqueda('');
    setFiltroTipo('Todos');
    setRangoFechas('Últimos 30 días');
  };

  return (
    <div className="container">
      {/* Encabezado de página */}
      <div className="adm-header-row">
        <div>
          <span className="label-upper">MODERACIÓN DEL TABLÓN · HU-7</span>
          <h1 className="mt-4">Bandeja de reportes</h1>
          <p className="text-aux">
            Revisa y resuelve los reportes enviados por la comunidad sobre avisos y cuentas de usuario.
          </p>
        </div>
        <div className="flex-row gap-8">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/admin/usuarios')}
          >
            Gestión de usuarios
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/admin/metricas')}
          >
            Ver métricas
          </button>
        </div>
      </div>

      {/* Pestañas por estado + filtros */}
      <div className="card adm-filters-card">
        <div className="adm-tabs-top">
          <div className="tabs-bar adm-tabs-bar-clean">
            {[
              { id: 'Todos', label: `Todos · ${conteos.todos}` },
              { id: 'Nuevos', label: `Nuevos · ${conteos.nuevos}` },
              { id: 'En revisión', label: `En revisión · ${conteos.enRevision}` },
              { id: 'Resueltos', label: `Resueltos · ${conteos.resueltos}` },
              { id: 'Descartados', label: `Descartados · ${conteos.descartados}` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${tabEstado === tab.id ? 'active' : ''}`}
                onClick={() => setTabEstado(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-aux">
            Mostrando <strong>{reportesFiltrados.length}</strong> de {reportes.length} reportes
          </span>
        </div>

        {/* Controles de búsqueda y filtro */}
        <div className="adm-filters-grid">
          <div>
            <label className="form-label">Buscar reporte</label>
            <input
              type="text"
              className="form-input"
              placeholder="Código (R-1042), aviso, usuario reportado o motivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Tipo de elemento</label>
            <select
              className="form-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Aviso">Aviso</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>

          <div>
            <label className="form-label">Periodo</label>
            <select
              className="form-select"
              value={rangoFechas}
              onChange={(e) => setRangoFechas(e.target.value)}
            >
              <option value="Últimos 30 días">Últimos 30 días</option>
              <option value="Últimos 7 días">Últimos 7 días</option>
              <option value="Todo el periodo">Todo el periodo</option>
            </select>
          </div>

          {(busqueda || filtroTipo !== 'Todos' || tabEstado !== 'Todos') && (
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

      {/* Tabla de reportes */}
      {reportesFiltrados.length === 0 ? (
        <EstadoVacio
          icono="✓"
          titulo="No hay reportes en este estado"
          descripcion="No se encontraron reportes que coincidan con los filtros seleccionados."
          textoBoton="Ver todos los reportes"
          onAccion={limpiarFiltros}
        />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>TIPO</th>
                <th>ELEMENTO REPORTADO</th>
                <th>MOTIVO</th>
                <th>REPORTANTE</th>
                <th>FECHA</th>
                <th>ESTADO</th>
                <th className="adm-th-right">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className="text-mono adm-code-bold">{r.id}</span>
                  </td>
                  <td>
                    <span
                      className={`adm-type-pill ${
                        r.tipo !== 'Aviso' ? 'adm-type-pill--usuario' : ''
                      }`}
                    >
                      {r.tipo}
                    </span>
                  </td>
                  <td className="adm-col-elemento">
                    <div className="adm-elemento-title">
                      {r.elementoTitulo}
                    </div>
                    <div className="text-aux">{r.elementoSubtitulo}</div>
                  </td>
                  <td className="adm-col-motivo">
                    <span className="adm-motivo-text">{r.motivo}</span>
                  </td>
                  <td>
                    <div className="adm-motivo-text">{r.reportanteNombre}</div>
                    {r.reportanteCarrera && (
                      <div className="text-aux">
                        {r.reportanteCarrera}
                        {r.reportanteReputacion
                          ? ` · ${r.reportanteReputacion} ★`
                          : ''}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{r.fecha}</div>
                    <div className="text-aux">{r.hora} h</div>
                  </td>
                  <td>
                    <BadgeEstado estado={r.estado} />
                  </td>
                  <td className="adm-td-right">
                    {r.estado === 'Nuevo' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAccionReporte(r)}
                      >
                        Revisar
                      </button>
                    )}
                    {r.estado === 'En revisión' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleAccionReporte(r)}
                      >
                        Continuar
                      </button>
                    )}
                    {(r.estado === 'Resuelto' || r.estado === 'Descartado') && (
                      <button
                        type="button"
                        className="btn btn-tertiary btn-sm"
                        onClick={() => handleAccionReporte(r)}
                      >
                        Ver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
