import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReporte } from '../../../context/ReporteContext';
import {
  OPCIONES_PERIODO_METRICAS,
  obtenerClaseAnchoPorcentaje,
  obtenerClaseColorOferta
} from '../adminUtils';
import '../admin.css';

export default function TableroMetricasPage() {
  const navigate = useNavigate();
  const { obtenerMetricasPorPeriodo } = useReporte();

  const [periodo, setPeriodo] = useState('30dias');
  const datos = obtenerMetricasPorPeriodo(periodo);

  const radio = 56;
  const circunferencia = 2 * Math.PI * radio;
  let acumulado = 0;

  return (
    <div className="page-container">
      <div className="adm-header-row">
        <div>
          <h1 className="title-screen">Tablero de métricas</h1>
          <p className="text-aux adm-header-subtitle">
            Actividad del tablón en {datos.etiqueta.toLowerCase()} (05/08/2026 – 04/09/2026).
          </p>
        </div>

        <div className="adm-period-switcher">
          {OPCIONES_PERIODO_METRICAS.map((op) => (
            <button
              key={op.id}
              type="button"
              className={`btn btn-sm ${
                periodo === op.id ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={() => setPeriodo(op.id)}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-kpi-grid">
        {datos.kpis.map((kpi, idx) => {
          const esTendenciaNeutral = idx === 2 || idx === 3;
          return (
            <div
              key={kpi.etiqueta}
              className={`adm-kpi-card ${
                kpi.alerta ? 'adm-kpi-card--alert' : ''
              }`}
              onClick={() => {
                if (kpi.alerta) navigate('/admin/reportes');
              }}
            >
              <span className="label-upper">{kpi.etiqueta}</span>
              <div
                className={`adm-kpi-value ${
                  kpi.alerta ? 'adm-kpi-value--alert' : ''
                }`}
              >
                {kpi.valor}
              </div>
              <div
                className={`adm-kpi-trend ${
                  kpi.alerta
                    ? 'adm-kpi-trend--alert'
                    : esTendenciaNeutral
                    ? 'adm-kpi-trend--neutral'
                    : ''
                }`}
              >
                {kpi.tendencia}
              </div>
            </div>
          );
        })}
      </div>

      <div className="adm-charts-row">
        <div className="card-surface adm-chart-card">
          <h2 className="adm-chart-title">Avisos por categoría</h2>

          <div className="adm-cat-bars-list">
            {datos.categorias.map((cat) => (
              <div key={cat.nombre} className="adm-cat-bar-item">
                <span>{cat.nombre}</span>
                <div className="adm-cat-bar-track">
                  <div
                    className={`adm-cat-bar-fill ${obtenerClaseAnchoPorcentaje(
                      cat.porcentaje
                    )}`}
                  />
                </div>
                <span className="adm-cat-count">{cat.cantidad}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface adm-chart-card">
          <h2 className="adm-chart-title">Ofertas por estado</h2>

          <div className="adm-donut-layout">
            <div className="adm-donut-wrap">
              <svg
                viewBox="0 0 156 156"
                className="adm-donut-svg"
                aria-label="Distribución de ofertas por estado"
              >
                <circle
                  cx="78"
                  cy="78"
                  r={radio}
                  fill="none"
                  stroke="#EFE8DC"
                  strokeWidth="22"
                />
                {datos.ofertasDesglose.map((seg) => {
                  const longitud = (seg.porcentaje / 100) * circunferencia;
                  const dashArray = `${longitud} ${circunferencia - longitud}`;
                  const dashOffset = -acumulado;
                  acumulado += longitud;
                  return (
                    <circle
                      key={seg.estado}
                      cx="78"
                      cy="78"
                      r={radio}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="22"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                    />
                  );
                })}
              </svg>
              <div className="adm-donut-center">
                <strong className="adm-donut-total">{datos.ofertasTotal}</strong>
                <span className="text-aux">ofertas</span>
              </div>
            </div>

            <div className="adm-donut-legend">
              {datos.ofertasDesglose.map((item) => (
                <div key={item.estado} className="adm-donut-legend-row">
                  <div className="adm-donut-legend-left">
                    <span
                      className={`adm-offer-dot ${obtenerClaseColorOferta(
                        item.estado
                      )}`}
                    />
                    <span>{item.estado}</span>
                  </div>
                  <strong className="text-mono">
                    {item.cantidad} ({item.porcentaje} %)
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card-surface adm-chart-card">
        <h2 className="adm-chart-title">Puntos de encuentro más usados</h2>

        <div className="adm-spots-grid">
          {datos.puntosEncuentro.map((pt) => (
            <div key={pt.nombre} className="adm-spot-card">
              <div className="adm-spot-card-title">
                {pt.puesto}. {pt.nombre}
              </div>
              <div className="adm-spot-card-value">{pt.acuerdos}</div>
              <div className="text-aux">{pt.porcentaje} % de los acuerdos</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
