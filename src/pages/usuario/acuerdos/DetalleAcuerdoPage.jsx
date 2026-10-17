import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { useReporte } from '../../../context/ReporteContext';
import { ESTADOS_ACUERDO, formatearPrecio } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalCancelarAcuerdo from '../../../components/Modales/ModalCancelarAcuerdo';
import ModalConfirmarEntrega from '../../../components/Modales/ModalConfirmarEntrega';
import ModalReporte from '../../../components/Modales/ModalReporte';
import AcuerdoNoDisponible from './AcuerdoNoDisponible';
import ModalModificarEncuentro from './ModalModificarEncuentro';
import TrazabilidadAcuerdo from './TrazabilidadAcuerdo';
import {
  datosContraparte,
  esEnCurso,
  inicialesDe,
  primerNombre,
  textoReputacion,
  tituloNotificacion
} from './acuerdosUtils';
import './acuerdos.css';

/**
 * MÓDULO: Acuerdos de entrega (Integrante 5 · HU-5)
 * Vista 5.4 — Detalle del acuerdo (+ modales 5.5)
 */

function ParteAcuerdo({ etiqueta, nombre, detalle, esYo }) {
  return (
    <div className="acu-parte">
      <span className="acu-avatar" aria-hidden="true">
        {inicialesDe(nombre)}
      </span>
      <div>
        <span className="label-upper" style={{ marginBottom: 0 }}>
          {etiqueta}
        </span>
        <p className="acu-fuerte">
          {nombre}
          {esYo && ' (tú)'}
        </p>
        <p className="text-aux">{detalle}</p>
      </div>
    </div>
  );
}

