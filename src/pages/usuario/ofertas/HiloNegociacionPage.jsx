import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useOferta } from '../../../context/OfertaContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalOferta from '../../../components/Modales/ModalOferta';
import {
  obtenerMovimientosHilo,
  obtenerInicialesComprador
} from './ofertasUtils';
import './ofertas.css';

export default function HiloNegociacionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    obtenerOfertaPorId,
    ofertas,
    aceptarOferta,
    rechazarOferta,
    enviarContraoferta
  } = useOferta();
  const { crearAcuerdoDesdeOferta } = useAcuerdo();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const oferta =
    obtenerOfertaPorId(id) ||
    ofertas.find((o) => o.id === 'of-302') ||
    ofertas[0];

  if (!oferta) return null;

  const movimientos = obtenerMovimientosHilo(oferta);
  const primeraOfertaMonto = movimientos[0]?.monto || oferta.monto;
  const ultimaCompradorMonto = oferta.monto;
  const contraofertaVigente = oferta.montoContraoferta || 84.0;

  const handleAceptar = () => {
    const otrasRechazadas = ofertas.filter(
      (o) =>
        o.id !== oferta.id &&
        o.avisoId === oferta.avisoId &&
        (o.estado === 'Enviada' || o.estado === 'Contraofertada')
    ).length;

    const resAcuerdo = crearAcuerdoDesdeOferta(oferta, {
      otrasOfertasRechazadas: otrasRechazadas
    });
    const codigoAcuerdo = resAcuerdo.ok
      ? resAcuerdo.acuerdo.id
      : oferta.acuerdoId || 'A-2314';

    const res = aceptarOferta(oferta.id, codigoAcuerdo);
    if (res.ok) {
      navigate(`/acuerdo-generado/${res.acuerdoId}`);
    }
  };

  const handleRechazar = () => {
    const res = rechazarOferta(oferta.id);
    if (res.ok) {
      setNotificacion({
        tipo: 'advertencia',
        mensaje: res.mensaje
      });
    }
  };

  const handleEnviarNuevaContraoferta = ({ monto, mensaje }) => {
    const res = enviarContraoferta(oferta.id, { monto, mensaje });
    setModalAbierto(false);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  const inicialesComprador = obtenerInicialesComprador(oferta.compradorNombre);

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/ofertas">Ofertas recibidas</Link>
        <span>›</span>
        <Link to={`/aviso/${oferta.avisoId}`}>{oferta.avisoTitulo}</Link>
        <span>›</span>
        <span>{oferta.compradorNombre}</span>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Grilla principal — Vista 4.4 */}
      <div className="of-thread-layout">
        {/* Columna izquierda: Línea de tiempo de propuestas y contraofertas */}
        <div className="card-surface of-thread-main-card">
          <div className="of-thread-header">
            <div>
              <h1 className="title-screen of-thread-title">
                Negociación con {oferta.compradorNombre}
              </h1>
              <span className="text-aux">
                Iniciada el 27/08/2026 · {movimientos.length} movimientos
              </span>
            </div>

            <BadgeEstado
              estado={
                oferta.estado === 'Contraofertada'
                  ? 'Contraofertada — esperando al comprador'
                  : oferta.estado
              }
            />
          </div>

          <div className="of-timeline-list">
            {movimientos.map((mov, index) => {
              const esVendedor = mov.rolAutor === 'vendedor';
              const esUltimo = index === movimientos.length - 1;

              const bubbleClass = [
                'of-timeline-bubble',
                esVendedor
                  ? esUltimo
                    ? 'of-timeline-bubble--seller-latest'
                    : 'of-timeline-bubble--seller'
                  : '',
                esUltimo ? 'of-timeline-bubble--latest' : ''
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={mov.id || index}
                  className={`of-timeline-item ${
                    esVendedor ? 'of-timeline-item--seller' : ''
                  }`}
                >
                  <div
                    className={`of-timeline-avatar ${
                      esVendedor ? 'of-timeline-avatar--seller' : ''
                    }`}
                  >
                    {esVendedor ? 'RQ' : inicialesComprador}
                  </div>

                  <div className={bubbleClass}>
                    <div className="of-timeline-bubble-top">
                      <div className="of-timeline-author-row">
                        <strong>{mov.autorNombre}</strong>
                        <BadgeEstado
                          estado={mov.tipo}
                          variante={esVendedor ? 'warning' : 'info'}
                        />
                      </div>
                      <span className="text-aux">{mov.fechaHora}</span>
                    </div>

                    <div className="of-timeline-amount-row">
                      <strong className="price-text of-timeline-price">
                        {formatearPrecio(mov.monto)}
                      </strong>{' '}
                      {mov.notaMonto && (
                        <span className="text-aux">{mov.notaMonto}</span>
                      )}
                    </div>

                    {mov.mensaje && (
                      <p className="of-timeline-msg">«{mov.mensaje}»</p>
                    )}

                    {esUltimo && oferta.fechaVencimiento && (
                      <span className="text-aux of-timeline-expiry">
                        La contraoferta vence el {oferta.fechaVencimiento}.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barra inferior de acciones */}
          <div className="of-thread-actions-bar">
            <span className="text-aux">
              Acciones disponibles como vendedora mientras la contraoferta esté
              vigente.
            </span>

            <div className="of-thread-actions-btns">
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleAceptar}
              >
                Aceptar {formatearPrecio(ultimaCompradorMonto)}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setModalAbierto(true)}
              >
                Nueva contraoferta
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm of-btn-danger-text"
                onClick={handleRechazar}
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha: Aviso en negociación + Contraparte + Resumen de montos */}
        <div className="of-thread-side">
          <div className="card-surface of-side-card">
            <span className="label-upper of-side-label">
              Aviso en negociación
            </span>
            <div className="striped-placeholder of-side-aviso-banner" />
            <strong className="of-side-aviso-title">
              {oferta.avisoTitulo}
            </strong>
            <div className="price-text of-side-aviso-price">
              {formatearPrecio(oferta.precioPedido)}
            </div>
            <span className="text-aux">
              Mínimo aceptado {formatearPrecio(oferta.montoMinimo)} · Publicado
            </span>
          </div>

          <div className="card-surface of-side-card">
            <span className="label-upper of-side-label">Contraparte</span>
            <div className="of-counterpart-row">
              <div className="of-counterpart-avatar">{inicialesComprador}</div>
              <div>
                <strong className="of-counterpart-name">
                  {oferta.compradorNombre}
                </strong>
                <span className="text-aux">
                  {oferta.compradorCarrera} ·{' '}
                  {oferta.compradorCiclo || 'sexto ciclo'} ·{' '}
                  {oferta.compradorReputacion} ★ ·{' '}
                  {oferta.compradorAcuerdos || 5} acuerdos
                </span>
              </div>
            </div>
            <Link
              to={`/vendedor/${oferta.compradorId}`}
              className="of-counterpart-link"
            >
              Ver perfil público
            </Link>
          </div>

          <div className="card-surface of-side-card">
            <span className="label-upper of-side-label--lg">
              Resumen de montos
            </span>

            <div className="of-summary-row">
              <span className="text-aux">Precio pedido</span>
              <strong className="price-text">
                {formatearPrecio(oferta.precioPedido)}
              </strong>
            </div>
            <div className="of-summary-row">
              <span className="text-aux">Primera oferta</span>
              <strong className="price-text">
                {formatearPrecio(primeraOfertaMonto)}
              </strong>
            </div>
            <div className="of-summary-row of-summary-row--divider">
              <span className="text-aux">Última del comprador</span>
              <strong className="price-text">
                {formatearPrecio(ultimaCompradorMonto)}
              </strong>
            </div>
            <div className="of-summary-row--highlight">
              <span className="text-aux">Tu contraoferta vigente</span>
              <strong className="of-summary-counter-value">
                {formatearPrecio(contraofertaVigente)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <ModalOferta
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        modo="contraoferta"
        ofertaRecibida={oferta}
        aviso={{
          titulo: oferta.avisoTitulo,
          precio: oferta.precioPedido,
          montoMinimo: oferta.montoMinimo
        }}
        onConfirmar={handleEnviarNuevaContraoferta}
      />
    </div>
  );
}
