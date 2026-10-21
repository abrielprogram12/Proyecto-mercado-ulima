import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useOferta } from '../../../context/OfertaContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import {
  PESTAÑAS_ESTADO_OFERTA,
  calcularConteosOfertas,
  filtrarOfertasPorEstado
} from './ofertasUtils';
import './ofertas.css';

export default function OfertasEnviadasPage() {
  const { usuarioActual } = useAuth();
  const { ofertas, retirarOferta } = useOferta();
  const navigate = useNavigate();

  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [notificacion, setNotificacion] = useState({
    tipo: 'exito',
    mensaje:
      'Éxito. Tu oferta de S/ 72.00 se envió. Te avisaremos cuando el vendedor responda.'
  });

  // Para probar con datos ricos, si Rosa Quispe no tiene enviadas usamos las de Diego Vargas o las propias
  const usuarioId = usuarioActual?.id || 'u-2';

  const enviadas = useMemo(() => {
    const propias = ofertas.filter((o) => o.compradorId === usuarioId);
    if (propias.length > 0) return propias;
    return ofertas.filter((o) => o.compradorId === 'u-2');
  }, [ofertas, usuarioId]);

  const recibidasCount = useMemo(() => {
    return ofertas.filter((o) => o.vendedorId === usuarioId).length;
  }, [ofertas, usuarioId]);

  const conteos = useMemo(() => {
    return calcularConteosOfertas(enviadas);
  }, [enviadas]);

  const enviadasFiltradas = useMemo(() => {
    return filtrarOfertasPorEstado(enviadas, filtroEstado);
  }, [enviadas, filtroEstado]);

  const handleRetirar = (id) => {
    const res = retirarOferta(id);
    if (res.ok) {
      setNotificacion({
        tipo: 'advertencia',
        mensaje: res.mensaje
      });
    } else {
      setNotificacion({
        tipo: 'error',
        mensaje: res.error
      });
    }
  };

  return (
    <div className="page-container">
      <h1 className="title-screen of-page-title">Ofertas</h1>

      {/* Pestañas superiores Recibidas / Enviadas — Vista 4.2 */}
      <div className="of-tabs-nav">
        <Link to="/ofertas" className="of-tab-link">
          Recibidas · {recibidasCount}
        </Link>
        <Link
          to="/ofertas-enviadas"
          className="of-tab-link of-tab-link--active"
        >
          Enviadas · {enviadas.length}
        </Link>
      </div>

      {/* Filtros por estado */}
      <div className="of-filters-chips of-filters-chips--spaced">
        {PESTAÑAS_ESTADO_OFERTA.map((tab) => (
          <button
            key={tab.clave}
            type="button"
            className={`chip chip-selectable ${
              filtroEstado === tab.clave ? 'active' : ''
            }`}
            onClick={() => setFiltroEstado(tab.clave)}
          >
            {tab.etiqueta} · {conteos[tab.clave]}
          </button>
        ))}
      </div>

      {/* Estado vacío (Vista 4.3) o Listado de ofertas enviadas (Vista 4.2) */}
      {enviadasFiltradas.length === 0 ? (
        <EstadoVacio
          icono="🏷️"
          titulo="No has enviado ofertas"
          descripcion="Cuando encuentres algo que te sirva, envía tu monto y el vendedor podrá aceptarlo, rechazarlo o proponerte otro precio."
          textoBoton="Explorar catálogo"
          rutaBoton="/catalogo"
        />
      ) : (
        <div className="of-sent-list">
          {enviadasFiltradas.map((of) => {
            const esContraoferta = of.estado === 'Contraofertada';
            return (
              <div
                key={of.id}
                className={`card-surface of-sent-card ${
                  esContraoferta ? 'of-sent-card--counter' : ''
                }`}
              >
                <div className="of-sent-left">
                  <div className="striped-placeholder of-sent-thumb" />
                  <div>
                    <Link
                      to={`/aviso/${of.avisoId}`}
                      className="of-group-aviso-link"
                    >
                      {of.avisoTitulo}
                    </Link>
                    <div className="text-aux">
                      Vendedor: {of.vendedorNombre} ·{' '}
                      {of.vendedorReputacion || 4.5} ★ · {of.mensaje}
                    </div>
                  </div>
                </div>

                <div className="of-sent-right">
                  <div className="of-sent-price-box">
                    <span className="price-text of-sent-price-main">
                      {formatearPrecio(of.monto)}
                    </span>
                    <span className="text-aux of-sent-price-sub">
                      {esContraoferta && of.montoContraoferta
                        ? `contraoferta ${formatearPrecio(of.montoContraoferta)}`
                        : `precio pedido ${formatearPrecio(of.precioPedido)}`}
                    </span>
                  </div>

                  <BadgeEstado estado={of.estado} />

                  <div className="of-sent-actions">
                    {of.estado === 'Enviada' && (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => navigate(`/ofertas/${of.id}/hilo`)}
                        >
                          Ver hilo
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm of-btn-danger-text"
                          onClick={() => handleRetirar(of.id)}
                        >
                          Retirar
                        </button>
                      </>
                    )}

                    {of.estado === 'Contraofertada' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/ofertas/${of.id}/hilo`)}
                      >
                        Responder
                      </button>
                    )}

                    {of.estado === 'Aceptada' && (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          navigate(`/acuerdos/${of.acuerdoId || 'A-2109'}`)
                        }
                      >
                        Ir al acuerdo
                      </button>
                    )}

                    {of.estado === 'Rechazada' && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/ofertas/${of.id}/hilo`)}
                      >
                        Ver hilo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie informativo y notificaciones (Vista 4.2) */}
      <div className="of-footer-grid">
        <div className="of-rules-banner">
          <strong>Reglas de la negociación.</strong> Una sola oferta activa por
          aviso. Solo puedes retirar tu oferta mientras el vendedor no haya
          respondido. Toda oferta sin respuesta vence a los 7 días.
        </div>

        <div>
          {notificacion && (
            <Notificacion
              tipo={notificacion.tipo}
              mensaje={notificacion.mensaje}
              onClose={() => setNotificacion(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
