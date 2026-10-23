import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { useOferta } from '../../../context/OfertaContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../../data/imagenesDatos';
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
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { obtenerAvisoPorId } = useAviso();
  const {
    obtenerOfertaPorId,
    ofertas,
    aceptarOferta,
    rechazarOferta,
    enviarContraoferta,
    retirarOferta
  } = useOferta();
  const { crearAcuerdoDesdeOferta } = useAcuerdo();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const oferta =
    obtenerOfertaPorId(id) ||
    ofertas.find((o) => o.id === 'of-302') ||
    ofertas[0];

  if (!oferta) return null;

  const esVendedor = usuarioActual?.id === oferta.vendedorId;
  const esComprador = usuarioActual?.id === oferta.compradorId;

  const movimientos = obtenerMovimientosHilo(oferta);
  const ultimoMovimiento = movimientos[movimientos.length - 1];
  const primeraOfertaMonto = movimientos[0]?.monto || oferta.monto;
  const ultimaCompradorMonto = oferta.monto;
  const contraofertaVigente = oferta.montoContraoferta || null;

  const avisoObj = obtenerAvisoPorId(oferta.avisoId) || {
    id: oferta.avisoId,
    titulo: oferta.avisoTitulo
  };
  const portadaAviso = obtenerPortadaAviso(avisoObj);

  const contraparteUsuario = obtenerUsuarioPorId(
    esVendedor ? oferta.compradorId : oferta.vendedorId
  );
  const contraparteNombre = esVendedor
    ? oferta.compradorNombre
    : oferta.vendedorNombre;
  const inicialesContraparte = obtenerInicialesComprador(contraparteNombre);
  const inicialesVendedor = obtenerInicialesComprador(oferta.vendedorNombre);
  const inicialesComprador = obtenerInicialesComprador(oferta.compradorNombre);

  const handleAceptarComoVendedor = () => {
    if (!esVendedor) return;

    const otrasRechazadas = ofertas.filter(
      (o) =>
        o.id !== oferta.id &&
        o.avisoId === oferta.avisoId &&
        (o.estado === 'Enviada' || o.estado === 'Contraofertada')
    ).length;

    const ofertaConMontoFinal = { ...oferta, monto: ultimaCompradorMonto };
    const resAcuerdo = crearAcuerdoDesdeOferta(ofertaConMontoFinal, {
      otrasOfertasRechazadas: otrasRechazadas
    });
    const codigoAcuerdo = resAcuerdo.ok
      ? resAcuerdo.acuerdo.id
      : oferta.acuerdoId || 'A-2314';

    const res = aceptarOferta(oferta.id, codigoAcuerdo, ultimaCompradorMonto);
    if (res.ok) {
      navigate(`/acuerdo-generado/${res.acuerdoId}`);
    }
  };

  const handleAceptarContraofertaComoComprador = () => {
    if (!esComprador || !contraofertaVigente) return;

    const otrasRechazadas = ofertas.filter(
      (o) =>
        o.id !== oferta.id &&
        o.avisoId === oferta.avisoId &&
        (o.estado === 'Enviada' || o.estado === 'Contraofertada')
    ).length;

    const ofertaConContraoferta = { ...oferta, monto: contraofertaVigente };
    const resAcuerdo = crearAcuerdoDesdeOferta(ofertaConContraoferta, {
      otrasOfertasRechazadas: otrasRechazadas
    });
    const codigoAcuerdo = resAcuerdo.ok
      ? resAcuerdo.acuerdo.id
      : oferta.acuerdoId || 'A-2314';

    const res = aceptarOferta(oferta.id, codigoAcuerdo, contraofertaVigente);
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

  const handleRetirarComoComprador = () => {
    const res = retirarOferta(oferta.id);
    if (res.ok) {
      navigate('/ofertas-enviadas');
    } else {
      setNotificacion({
        tipo: 'error',
        mensaje: res.error
      });
    }
  };

  const handleEnviarPropuestaModal = ({ monto, mensaje }) => {
    const nombreCorto = usuarioActual
      ? `${usuarioActual.nombres.split(' ')[0]} ${usuarioActual.apellidos.split(' ')[0]}`
      : esVendedor
      ? oferta.vendedorNombre
      : oferta.compradorNombre;

    const res = enviarContraoferta(oferta.id, {
      monto,
      mensaje,
      autorNombre: nombreCorto,
      rolAutor: esVendedor ? 'vendedor' : 'comprador'
    });
    setModalAbierto(false);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  const obtenerTextoEstadoHilo = () => {
    if (oferta.estado === 'Contraofertada') {
      const ultimoFueVendedor = ultimoMovimiento?.rolAutor === 'vendedor';
      if (ultimoFueVendedor) {
        return esComprador
          ? 'Contraoferta recibida — tu turno de responder'
          : 'Contraofertada — esperando al comprador';
      }
      return esVendedor
        ? 'Nueva propuesta del comprador — tu turno'
        : 'Propuesta enviada — esperando al vendedor';
    }
    if (oferta.estado === 'Enviada') {
      return esVendedor
        ? 'Oferta recibida — esperando tu respuesta'
        : 'Oferta enviada — esperando al vendedor';
    }
    return oferta.estado;
  };

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to={esComprador ? '/ofertas-enviadas' : '/ofertas'}>
          {esComprador ? 'Ofertas enviadas' : 'Ofertas recibidas'}
        </Link>
        <span>›</span>
        <Link to={`/aviso/${oferta.avisoId}`}>{oferta.avisoTitulo}</Link>
        <span>›</span>
        <span>{contraparteNombre}</span>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="of-thread-layout">
        <div className="card-surface of-thread-main-card">
          <div className="of-thread-header">
            <div>
              <h1 className="title-screen of-thread-title">
                Negociación con {contraparteNombre}
              </h1>
              <span className="text-aux">
                Iniciada el {oferta.fecha} · {movimientos.length}{' '}
                {movimientos.length === 1 ? 'movimiento' : 'movimientos'}
              </span>
            </div>

            <BadgeEstado estado={obtenerTextoEstadoHilo()} />
          </div>

          <div className="of-timeline-list">
            {movimientos.map((mov, index) => {
              const movDeVendedor = mov.rolAutor === 'vendedor';
              const esMio =
                (esVendedor && movDeVendedor) ||
                (esComprador && !movDeVendedor);
              const esUltimo = index === movimientos.length - 1;

              const bubbleClass = [
                'of-timeline-bubble',
                movDeVendedor
                  ? esUltimo
                    ? 'of-timeline-bubble--seller-latest'
                    : 'of-timeline-bubble--seller'
                  : '',
                esUltimo ? 'of-timeline-bubble--latest' : ''
              ]
                .filter(Boolean)
                .join(' ');

              const etiquetaAutor = esMio
                ? `Tú (${esVendedor ? 'vendedor/a' : 'comprador/a'})`
                : movDeVendedor
                ? oferta.vendedorNombre
                : oferta.compradorNombre;

              return (
                <div
                  key={mov.id || index}
                  className={`of-timeline-item ${
                    movDeVendedor ? 'of-timeline-item--seller' : ''
                  }`}
                >
                  <div
                    className={`of-timeline-avatar ${
                      movDeVendedor ? 'of-timeline-avatar--seller' : ''
                    }`}
                  >
                    {movDeVendedor ? inicialesVendedor : inicialesComprador}
                  </div>

                  <div className={bubbleClass}>
                    <div className="of-timeline-bubble-top">
                      <div className="of-timeline-author-row">
                        <strong>{etiquetaAutor}</strong>
                        <BadgeEstado
                          estado={mov.tipo}
                          variante={movDeVendedor ? 'warning' : 'info'}
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

          <div className="of-thread-actions-bar">
            {oferta.estado === 'Aceptada' ? (
              <>
                <span className="text-aux">
                  Trato cerrado. Se generó el acuerdo{' '}
                  <strong>{oferta.acuerdoId || 'A-2201'}</strong>.
                </span>
                <div className="of-thread-actions-btns">
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      navigate(`/acuerdos/${oferta.acuerdoId || 'A-2201'}`)
                    }
                  >
                    Ir al acuerdo
                  </button>
                </div>
              </>
            ) : oferta.estado === 'Rechazada' || oferta.estado === 'Vencida' ? (
              <span className="text-aux">
                Esta negociación está cerrada ({oferta.estado.toLowerCase()}).
              </span>
            ) : esVendedor ? (
              <>
                <span className="text-aux">
                  {oferta.estado === 'Contraofertada' &&
                  ultimoMovimiento?.rolAutor === 'vendedor'
                    ? `Tu contraoferta de ${formatearPrecio(
                        contraofertaVigente
                      )} está vigente. También puedes aceptar los ${formatearPrecio(
                        ultimaCompradorMonto
                      )} del comprador.`
                    : `Acciones disponibles como vendedor sobre la propuesta de ${formatearPrecio(
                        ultimaCompradorMonto
                      )}.`}
                </span>

                <div className="of-thread-actions-btns">
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={handleAceptarComoVendedor}
                  >
                    Aceptar {formatearPrecio(ultimaCompradorMonto)}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setModalAbierto(true)}
                  >
                    {oferta.estado === 'Contraofertada'
                      ? 'Nueva contraoferta'
                      : 'Contraofertar'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm of-btn-danger-text"
                    onClick={handleRechazar}
                  >
                    Rechazar
                  </button>
                </div>
              </>
            ) : esComprador ? (
              oferta.estado === 'Enviada' ? (
                <>
                  <span className="text-aux">
                    Enviaste una oferta de{' '}
                    <strong>{formatearPrecio(ultimaCompradorMonto)}</strong>.
                    Esperando respuesta del vendedor ({oferta.vendedorNombre}).
                  </span>
                  <div className="of-thread-actions-btns">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm of-btn-danger-text"
                      onClick={handleRetirarComoComprador}
                    >
                      Retirar oferta
                    </button>
                  </div>
                </>
              ) : ultimoMovimiento?.rolAutor === 'vendedor' &&
                contraofertaVigente ? (
                <>
                  <span className="text-aux">
                    El vendedor propone cerrar en{' '}
                    <strong>{formatearPrecio(contraofertaVigente)}</strong>.
                    Puedes aceptar su contraoferta o enviar otra propuesta.
                  </span>
                  <div className="of-thread-actions-btns">
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={handleAceptarContraofertaComoComprador}
                    >
                      Aceptar contraoferta (
                      {formatearPrecio(contraofertaVigente)})
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setModalAbierto(true)}
                    >
                      Enviar nueva propuesta
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm of-btn-danger-text"
                      onClick={handleRechazar}
                    >
                      Rechazar
                    </button>
                  </div>
                </>
              ) : (
                <span className="text-aux">
                  Enviaste una propuesta de{' '}
                  <strong>{formatearPrecio(ultimaCompradorMonto)}</strong>.
                  Esperando respuesta de {oferta.vendedorNombre}.
                </span>
              )
            ) : (
              <span className="text-aux">
                Solo el comprador y el vendedor de este aviso pueden intervenir
                en la negociación.
              </span>
            )}
          </div>
        </div>

        <div className="of-thread-side">
          <div className="card-surface of-side-card">
            <span className="label-upper of-side-label">
              Aviso en negociación
            </span>
            <div className="striped-placeholder of-side-aviso-banner">
              {portadaAviso ? (
                <img
                  src={portadaAviso}
                  alt={oferta.avisoTitulo}
                  className="media-img-cover"
                />
              ) : (
                <span>Sin fotografía</span>
              )}
            </div>
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
            <span className="label-upper of-side-label">
              {esVendedor ? 'Comprador interesado' : 'Vendedor del aviso'}
            </span>
            <div className="of-counterpart-row">
              <div className="of-counterpart-avatar">
                {contraparteUsuario?.fotoPerfil ? (
                  <img
                    src={contraparteUsuario.fotoPerfil}
                    alt={contraparteNombre}
                    className="media-img-cover"
                  />
                ) : (
                  inicialesContraparte
                )}
              </div>
              <div>
                <strong className="of-counterpart-name">
                  {contraparteNombre}
                </strong>
                <span className="text-aux">
                  {contraparteUsuario?.carrera ||
                    oferta.compradorCarrera ||
                    'Administración'}{' '}
                  ·{' '}
                  {contraparteUsuario?.reputacion ||
                    oferta.compradorReputacion ||
                    4.8}{' '}
                  ★ · {contraparteUsuario?.acuerdosCerrados || 5} acuerdos
                </span>
              </div>
            </div>
            <Link
              to={`/vendedor/${
                esVendedor ? oferta.compradorId : oferta.vendedorId
              }`}
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
            {contraofertaVigente && (
              <div className="of-summary-row--highlight">
                <span className="text-aux">
                  {esVendedor
                    ? 'Tu contraoferta vigente'
                    : 'Contraoferta del vendedor'}
                </span>
                <strong className="of-summary-counter-value">
                  {formatearPrecio(contraofertaVigente)}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalOferta
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        modo={esVendedor ? 'contraoferta' : 'propuesta-comprador'}
        ofertaRecibida={oferta}
        aviso={{
          id: oferta.avisoId,
          titulo: oferta.avisoTitulo,
          precio: oferta.precioPedido,
          montoMinimo: oferta.montoMinimo,
          aceptaOfertas: true
        }}
        onConfirmar={handleEnviarPropuestaModal}
      />
    </div>
  );
}
