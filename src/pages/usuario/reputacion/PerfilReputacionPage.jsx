import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCalificacion } from '../../../context/CalificacionContext';
import { useReporte } from '../../../context/ReporteContext';
import { obtenerIniciales } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Estrellas from '../../../components/Estrellas/Estrellas';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalReporte from '../../../components/Modales/ModalReporte';
import {
  DISTRIBUCION_ESTRELLAS,
  FILTROS_PUNTAJE_REPUTACION,
  filtrarCalificacionesPorPuntaje,
  obtenerInicialesDeNombre
} from './reputacionUtils';
import './reputacion.css';

export default function PerfilReputacionPage() {
  const { id } = useParams();
  const { obtenerUsuarioPorId, usuarioActual } = useAuth();
  const { calificaciones, esVendedorConfiable } = useCalificacion();
  const { crearReporte } = useReporte();

  const [filtroPuntaje, setFiltroPuntaje] = useState('Todos');
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const usuario =
    obtenerUsuarioPorId(id || 'u-1') || obtenerUsuarioPorId('u-1');

  const recibidas = useMemo(() => {
    return calificaciones.filter(
      (c) => c.receptorId === (usuario?.id || 'u-1')
    );
  }, [calificaciones, usuario]);

  const comentariosFiltrados = useMemo(() => {
    return filtrarCalificacionesPorPuntaje(recibidas, filtroPuntaje);
  }, [recibidas, filtroPuntaje]);

  const confiable = esVendedorConfiable(
    usuario?.acuerdosCerrados || 12,
    usuario?.reputacion || 4.8
  );

  const handleEnviarReporte = ({ motivo, descripcion }) => {
    const res = crearReporte({
      tipo: 'Usuario',
      elementoId: usuario.id,
      elementoTitulo: `${usuario.nombres} ${usuario.apellidos}`,
      elementoSubtitulo: 'Perfil público con reputación',
      usuarioReportadoId: usuario.id,
      usuarioReportadoNombre: `${usuario.nombres} ${usuario.apellidos}`,
      motivo,
      descripcion,
      reportante: usuarioActual
    });

    if (res.ok) {
      setModalReporteAbierto(false);
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  return (
    <div className="page-container">
      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Cabecera — Vista 6.2 */}
      <div className="card-surface rep-profile-hero">
        <div className="rep-profile-hero-left">
          <div className="striped-placeholder rep-profile-avatar">
            {usuario?.fotoPerfil ? (
              <img
                src={usuario.fotoPerfil}
                alt={`${usuario.nombres} ${usuario.apellidos}`}
                className="media-img-cover"
              />
            ) : (
              obtenerIniciales(usuario?.nombres, usuario?.apellidos)
            )}
          </div>
          <div>
            <div className="rep-profile-name-row">
              <h1 className="title-screen">
                {usuario?.nombres} {usuario?.apellidos}
              </h1>
              {confiable && <BadgeEstado estado="Vendedora confiable" />}
            </div>
            <p className="text-aux">
              {usuario?.carrera} · {(usuario?.ciclo || 'Cuarto').toLowerCase()}{' '}
              ciclo · {usuario?.antiguedadTexto}
            </p>
          </div>
        </div>

        {usuarioActual?.id !== usuario?.id && (
          <button
            type="button"
            className="btn btn-tertiary btn-sm rep-btn-danger-text"
            onClick={() => setModalReporteAbierto(true)}
          >
            Reportar usuario
          </button>
        )}
      </div>

      {/* Grilla de 2 columnas — Vista 6.2 */}
      <div className="rep-profile-grid">
        {/* Panel izquierdo: Distribución de estrellas y distintivo de confiable */}
        <div className="card-surface rep-stats-card">
          <div className="rep-score-header">
            <strong className="rep-score-big">
              {usuario?.reputacion || 4.8}
            </strong>
            <div>
              <Estrellas valor={5} tamano="md" />
              <span className="text-aux rep-score-count">
                {usuario?.totalCalificaciones || recibidas.length || 11} calificaciones recibidas
              </span>
            </div>
          </div>

          {/* Barras de distribución 5★ a 1★ */}
          <div className="rep-bars-list">
            {DISTRIBUCION_ESTRELLAS.map((fila) => (
              <div key={fila.estrellas} className="rep-bar-row">
                <span className="rep-bar-label">{fila.estrellas} ★</span>
                <div className="rep-bar-track">
                  <div className={`rep-bar-fill ${fila.fillClass}`} />
                </div>
                <span className="text-aux rep-bar-count">{fila.count}</span>
              </div>
            ))}
          </div>

          <div className="rep-metrics-two-col">
            <div>
              <strong className="rep-metric-number">
                {usuario?.acuerdosCerrados || 12}
              </strong>
              <span className="text-aux">acuerdos cerrados</span>
            </div>
            <div>
              <strong className="rep-metric-number">
                {usuario?.entregasConfirmadasPct || 100} %
              </strong>
              <span className="text-aux">entregas confirmadas</span>
            </div>
          </div>

          <div className="rep-trust-callout">
            <strong className="rep-trust-title">Vendedora confiable:</strong>{' '}
            más de 10 acuerdos cerrados con un promedio mayor o igual a 4.5.
          </div>

          <div className="rep-info-callout">
            La reputación se calcula solo con acuerdos entregados y confirmados
            por ambas partes.
          </div>
        </div>

        {/* Panel derecho: Comentarios recibidos filtrables */}
        <div className="card-surface rep-reviews-card">
          <div className="rep-reviews-header">
            <h2 className="title-section rep-reviews-title">
              Comentarios recibidos
            </h2>

            <div className="rep-reviews-filters">
              <span className="text-aux">Filtrar por puntaje</span>
              {FILTROS_PUNTAJE_REPUTACION.map((f) => (
                <button
                  key={f.clave}
                  type="button"
                  className={`chip chip-selectable ${
                    filtroPuntaje === f.clave ? 'active' : ''
                  }`}
                  onClick={() => setFiltroPuntaje(f.clave)}
                >
                  {f.etiqueta}
                </button>
              ))}
            </div>
          </div>

          <div className="rep-reviews-list">
            {comentariosFiltrados.map((cal) => {
              const ini = obtenerInicialesDeNombre(cal.emisorNombre);
              return (
                <div key={cal.id} className="rep-review-item">
                  <div className="rep-review-top">
                    <div className="rep-review-author">
                      <div className="rep-review-avatar">{ini}</div>
                      <div>
                        <strong className="rep-review-author-name">
                          {cal.emisorNombre}
                        </strong>
                        <span className="text-aux">
                          {cal.emisorCarrera} ·{' '}
                          {cal.rolReceptorEnAcuerdo || 'compradora'} · acuerdo{' '}
                          {cal.acuerdoId}
                        </span>
                      </div>
                    </div>

                    <div className="rep-review-right">
                      <Estrellas valor={cal.puntaje} tamano="sm" />
                      <span className="text-aux rep-review-date">
                        {cal.fecha}
                      </span>
                    </div>
                  </div>

                  <p className="rep-review-text">{cal.comentario}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModalReporte
        abierto={modalReporteAbierto}
        onClose={() => setModalReporteAbierto(false)}
        tituloElemento={`${usuario?.nombres} ${usuario?.apellidos}`}
        subtituloElemento={`${usuario?.correo} · ${usuario?.carrera}`}
        onEnviarReporte={handleEnviarReporte}
      />
    </div>
  );
}
