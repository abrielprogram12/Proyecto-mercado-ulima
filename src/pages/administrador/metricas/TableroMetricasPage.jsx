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

  return (
    <div className="container">
      {/* Encabezado y selector de periodo */}
      <div className="adm-header-row adm-header-row--lg-gap">
        <div>
          <span className="label-upper">INDICADORES DE PLATAFORMA · HU-7</span>
          <h1 className="mt-4">Tablero de métricas</h1>
          <p className="text-aux">
            Resumen operativo de publicaciones, negociaciones, entregas en campus y moderación ({datos.etiqueta}).
          </p>
        </div>

        <div className="adm-period-switcher">
          {OPCIONES_PERIODO_METRICAS.map((op) => (
            <button
              key={op.id}
              type="button"
              className={`btn btn-sm ${
                periodo === op.id ? 'btn-primary' : 'btn-tertiary'
              }`}
              onClick={() => setPeriodo(op.id)}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fila de 5 KPIs principales */}
      <div className="adm-kpi-grid">
        {datos.kpis.map((kpi) => (
          <div
            key={kpi.etiqueta}
            className={`card adm-kpi-card ${
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
              className={`text-aux adm-kpi-trend ${
                kpi.alerta ? 'adm-kpi-trend--alert' : ''
              }`}
            >
              {kpi.tendencia}
            </div>
          </div>
        ))}
      </div>

      {/* Cuadrícula 2x2 de bloques analíticos */}
      <div className="adm-analytics-grid">
        {/* Bloque 1: Avisos por categoría */}
        <div className="card">
          <div className="flex-between mb-16">
            <div>
              <span className="label-upper">CATÁLOGO ACADÉMICO</span>
              <h3 className="mt-4">Avisos por categoría</h3>
            </div>
            <span className="text-aux">{datos.etiqueta}</span>
          </div>

          <div className="flex-col gap-12">
            {datos.categorias.map((cat) => (
              <div key={cat.nombre}>
                <div className="adm-cat-row-top">
                  <span className="adm-motivo-text">{cat.nombre}</span>
                  <span className="text-mono adm-code-bold">
                    {cat.cantidad}
                  </span>
                </div>
                <div className="adm-cat-bar-track">
                  <div
                    className={`adm-cat-bar-fill ${obtenerClaseAnchoPorcentaje(
                      cat.porcentaje
                    )}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 2: Puntos de encuentro más usados */}
        <div className="card">
          <div className="flex-between mb-16">
            <div>
              <span className="label-upper">ENTREGAS EN EL CAMPUS</span>
              <h3 className="mt-4">Puntos de encuentro preferidos</h3>
            </div>
            <span className="text-aux">Top 5 ubicaciones</span>
          </div>

          <div className="flex-col gap-12">
            {datos.puntosEncuentro.map((pt) => (
              <div key={pt.nombre} className="adm-spot-row">
                <div className="flex-row gap-12">
                  <span
                    className={`text-mono adm-spot-rank ${
                      pt.puesto === 1 ? 'adm-spot-rank--top' : ''
                    }`}
                  >
                    #{pt.puesto}
                  </span>
                  <div>
                    <div className="adm-user-name-bold">{pt.nombre}</div>
                    <div className="text-aux">{pt.porcentaje} % de las entregas</div>
                  </div>
                </div>
                <div className="text-mono adm-code-bold">
                  {pt.acuerdos} acuerdos
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 3: Ofertas por estado */}
        <div className="card">
          <div className="flex-between mb-16">
            <div>
              <span className="label-upper">DINÁMICA DE NEGOCIACIÓN</span>
              <h3 className="mt-4">Ofertas por estado</h3>
            </div>
            <span className="text-mono adm-code-bold">
              {datos.ofertasTotal} ofertas totales
            </span>
          </div>

          {/* Barra segmentada proporcional */}
          <div className="adm-segmented-bar">
            {datos.ofertasDesglose.map((seg) => (
              <div
                key={seg.estado}
                className={`${obtenerClaseAnchoPorcentaje(
                  seg.porcentaje
                )} ${obtenerClaseColorOferta(seg.estado)}`}
                title={`${seg.estado}: ${seg.cantidad} (${seg.porcentaje} %)`}
              />
            ))}
          </div>

          <div className="adm-offers-breakdown-grid">
            {datos.ofertasDesglose.map((item) => (
              <div key={item.estado} className="adm-offer-stat-box">
                <div className="flex-row gap-8">
                  <span
                    className={`adm-offer-dot ${obtenerClaseColorOferta(
                      item.estado
                    )}`}
                  />
                  <span className="adm-user-name-bold">{item.estado}</span>
                </div>
                <div className="text-mono adm-offer-stat-val">
                  <strong>{item.cantidad}</strong>{' '}
                  <span className="text-aux">({item.porcentaje} %)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 4: Resumen de moderación */}
        <div className="card">
          <div className="flex-between mb-16">
            <div>
              <span className="label-upper">SEGURIDAD Y CONVIVENCIA</span>
              <h3 className="mt-4">Resumen de moderación</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/admin/reportes')}
            >
              Ir a bandeja →
            </button>
          </div>

          <div className="flex-col gap-8">
            {datos.moderacion.map((fila) => (
              <div key={fila.etiqueta} className="adm-mod-row">
                <span className="adm-mod-label">{fila.etiqueta}</span>
                <span className="text-mono adm-code-bold">{fila.valor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
