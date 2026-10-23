import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { useOferta } from '../../../context/OfertaContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../../data/imagenesDatos';
import FilaOferta from '../../../components/FilaOferta/FilaOferta';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalOferta from '../../../components/Modales/ModalOferta';
import {
  PESTAÑAS_ESTADO_OFERTA,
  calcularConteosOfertas,
  filtrarOfertasPorEstado,
  agruparOfertasPorAviso
} from './ofertasUtils';
import './ofertas.css';

export default function OfertasRecibidasPage() {
  const { usuarioActual } = useAuth();
  const { obtenerAvisoPorId } = useAviso();
  const {
    ofertas,
    aceptarOferta,
    rechazarOferta,
    enviarContraoferta
  } = useOferta();
  const { crearAcuerdoDesdeOferta } = useAcuerdo();
  const navigate = useNavigate();

  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [notificacion, setNotificacion] = useState(null);
  const [ofertaEnContraoferta, setOfertaEnContraoferta] = useState(null);

  const usuarioId = usuarioActual?.id || 'u-1';

  const recibidas = useMemo(() => {
    return ofertas.filter((o) => o.vendedorId === usuarioId);
  }, [ofertas, usuarioId]);

  const enviadasCount = useMemo(() => {
    return ofertas.filter((o) => o.compradorId === usuarioId).length;
  }, [ofertas, usuarioId]);

  const conteos = useMemo(() => {
    return calcularConteosOfertas(recibidas);
  }, [recibidas]);

  const recibidasFiltradas = useMemo(() => {
    return filtrarOfertasPorEstado(recibidas, filtroEstado);
  }, [recibidas, filtroEstado]);

  const gruposPorAviso = useMemo(() => {
    return agruparOfertasPorAviso(recibidasFiltradas);
  }, [recibidasFiltradas]);

  const handleAceptar = (oferta) => {
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

    const res = aceptarOferta(oferta.id, codigoAcuerdo, oferta.monto);
    if (res.ok) {
      navigate(`/acuerdo-generado/${res.acuerdoId}`);
    }
  };

  const handleRechazar = (oferta) => {
    const res = rechazarOferta(oferta.id);
    if (res.ok) {
      setNotificacion({
        tipo: 'advertencia',
        mensaje: res.mensaje
      });
    }
  };

  const handleConfirmarContraoferta = ({ monto, mensaje }) => {
    if (!ofertaEnContraoferta) return;
    const res = enviarContraoferta(ofertaEnContraoferta.id, {
      monto,
      mensaje,
      autorNombre: usuarioActual
        ? `${usuarioActual.nombres.split(' ')[0]} ${usuarioActual.apellidos.split(' ')[0]}`
        : 'Vendedora',
      rolAutor: 'vendedor'
    });
    setOfertaEnContraoferta(null);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  return (
    <div className="page-container">
      <h1 className="title-screen of-page-title">Ofertas</h1>

      {/* Pestañas superiores Recibidas / Enviadas — Vista 4.1 */}
      <div className="of-tabs-nav">
        <Link to="/ofertas" className="of-tab-link of-tab-link--active">
          Recibidas · {recibidas.length}
        </Link>
        <Link to="/ofertas-enviadas" className="of-tab-link">
          Enviadas · {enviadasCount}
        </Link>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Filtros por estado */}
      <div className="of-filters-bar">
        <div className="of-filters-chips">
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

        <span className="text-aux">
          Agrupadas por aviso · mejor oferta destacada
        </span>
      </div>

      {/* Estado vacío (Vista 4.3) o Listado agrupado por aviso (Vista 4.1) */}
      {gruposPorAviso.length === 0 ? (
        <EstadoVacio
          icono="💬"
          titulo="Todavía no recibes ofertas"
          descripcion="Cuando algún estudiante envíe una oferta sobre tus avisos publicados, podrás aceptarla, rechazarla o contraofertar desde aquí."
          textoBoton="Ver mis publicaciones"
          rutaBoton="/mis-publicaciones"
        />
      ) : (
        <div className="of-groups-list">
          {gruposPorAviso.map((grupo) => {
            const avisoObj = obtenerAvisoPorId(grupo.avisoId) || {
              id: grupo.avisoId,
              titulo: grupo.avisoTitulo
            };
            const portada = obtenerPortadaAviso(avisoObj);

            return (
              <div
                key={grupo.avisoId}
                className="card-surface of-group-card"
              >
                {/* Cabecera del aviso */}
                <div className="of-group-header">
                  <div className="of-group-aviso-info">
                    <div className="striped-placeholder of-group-thumb">
                      {portada && (
                        <img
                          src={portada}
                          alt={grupo.avisoTitulo}
                          className="media-img-cover"
                        />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/aviso/${grupo.avisoId}`}
                        className="of-group-aviso-link"
                      >
                        {grupo.avisoTitulo}
                      </Link>
                      <div className="text-aux">
                        Precio pedido {formatearPrecio(grupo.precioPedido)} ·
                        mínimo aceptado {formatearPrecio(grupo.montoMinimo)} ·{' '}
                        {grupo.ofertas.length}{' '}
                        {grupo.ofertas.length === 1 ? 'oferta' : 'ofertas'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {grupo.acuerdoGenerado ? (
                      <BadgeEstado
                        estado={`Acuerdo ${grupo.acuerdoGenerado} generado`}
                        variante="success"
                      />
                    ) : (
                      grupo.mejorMonto !== null && (
                        <div className="of-best-offer-box">
                          <span className="label-upper of-best-offer-label">
                            Mejor oferta
                          </span>
                          <strong className="of-best-offer-amount">
                            {formatearPrecio(grupo.mejorMonto)}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Filas de ofertas de este aviso */}
                <div>
                  {grupo.ofertas.map((of) => (
                    <FilaOferta
                      key={of.id}
                      oferta={of}
                      onAceptar={handleAceptar}
                      onContraofertar={(o) => setOfertaEnContraoferta(o)}
                      onRechazar={handleRechazar}
                      onVerHilo={(o) => navigate(`/ofertas/${o.id}/hilo`)}
                      onIrAcuerdo={(o) =>
                        navigate(`/acuerdos/${o.acuerdoId || 'A-2201'}`)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ModalOferta
        abierto={Boolean(ofertaEnContraoferta)}
        onClose={() => setOfertaEnContraoferta(null)}
        modo="contraoferta"
        ofertaRecibida={ofertaEnContraoferta}
        aviso={
          ofertaEnContraoferta
            ? {
                id: ofertaEnContraoferta.avisoId,
                titulo: ofertaEnContraoferta.avisoTitulo,
                precio: ofertaEnContraoferta.precioPedido,
                montoMinimo: ofertaEnContraoferta.montoMinimo
              }
            : null
        }
        onConfirmar={handleConfirmarContraoferta}
      />
    </div>
  );
}
