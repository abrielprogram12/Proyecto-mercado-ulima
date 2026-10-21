import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import { useAuth } from '../../../context/AuthContext';
import { useOferta } from '../../../context/OfertaContext';
import { useReporte } from '../../../context/ReporteContext';
import { formatearPrecio, obtenerIniciales } from '../../../data/contratoDatos';
import GaleriaFotos from '../../../components/GaleriaFotos/GaleriaFotos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalOferta from '../../../components/Modales/ModalOferta';
import ModalReporte from '../../../components/Modales/ModalReporte';
import { crearObjetoNuevaOferta } from './catalogoUtils';
import './catalogo.css';

/**
 * MÓDULO: Catálogo y Búsqueda (Integrante 3 · HU-3)
 * Vistas 3.5 y 3.6 — Detalle de aviso para estudiante autenticado (disponible y vendido)
 */
export default function DetalleAvisoUsuarioPage() {
  const { id } = useParams();
  const { obtenerAvisoPorId, avisos, toggleFavorito, esFavorito } = useAviso();
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { ofertas, setOfertas } = useOferta();
  const { crearReporte } = useReporte();

  const [modalOfertaAbierto, setModalOfertaAbierto] = useState(false);
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const aviso = obtenerAvisoPorId(id) || avisos[0];
  if (!aviso) return null;

  const vendedor = obtenerUsuarioPorId(aviso.vendedorId);
  const usuarioId = usuarioActual?.id || 'u-2';
  const guardadoFav = esFavorito(usuarioId, aviso.id);
  const estaVendido = aviso.estado === 'Vendido';

  // Busca si el usuario actual tiene una oferta activa propia sobre este aviso (Vista 3.5)
  const ofertaActivaPropia = ofertas.find(
    (o) =>
      o.avisoId === aviso.id &&
      o.compradorId === usuarioId &&
      (o.estado === 'Enviada' || o.estado === 'Contraofertada')
  );

  const avisosSimilares = avisos
    .filter((a) => a.id !== aviso.id && a.curso === aviso.curso)
    .slice(0, 3);

  const handleConfirmarOferta = ({ monto, mensaje }) => {
    const nuevaOferta = crearObjetoNuevaOferta({
      aviso,
      usuarioActual,
      usuarioId,
      monto,
      mensaje
    });

    setOfertas((prev) => [nuevaOferta, ...prev]);
    setModalOfertaAbierto(false);
    setNotificacion({
      tipo: 'exito',
      mensaje: `Éxito. Tu oferta de ${formatearPrecio(monto)} se envió. Te avisaremos cuando el vendedor responda.`
    });
  };

  const handleRetirarOferta = () => {
    if (!ofertaActivaPropia) return;
    setOfertas((prev) => prev.filter((o) => o.id !== ofertaActivaPropia.id));
    setNotificacion({
      tipo: 'advertencia',
      mensaje: 'Oferta retirada. Puedes enviar una nueva cuando quieras.'
    });
  };

  const handleEnviarReporte = ({ motivo, descripcion }) => {
    const res = crearReporte({
      tipo: 'Aviso',
      elementoId: aviso.id,
      elementoTitulo: aviso.titulo,
      elementoSubtitulo: `Aviso de ${aviso.vendedorNombre}`,
      usuarioReportadoId: aviso.vendedorId,
      usuarioReportadoNombre: aviso.vendedorNombre,
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

  const inicialesVendedor = vendedor
    ? obtenerIniciales(vendedor.nombres, vendedor.apellidos)
    : 'RQ';

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/catalogo">Catálogo</Link>
        <span>›</span>
        <span>{aviso.categoria}</span>
        {aviso.curso && (
          <>
            <span>›</span>
            <span>{aviso.curso}</span>
          </>
        )}
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="cat-detalle-columnas">
        {/* Columna izquierda: Galería + Descripción o Similares (Vistas 3.5 y 3.6) */}
        <div className="cat-pila">
          <GaleriaFotos fotos={aviso.fotos} vendido={estaVendido} />

          {estaVendido && avisosSimilares.length > 0 && (
            <div>
              <h2 className="title-section cat-titulo-primario">
                Avisos similares del mismo curso
              </h2>
              <div className="cat-similares-grid">
                {avisosSimilares.map((sim) => (
                  <TarjetaAviso key={sim.id} aviso={sim} mostrarCorazon={false} />
                ))}
              </div>
            </div>
          )}

          <div className="card-surface cat-tarjeta">
            <h2 className="title-section cat-titulo-primario">Descripción</h2>
            <p className="cat-descripcion-texto">{aviso.descripcion}</p>

            <div className="cat-ficha-meta">
              <div>
                <span className="label-upper">Categoría</span>
                <strong>{aviso.categoria}</strong>
              </div>
              <div>
                <span className="label-upper">Curso</span>
                <strong>{aviso.curso || 'General'}</strong>
              </div>
              <div>
                <span className="label-upper">Estado</span>
                <strong>{aviso.condicion}</strong>
              </div>
              <div>
                <span className="label-upper">Publicado</span>
                <strong>{aviso.fechaPublicacion}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Panel dinámico según estado (Vistas 3.5 y 3.6) */}
        <div className="cat-pila-derecha">
          <div className="card-surface cat-tarjeta-ficha">
            <div className="cat-espacio-abajo">
              <BadgeEstado
                estado={
                  estaVendido
                    ? `Vendido el ${aviso.fechaVenta || '05/08/2026'}`
                    : aviso.estado
                }
              />
            </div>

            <h1 className="title-screen cat-espacio-abajo">{aviso.titulo}</h1>

            <div className="price-text cat-precio-grande">
              {formatearPrecio(aviso.precio)}
            </div>

            {estaVendido ? (
              /* Vista 3.6 — Aviso vendido */
              <>
                <div className="card-surface cat-aviso-cerrado">
                  Este aviso ya se cerró y no acepta ofertas. Puedes ver avisos
                  parecidos del mismo curso o crear una alerta de búsqueda.
                </div>

                <Link
                  to={`/catalogo?curso=${encodeURIComponent(
                    aviso.curso || 'Física II'
                  )}`}
                  className="btn btn-primary cat-btn-bloque"
                >
                  Ver avisos de {aviso.curso || 'Física II'}
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary cat-btn-bloque"
                  onClick={() =>
                    setNotificacion({
                      tipo: 'exito',
                      mensaje:
                        'Alerta creada. Te notificaremos cuando se publique otro aviso de este curso.'
                    })
                  }
                >
                  Crear alerta de búsqueda
                </button>
              </>
            ) : (
              /* Vista 3.5 — Aviso activo (con o sin oferta activa propia) */
              <>
                {aviso.aceptaOfertas && (
                  <p className="text-aux cat-nota-minimo">
                    Acepta ofertas desde {formatearPrecio(aviso.montoMinimo)}
                  </p>
                )}

                {ofertaActivaPropia && (
                  <div className="cat-oferta-activa-box">
                    <div className="cat-oferta-activa-head">
                      <BadgeEstado estado="Oferta enviada" />
                      <span className="text-aux">{ofertaActivaPropia.fecha}</span>
                    </div>

                    <div className="cat-oferta-activa-monto">
                      <strong className="price-text cat-precio-oferta">
                        {formatearPrecio(ofertaActivaPropia.monto)}
                      </strong>{' '}
                      <span className="text-aux">tu oferta activa</span>
                    </div>

                    <p className="cat-oferta-activa-nota">
                      El vendedor todavía no responde. Solo se admite una oferta
                      activa por aviso.
                    </p>

                    <div className="cat-oferta-activa-botones">
                      <Link
                        to={`/ofertas/${ofertaActivaPropia.id}/hilo`}
                        className="btn btn-primary btn-sm"
                      >
                        Ver el hilo
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={handleRetirarOferta}
                      >
                        Retirar oferta
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary cat-btn-bloque"
                  disabled={Boolean(ofertaActivaPropia)}
                  onClick={() => setModalOfertaAbierto(true)}
                >
                  Ofertar
                </button>

                {ofertaActivaPropia && (
                  <span className="field-hint cat-hint-retirar">
                    Retira tu oferta actual para enviar otro monto.
                  </span>
                )}

                <button
                  type="button"
                  className="btn btn-secondary cat-btn-favorito"
                  onClick={() => toggleFavorito(usuarioId, aviso.id)}
                >
                  ♥ {guardadoFav ? 'Guardado en favoritos' : 'Guardar en favoritos'}
                </button>
              </>
            )}
          </div>

          {/* Ficha del vendedor */}
          <div className="card-surface cat-tarjeta-vendedor">
            <span className="label-upper">Vendedor</span>
            <div className="cat-vendedor-fila">
              <div className="cat-vendedor-izq">
                <div className="cat-avatar">{inicialesVendedor}</div>
                <div>
                  <strong className="cat-vendedor-nombre">
                    {aviso.vendedorNombre}
                  </strong>
                  <span className="text-aux">
                    {vendedor?.reputacion || 4.8} ★ ·{' '}
                    {vendedor?.acuerdosCerrados || 12} acuerdos cerrados ·
                    responde en 1 día
                  </span>
                </div>
              </div>

              <Link
                to={`/vendedor/${aviso.vendedorId}`}
                className="cat-link-fuerte"
              >
                Ver perfil
              </Link>
            </div>
          </div>

          <div className="card-surface cat-reportar-card">
            <span className="text-aux">
              ¿Este aviso incumple las normas del tablón?
            </span>
            <button
              type="button"
              className="btn btn-tertiary btn-sm cat-btn-peligro-texto"
              onClick={() => setModalReporteAbierto(true)}
            >
              Reportar aviso
            </button>
          </div>
        </div>
      </div>

      <ModalOferta
        abierto={modalOfertaAbierto}
        onClose={() => setModalOfertaAbierto(false)}
        aviso={aviso}
        modo="oferta"
        onConfirmar={handleConfirmarOferta}
      />

      <ModalReporte
        abierto={modalReporteAbierto}
        onClose={() => setModalReporteAbierto(false)}
        tituloElemento={aviso.titulo}
        subtituloElemento={`Publicado por ${aviso.vendedorNombre} · ${aviso.fechaPublicacion}`}
        onEnviarReporte={handleEnviarReporte}
      />
    </div>
  );
}
