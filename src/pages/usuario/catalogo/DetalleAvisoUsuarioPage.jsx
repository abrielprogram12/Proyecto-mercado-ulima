import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { useOferta } from '../../../context/OfertaContext';
import { useReporte } from '../../../context/ReporteContext';
import { formatearPrecio, obtenerIniciales } from '../../../data/contratoDatos';
import { obtenerFotosEnriquecidasAviso } from '../../../data/imagenesDatos';
import GaleriaFotos from '../../../components/GaleriaFotos/GaleriaFotos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalOferta from '../../../components/Modales/ModalOferta';
import ModalReporte from '../../../components/Modales/ModalReporte';
import './catalogo.css';

/**
 * MÓDULO: Catálogo y Búsqueda (Integrante 3 · HU-3)
 * Vistas 3.5 (Detalle con sesión y oferta activa) y 3.6 (Variantes vendido/pausado y similares)
 */
export default function DetalleAvisoUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { obtenerAvisoPorId, avisos, toggleFavorito, esFavorito } = useAviso();
  const { ofertas, enviarOferta, retirarOferta } = useOferta();
  const { crearReporte } = useReporte();

  const [modalOfertaAbierto, setModalOfertaAbierto] = useState(false);
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const aviso = obtenerAvisoPorId(id) || avisos[0];
  const vendedor = obtenerUsuarioPorId(aviso?.vendedorId);

  const esPropioAviso = Boolean(
    usuarioActual && aviso && aviso.vendedorId === usuarioActual.id
  );

  const ofertaActivaUsuario = useMemo(() => {
    if (!aviso || !usuarioActual) return null;
    return (
      ofertas.find(
        (o) =>
          o.avisoId === aviso.id &&
          o.compradorId === usuarioActual.id &&
          (o.estado === 'Enviada' || o.estado === 'Contraofertada')
      ) || null
    );
  }, [ofertas, aviso, usuarioActual]);

  const similares = useMemo(() => {
    if (!aviso) return [];
    return avisos
      .filter(
        (a) =>
          a.id !== aviso.id &&
          a.estado === 'Publicado' &&
          (a.curso === aviso.curso || a.categoria === aviso.categoria)
      )
      .slice(0, 3);
  }, [avisos, aviso]);

  if (!aviso) return null;

  const enFavoritos = usuarioActual
    ? esFavorito(usuarioActual.id, aviso.id)
    : false;

  const inicialesVendedor = vendedor
    ? obtenerIniciales(vendedor.nombres, vendedor.apellidos)
    : 'RQ';

  const fotosGaleria = obtenerFotosEnriquecidasAviso(aviso);

  const handleConfirmarOferta = ({ monto, mensaje }) => {
    const res = enviarOferta({
      aviso,
      comprador: usuarioActual || {
        id: 'u-2',
        nombres: 'Diego Alonso',
        apellidos: 'Vargas Huamán',
        carrera: 'Ing. de Sistemas',
        reputacion: 4.6
      },
      monto,
      mensaje
    });

    if (res.ok) {
      setModalOfertaAbierto(false);
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    } else {
      setNotificacion({
        tipo: 'error',
        mensaje: res.error
      });
    }
  };

  const handleRetirarOfertaActiva = () => {
    if (!ofertaActivaUsuario) return;
    const res = retirarOferta(ofertaActivaUsuario.id);
    if (res.ok) {
      setNotificacion({
        tipo: 'advertencia',
        mensaje: res.mensaje
      });
    }
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

  const esVendido = aviso.estado === 'Vendido';
  const esPausado = aviso.estado === 'Pausado';

  return (
    <div className="page-container">
      {/* Breadcrumbs */}
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

      {/* Grilla de 2 columnas — Vista 3.5 */}
      <div className="cat-detalle-columnas">
        {/* Columna izquierda: Galería + Descripción + Avisos similares */}
        <div className="cat-pila">
          <GaleriaFotos fotos={fotosGaleria} vendido={esVendido} />

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

          {/* Avisos similares (Vista 3.6) */}
          {similares.length > 0 && (
            <div>
              <h2 className="title-section cat-titulo-primario">
                Avisos similares en {aviso.curso || aviso.categoria}
              </h2>
              <div className="cat-similares-grid">
                {similares.map((sim) => (
                  <TarjetaAviso
                    key={sim.id}
                    aviso={sim}
                    mostrarCorazon={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Ficha de acción + Oferta activa + Vendedor + Reportar */}
        <div className="cat-pila-derecha">
          <div className="card-surface cat-tarjeta-ficha">
            <div className="cat-espacio-abajo">
              <BadgeEstado estado={aviso.estado} />
            </div>

            <h1 className="title-screen cat-espacio-abajo">{aviso.titulo}</h1>

            <div className="price-text cat-precio-grande">
              {formatearPrecio(aviso.precio)}
            </div>

            {/* Variante: Aviso vendido o pausado (Vista 3.6) */}
            {(esVendido || esPausado) ? (
              <div>
                <div className="card-surface cat-aviso-cerrado">
                  {esVendido
                    ? `Este artículo ya se entregó mediante un acuerdo en el campus el ${
                        aviso.fechaVenta || '21/08/2026'
                      }.`
                    : 'El vendedor pausó temporalmente este aviso. No admite ofertas por ahora.'}
                </div>

                <button
                  type="button"
                  className="btn btn-primary cat-btn-bloque"
                  disabled
                >
                  {esVendido
                    ? 'Aviso cerrado — no admite ofertas'
                    : 'Aviso pausado temporalmente'}
                </button>

                <Link
                  to={`/catalogo?curso=${encodeURIComponent(
                    aviso.curso || ''
                  )}`}
                  className="btn btn-secondary cat-btn-bloque"
                >
                  Ver avisos similares de {aviso.curso || aviso.categoria}
                </Link>
              </div>
            ) : esPropioAviso ? (
              /* Variante: El usuario actual es el vendedor dueño del aviso */
              <div>
                <div className="cat-oferta-activa-box">
                  <div className="cat-oferta-activa-head">
                    <BadgeEstado
                      estado="Tu publicación"
                      variante="info"
                    />
                    <span className="text-aux">
                      {aviso.ofertasCount || 0}{' '}
                      {(aviso.ofertasCount || 0) === 1
                        ? 'oferta recibida'
                        : 'ofertas recibidas'}
                    </span>
                  </div>
                  <p className="cat-oferta-activa-nota">
                    Eres el vendedor de este artículo. Desde aquí puedes editar
                    sus datos, actualizar las fotografías o revisar las ofertas
                    que te envíen otros estudiantes.
                  </p>
                  <div className="cat-oferta-activa-botones">
                    <Link
                      to={`/editar-aviso/${aviso.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Editar aviso
                    </Link>
                    <Link
                      to={`/aviso/${aviso.id}/fotografias`}
                      className="btn btn-outline btn-sm"
                    >
                      Fotografías
                    </Link>
                    <Link to="/ofertas" className="btn btn-primary btn-sm">
                      Ver ofertas recibidas
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Variante normal: Comprador con o sin oferta activa (Vista 3.5) */
              <div>
                {aviso.aceptaOfertas && (
                  <p className="text-aux cat-nota-minimo">
                    Acepta ofertas desde{' '}
                    <strong>{formatearPrecio(aviso.montoMinimo)}</strong> · 1
                    oferta activa por comprador
                  </p>
                )}

                {ofertaActivaUsuario ? (
                  <>
                    <div className="cat-oferta-activa-box">
                      <div className="cat-oferta-activa-head">
                        <BadgeEstado
                          estado={
                            ofertaActivaUsuario.estado === 'Contraofertada'
                              ? 'Contraoferta del vendedor'
                              : 'Tu oferta está activa'
                          }
                          variante={
                            ofertaActivaUsuario.estado === 'Contraofertada'
                              ? 'warning'
                              : 'info'
                          }
                        />
                        <span className="text-aux">
                          Enviada el {ofertaActivaUsuario.fecha}
                        </span>
                      </div>

                      <div className="cat-oferta-activa-monto">
                        <strong className="price-text cat-precio-oferta">
                          {formatearPrecio(
                            ofertaActivaUsuario.estado === 'Contraofertada' &&
                              ofertaActivaUsuario.montoContraoferta
                              ? ofertaActivaUsuario.montoContraoferta
                              : ofertaActivaUsuario.monto
                          )}
                        </strong>{' '}
                        <span className="text-aux">
                          {ofertaActivaUsuario.estado === 'Contraofertada'
                            ? `propuesta del vendedor (tú ofertaste ${formatearPrecio(
                                ofertaActivaUsuario.monto
                              )})`
                            : '· esperando respuesta del vendedor'}
                        </span>
                      </div>

                      <p className="cat-oferta-activa-nota">
                        {ofertaActivaUsuario.estado === 'Contraofertada'
                          ? 'El vendedor te envió una contraoferta. Entra al hilo para aceptarla, proponer otro monto o rechazarla.'
                          : 'Solo puedes tener una oferta activa por aviso. Si deseas cambiar el monto, retira esta oferta antes de que el vendedor responda.'}
                      </p>

                      <div className="cat-oferta-activa-botones">
                        <Link
                          to={`/ofertas/${ofertaActivaUsuario.id}/hilo`}
                          className="btn btn-primary btn-sm"
                        >
                          {ofertaActivaUsuario.estado === 'Contraofertada'
                            ? 'Responder contraoferta'
                            : 'Ver hilo'}
                        </Link>
                        {ofertaActivaUsuario.estado === 'Enviada' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={handleRetirarOfertaActiva}
                          >
                            Retirar oferta
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary cat-btn-bloque"
                      disabled
                    >
                      Ya tienes una oferta activa
                    </button>
                    <span className="field-hint cat-hint-retirar">
                      {ofertaActivaUsuario.estado === 'Contraofertada'
                        ? 'Responde la contraoferta desde el hilo de negociación.'
                        : 'Retira tu oferta actual si quieres enviar un monto distinto.'}
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary cat-btn-bloque"
                    onClick={() => setModalOfertaAbierto(true)}
                  >
                    Ofertar
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary cat-btn-favorito"
                  onClick={() =>
                    usuarioActual && toggleFavorito(usuarioActual.id, aviso.id)
                  }
                >
                  {enFavoritos
                    ? '♥ Guardado en favoritos'
                    : '♡ Guardar en favoritos'}
                </button>
              </div>
            )}
          </div>

          {/* Tarjeta del Vendedor */}
          <div className="card-surface cat-tarjeta-vendedor">
            <span className="label-upper">Vendedor</span>
            <div className="cat-vendedor-fila">
              <div className="cat-vendedor-izq">
                <div className="cat-avatar">
                  {vendedor?.fotoPerfil ? (
                    <img
                      src={vendedor.fotoPerfil}
                      alt={vendedor.nombres}
                      className="media-img-cover"
                    />
                  ) : (
                    inicialesVendedor
                  )}
                </div>
                <div>
                  <strong className="cat-vendedor-nombre">
                    {vendedor
                      ? `${vendedor.nombres} ${vendedor.apellidos}`
                      : aviso.vendedorNombre}
                  </strong>
                  <span className="text-aux">
                    {vendedor?.carrera || 'Administración'} ·{' '}
                    {vendedor?.reputacion || 4.8} ★ ·{' '}
                    {vendedor?.acuerdosCerrados || 12} acuerdos
                  </span>
                </div>
              </div>

              <Link
                to={`/vendedor/${aviso.vendedorId}`}
                className="cat-link-fuerte"
              >
                Ver perfil →
              </Link>
            </div>
          </div>

          {/* Reportar aviso */}
          {!esPropioAviso && (
            <div className="card-surface cat-reportar-card">
              <span className="text-aux">¿Algo no cuadra con este aviso?</span>
              <button
                type="button"
                className="btn btn-tertiary btn-sm cat-btn-peligro-texto"
                onClick={() => setModalReporteAbierto(true)}
              >
                Reportar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para enviar oferta (Vista 4.5) */}
      <ModalOferta
        abierto={modalOfertaAbierto}
        onClose={() => setModalOfertaAbierto(false)}
        modo="oferta"
        aviso={aviso}
        onConfirmar={handleConfirmarOferta}
      />

      {/* Modal para reportar aviso (Vista 7.5) */}
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
