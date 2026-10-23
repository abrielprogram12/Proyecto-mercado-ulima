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
    <div className="page-container">
      <div className="adm-header-row">
        <div>
          <h1 className="title-screen">Bandeja de reportes</h1>
          <p className="text-aux adm-header-subtitle">
            Reportes enviados por la comunidad sobre avisos y usuarios.
          </p>
        </div>

        <div className="adm-controls-inline">
          <input
            type="text"
            className="form-input adm-search-inline"
            placeholder="Buscar por código, aviso o usuario…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            className="form-select adm-select-inline"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">Tipo: Todos</option>
            <option value="Aviso">Tipo: Aviso</option>
            <option value="Usuario">Tipo: Usuario</option>
          </select>

          <select
            className="form-select adm-select-inline"
            value={rangoFechas}
            onChange={(e) => setRangoFechas(e.target.value)}
          >
            <option value="Últimos 30 días">Fecha: Últimos 30 días</option>
            <option value="Últimos 7 días">Fecha: Últimos 7 días</option>
            <option value="Todo el periodo">Fecha: Todo el periodo</option>
          </select>
        </div>
      </div>

      <div className="adm-tabs-bar">
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
            className={`adm-tab-btn ${
              tabEstado === tab.id ? 'adm-tab-btn--active' : ''
            }`}
            onClick={() => setTabEstado(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {reportesFiltrados.length === 0 ? (
        <EstadoVacio
          icono="✓"
          titulo="No hay reportes en este estado"
          descripcion="No se encontraron reportes que coincidan con los filtros seleccionados."
          textoBoton="Ver todos los reportes"
          onAccion={limpiarFiltros}
        />
      ) : (
        <div className="card-surface adm-table-card">
          <table className="adm-data-table">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>TIPO</th>
                <th>ELEMENTO REPORTADO</th>
                <th>MOTIVO</th>
                <th>REPORTADO POR</th>
                <th>FECHA</th>
                <th>ESTADO</th>
                <th className="adm-th-right">ACCIONES</th>
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
                  <td>
                    <div className="adm-elemento-title">
                      {r.elementoTitulo}
                    </div>
                    <div className="text-aux">{r.elementoSubtitulo}</div>
                  </td>
                  <td>
                    <span className="adm-motivo-text">{r.motivo}</span>
                  </td>
                  <td>
                    <span className="adm-motivo-text">{r.reportanteNombre}</span>
                  </td>
                  <td>
                    <span className="adm-date-inline">
                      {r.fecha} · {r.hora}
                    </span>
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