export default function DetalleAcuerdoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { crearReporte } = useReporte();
  const {
    obtenerAcuerdoPorId,
    rolEnAcuerdo,
    estadoParaUsuario,
    confirmarEntrega,
    cancelarAcuerdo,
    reabrirCoordinacion
  } = useAcuerdo();

  const [modal, setModal] = useState(null); // 'entrega' | 'cancelar' | 'modificar' | 'reporte'
  const [notificacion, setNotificacion] = useState(location.state?.notificacion ?? null);

  const usuarioId = usuarioActual?.id;
  const acuerdo = obtenerAcuerdoPorId(id);
  const rol = rolEnAcuerdo(acuerdo, usuarioId);
  if (!acuerdo || !rol) return <AcuerdoNoDisponible />;

  const estado = estadoParaUsuario(acuerdo, usuarioId);
  const contraparte = datosContraparte(acuerdo, rol, obtenerUsuarioPorId);
  const enCurso = esEnCurso(acuerdo.estado);
  const acordado = acuerdo.estado === ESTADOS_ACUERDO.ACORDADO;
  const entregado = acuerdo.estado === ESTADOS_ACUERDO.ENTREGADO;
  const cancelado = acuerdo.estado === ESTADOS_ACUERDO.CANCELADO;

  const confirmoYo = rol === 'vendedor' ? acuerdo.confirmadoVendedor : acuerdo.confirmadoComprador;
  const confirmoOtro = rol === 'vendedor' ? acuerdo.confirmadoComprador : acuerdo.confirmadoVendedor;
  const fechaYo = rol === 'vendedor' ? acuerdo.fechaConfirmacionVendedor : acuerdo.fechaConfirmacionComprador;
  const fechaOtro = rol === 'vendedor' ? acuerdo.fechaConfirmacionComprador : acuerdo.fechaConfirmacionVendedor;

  const etiquetaEstado = acordado ? 'Acordado — pendiente de entrega' : estado;
  const cerrarModal = () => setModal(null);

  const notificar = (resultado, tipoOk = 'exito') =>
    setNotificacion(
      resultado.ok
        ? { tipo: tipoOk, mensaje: resultado.mensaje }
        : { tipo: 'error', mensaje: resultado.error }
    );

  const alConfirmarEntrega = () => {
    const resultado = confirmarEntrega(acuerdo.id, usuarioId);
    cerrarModal();
    notificar(resultado, resultado.cerrado ? 'exito' : 'info');
  };

  const alCancelar = ({ motivo, comentario }) => {
    const resultado = cancelarAcuerdo(acuerdo.id, usuarioId, { motivo, comentario });
    cerrarModal();
    if (!resultado.ok) return notificar(resultado);
    navigate('/acuerdos', { state: { notificacion: { tipo: 'exito', mensaje: resultado.mensaje } } });
  };

  const alModificar = () => {
    const resultado = reabrirCoordinacion(acuerdo.id, usuarioId);
    cerrarModal();
    if (!resultado.ok) return notificar(resultado);
    navigate(`/acuerdos/${acuerdo.id}/coordinar`, {
      state: { notificacion: { tipo: 'info', mensaje: resultado.mensaje } }
    });
  };

  const alReportar = ({ motivo, descripcion }) => {
    const resultado = crearReporte({
      tipo: 'Usuario',
      elementoId: contraparte.id,
      elementoTitulo: contraparte.nombre,
      elementoSubtitulo: `Perfil de usuario · acuerdo ${acuerdo.id}`,
      usuarioReportadoId: contraparte.id,
      usuarioReportadoNombre: contraparte.nombre,
      motivo,
      descripcion,
      reportante: usuarioActual
    });
    cerrarModal();
    notificar(resultado);
  };

  return (
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link to="/acuerdos">Mis acuerdos</Link> › <span>{acuerdo.id}</span>
      </nav>

      <div className="acu-encabezado">
        <div className="acu-encabezado-titulo">
          <h1 className="title-screen">Acuerdo {acuerdo.id}</h1>
          <BadgeEstado estado={etiquetaEstado} variante={acordado ? 'success' : undefined} />
        </div>
        <button type="button" className="btn btn-tertiary" onClick={() => setModal('reporte')}>
          Reportar a la contraparte
        </button>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          titulo={tituloNotificacion(notificacion.tipo)}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="acu-columnas">
        <div className="acu-pila">
          <section className="acu-tarjeta card-surface">
            <div className="acu-aviso-card">
              <div className="acu-miniatura striped-placeholder" aria-hidden="true" />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 className="title-section">{acuerdo.avisoTitulo}</h2>
                <p className="text-aux">{acuerdo.avisoSubtitulo}</p>
                <p className="price-text" style={{ fontSize: '22px', margin: '6px 0' }}>
                  {formatearPrecio(acuerdo.montoAcordado)}{' '}
                  <span className="text-aux">acordado sobre {formatearPrecio(acuerdo.precioPedido)} pedidos</span>
                </p>
                <Link to={`/aviso/${acuerdo.avisoId}`}>Ver el aviso</Link>
              </div>
            </div>
          </section>

          <section className="acu-tarjeta card-surface">
            <h2 className="title-section">Datos del encuentro</h2>
            {(acordado || entregado) && acuerdo.puntoEncuentro ? (
              <div className="acu-datos-encuentro">
                <div>
                  <span className="label-upper">Punto de encuentro</span>
                  <p className="acu-fuerte">{acuerdo.puntoEncuentro}</p>
                </div>
                <div>
                  <span className="label-upper">Fecha</span>
                  <p className="acu-fuerte">{acuerdo.fechaEncuentro}</p>
                </div>
                <div>
                  <span className="label-upper">Franja horaria</span>
                  <p className="acu-fuerte">{acuerdo.franjaHoraria}</p>
                </div>
              </div>
            ) : (
              <p className="text-aux" style={{ marginBottom: '16px' }}>
                {cancelado
                  ? 'El acuerdo se canceló, por lo que no hay un encuentro vigente.'
                  : 'Todavía no hay punto ni horario acordados.'}{' '}
                {enCurso && <Link to={`/acuerdos/${acuerdo.id}/coordinar`}>Coordinar ahora</Link>}
              </p>
            )}

            <div className="acu-partes">
              <ParteAcuerdo
                etiqueta="Comprador"
                nombre={acuerdo.compradorNombre}
                esYo={rol === 'comprador'}
                detalle={[textoReputacion(acuerdo.compradorReputacion), acuerdo.compradorTelefono].filter(Boolean).join(' · ')}
              />
              <ParteAcuerdo
                etiqueta="Vendedor"
                nombre={acuerdo.vendedorNombre}
                esYo={rol === 'vendedor'}
                detalle={[
                  textoReputacion(obtenerUsuarioPorId(acuerdo.vendedorId)?.reputacion),
                  acuerdo.vendedorTelefono
                ]
                  .filter(Boolean)
                  .join(' · ')}
              />
            </div>
            <p className="text-aux" style={{ marginTop: '12px' }}>
              Los teléfonos solo se muestran a las dos partes de este acuerdo.
            </p>
          </section>

          <section className="acu-tarjeta card-surface">
            <h2 className="title-section">Trazabilidad</h2>
            <TrazabilidadAcuerdo eventos={acuerdo.trazabilidad} />
          </section>
        </div>

        <aside className="acu-pila">
          {(acordado || entregado) && acuerdo.codigoEntrega && (
            <section className="acu-tarjeta card-surface">
              <span className="label-upper">Código de entrega</span>
              <p className="acu-codigo-entrega">{acuerdo.codigoEntrega}</p>
              <p className="text-aux">
                Compártelo solo al momento del encuentro. Sirve para verificar que ambos están en el trato correcto.
              </p>
            </section>
          )}

          {(acordado || entregado) && (
            <section className="acu-tarjeta card-surface">
              <span className="label-upper">Confirmación de entrega</span>
              <div className="acu-confirmaciones">
                <span className={`text-aux ${confirmoOtro ? 'confirmado' : ''}`}>
                  {confirmoOtro
                    ? `✓ ${primerNombre(contraparte.nombre)} confirmó${fechaOtro ? ` el ${fechaOtro}` : ''}`
                    : `${primerNombre(contraparte.nombre)} aún no confirma`}
                </span>
                <span className={`text-aux ${confirmoYo ? 'confirmado' : ''}`}>
                  {confirmoYo ? `✓ Tú confirmaste${fechaYo ? ` el ${fechaYo}` : ''}` : 'Tú aún no confirmas'}
                </span>
              </div>
              <div className="acu-botones-columna">
                {acordado && !confirmoYo && (
                  <button type="button" className="btn btn-success" onClick={() => setModal('entrega')}>
                    Confirmar entrega
                  </button>
                )}
                {entregado && acuerdo.pendienteCalificar && (
                  <Link to={`/acuerdos/${acuerdo.id}/calificar`} className="btn btn-primary">
                    Calificar a {primerNombre(contraparte.nombre)}
                  </Link>
                )}
              </div>
              {acordado && (
                <p className="text-aux" style={{ marginTop: '10px' }}>
                  Al confirmar ambos, el aviso pasa a vendido y se abre la calificación.
                </p>
              )}
            </section>
          )}

          {cancelado && (
            <section className="acu-tarjeta card-surface">
              <span className="label-upper">Cancelación</span>
              <p className="acu-fuerte">{acuerdo.motivoCancelacion || 'Sin motivo registrado'}</p>
              {acuerdo.comentarioCancelacion && <p className="acu-cita">«{acuerdo.comentarioCancelacion}»</p>}
              {acuerdo.canceladoPor && (
                <p className="text-aux">
                  Cancelado por {acuerdo.canceladoPor === usuarioId ? 'ti' : primerNombre(contraparte.nombre)}.
                </p>
              )}
            </section>
          )}

          {(acordado || enCurso) && (
            <div className="acu-botones-columna">
              {acordado && (
                <button type="button" className="btn btn-secondary" onClick={() => setModal('modificar')}>
                  Modificar punto y horario
                </button>
              )}
              {enCurso && (
                <button type="button" className="btn btn-peligro-borde" onClick={() => setModal('cancelar')}>
                  Cancelar el acuerdo
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      {modal === 'entrega' && (
        <ModalConfirmarEntrega abierto acuerdo={acuerdo} onClose={cerrarModal} onConfirmar={alConfirmarEntrega} />
      )}
      {modal === 'cancelar' && (
        <ModalCancelarAcuerdo abierto acuerdo={acuerdo} onClose={cerrarModal} onConfirmar={alCancelar} />
      )}
      {modal === 'modificar' && <ModalModificarEncuentro abierto onClose={cerrarModal} onConfirmar={alModificar} />}
      {modal === 'reporte' && (
        <ModalReporte
          abierto
          tituloElemento={contraparte.nombre}
          subtituloElemento={`Perfil de usuario · acuerdo ${acuerdo.id}`}
          onClose={cerrarModal}
          onEnviarReporte={alReportar}
        />
      )}
    </div>
  );
}
