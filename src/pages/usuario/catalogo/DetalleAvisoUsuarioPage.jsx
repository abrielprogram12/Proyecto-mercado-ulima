import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

export default function DetalleAvisoUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    const nuevaOferta = {
      id: `of-${Date.now()}`,
      avisoId: aviso.id,
      avisoTitulo: aviso.titulo,
      precioPedido: aviso.precio,
      montoMinimo: aviso.montoMinimo,
      vendedorId: aviso.vendedorId,
      vendedorNombre: aviso.vendedorNombre,
      compradorId: usuarioId,
      compradorNombre: usuarioActual
        ? `${usuarioActual.nombres} ${usuarioActual.apellidos}`
        : 'Diego Alonso Vargas Huamán',
      compradorCarrera: usuarioActual?.carrera || 'Ing. de Sistemas',
      compradorReputacion: usuarioActual?.reputacion || 4.6,
      monto: Number(monto),
      mensaje: mensaje || '¿Podemos coordinar la entrega en el campus?',
      estado: 'Enviada',
      fecha: '17/10/2026',
      movimientos: [
        {
          id: `m-${Date.now()}`,
          autorId: usuarioId,
          autorNombre: usuarioActual?.nombres || 'Comprador',
          rolAutor: 'comprador',
          tipo: 'Oferta enviada',
          monto: Number(monto),
          mensaje: mensaje || '',
          fechaHora: '17/10/2026 · 10:00'
        }
      ]
    };

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '32px',
          alignItems: 'start'
        }}
      >
        {/* Columna izquierda: Galería + Descripción o Similares (Vistas 3.5 y 3.6) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GaleriaFotos fotos={aviso.fotos} vendido={estaVendido} />

          {estaVendido && avisosSimilares.length > 0 && (
            <div>
              <h2
                className="title-section"
                style={{ color: 'var(--color-primary)', marginBottom: '14px' }}
              >
                Avisos similares del mismo curso
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px'
                }}
              >
                {avisosSimilares.map((sim) => (
                  <TarjetaAviso key={sim.id} aviso={sim} mostrarCorazon={false} />
                ))}
              </div>
            </div>
          )}

          <div className="card-surface" style={{ padding: '24px 28px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '12px' }}
            >
              Descripción
            </h2>
            <p style={{ marginBottom: '20px' }}>{aviso.descripcion}</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border)'
              }}
            >
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card-surface" style={{ padding: '26px' }}>
            <div style={{ marginBottom: '10px' }}>
              <BadgeEstado
                estado={
                  estaVendido
                    ? `Vendido el ${aviso.fechaVenta || '05/08/2026'}`
                    : aviso.estado
                }
              />
            </div>

            <h1 className="title-screen" style={{ marginBottom: '10px' }}>
              {aviso.titulo}
            </h1>

            <div
              className="price-text"
              style={{ fontSize: '30px', lineHeight: '36px', marginBottom: '6px' }}
            >
              {formatearPrecio(aviso.precio)}
            </div>

            {estaVendido ? (
              /* Vista 3.6 — Aviso vendido */
              <>
                <div
                  className="card-surface"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'var(--color-bg)',
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}
                >
                  Este aviso ya se cerró y no acepta ofertas. Puedes ver avisos
                  parecidos del mismo curso o crear una alerta de búsqueda.
                </div>

                <Link
                  to={`/catalogo?curso=${encodeURIComponent(
                    aviso.curso || 'Física II'
                  )}`}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  Ver avisos de {aviso.curso || 'Física II'}
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
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
                  <p className="text-aux" style={{ marginBottom: '14px' }}>
                    Acepta ofertas desde {formatearPrecio(aviso.montoMinimo)}
                  </p>
                )}

                {ofertaActivaPropia && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-info-bg)',
                      border: '1px solid #B7D4F0',
                      borderRadius: 'var(--radius-btn)',
                      padding: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px'
                      }}
                    >
                      <BadgeEstado estado="Oferta enviada" />
                      <span className="text-aux">{ofertaActivaPropia.fecha}</span>
                    </div>

                    <div style={{ marginBottom: '6px' }}>
                      <strong
                        className="price-text"
                        style={{ fontSize: '22px' }}
                      >
                        {formatearPrecio(ofertaActivaPropia.monto)}
                      </strong>{' '}
                      <span className="text-aux">tu oferta activa</span>
                    </div>

                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-text)',
                        marginBottom: '12px'
                      }}
                    >
                      El vendedor todavía no responde. Solo se admite una oferta
                      activa por aviso.
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
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
                  className="btn btn-primary"
                  disabled={Boolean(ofertaActivaPropia)}
                  style={{ width: '100%', marginBottom: '6px' }}
                  onClick={() => setModalOfertaAbierto(true)}
                >
                  Ofertar
                </button>

                {ofertaActivaPropia && (
                  <span
                    className="field-hint"
                    style={{ marginBottom: '12px', display: 'block' }}
                  >
                    Retira tu oferta actual para enviar otro monto.
                  </span>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '6px' }}
                  onClick={() => toggleFavorito(usuarioId, aviso.id)}
                >
                  ♥ {guardadoFav ? 'Guardado en favoritos' : 'Guardar en favoritos'}
                </button>
              </>
            )}
          </div>

          {/* Ficha del vendedor */}
          <div className="card-surface" style={{ padding: '20px 24px' }}>
            <span className="label-upper" style={{ marginBottom: '10px' }}>
              Vendedor
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {inicialesVendedor}
                </div>
                <div>
                  <strong style={{ display: 'block' }}>
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
                style={{ fontWeight: 600, fontSize: '14px' }}
              >
                Ver perfil
              </Link>
            </div>
          </div>

          <div
            className="card-surface"
            style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span className="text-aux">
              ¿Este aviso incumple las normas del tablón?
            </span>
            <button
              type="button"
              className="btn btn-tertiary btn-sm"
              style={{ color: 'var(--color-error)' }}
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
