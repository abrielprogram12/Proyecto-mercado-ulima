import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { ESTADOS_ACUERDO, FRANJAS_HORARIAS, PUNTOS_ENCUENTRO, formatearPrecio } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../../components/Notificacion/Notificacion';
import AcuerdoNoDisponible from './AcuerdoNoDisponible';
import TrazabilidadAcuerdo from './TrazabilidadAcuerdo';
import { datosContraparte, hoyIso, isoAFecha, primerNombre, textoReputacion, tituloNotificacion } from './acuerdosUtils';
import './acuerdos.css';

/**
 * MÓDULO: Acuerdos de entrega (Integrante 5 · HU-5)
 * Vista 5.2 — Coordinar punto y horario
 */
export default function CoordinarEntregaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { obtenerAcuerdoPorId, rolEnAcuerdo, estadoParaUsuario, proponerEncuentro, aceptarPropuesta } = useAcuerdo();

  const [punto, setPunto] = useState(usuarioActual?.puntoEncuentroPreferido || '');
  const [fechaIso, setFechaIso] = useState('');
  const [franja, setFranja] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [notificacion, setNotificacion] = useState(null);

  const usuarioId = usuarioActual?.id;
  const acuerdo = obtenerAcuerdoPorId(id);
  const rol = rolEnAcuerdo(acuerdo, usuarioId);
  if (!acuerdo || !rol) return <AcuerdoNoDisponible />;

  // Coordinar solo aplica mientras el acuerdo está en coordinación; después se ve el detalle.
  const estado = estadoParaUsuario(acuerdo, usuarioId);
  const enCoordinacion =
    estado === ESTADOS_ACUERDO.ESPERANDO_RESPUESTA || estado === ESTADOS_ACUERDO.PROPUESTA_RECIBIDA;
  if (!enCoordinacion) return <Navigate to={`/acuerdos/${acuerdo.id}`} replace />;

  const contraparte = datosContraparte(acuerdo, rol, obtenerUsuarioPorId);
  const propuestaRecibida = estado === ESTADOS_ACUERDO.PROPUESTA_RECIBIDA;
  const propuestaPropia = estado === ESTADOS_ACUERDO.ESPERANDO_RESPUESTA && Boolean(acuerdo.puntoEncuentro);

  const enviar = (e) => {
    e.preventDefault();
    const resultado = proponerEncuentro(acuerdo.id, usuarioId, {
      punto,
      fecha: isoAFecha(fechaIso),
      franja,
      mensaje
    });
    if (!resultado.ok) {
      setErrores(resultado.errores || {});
      setNotificacion({ tipo: 'error', mensaje: resultado.error });
      return;
    }
    setErrores({});
    setFechaIso('');
    setFranja('');
    setMensaje('');
    setNotificacion({ tipo: 'exito', mensaje: resultado.mensaje });
  };

  const aceptar = () => {
    const resultado = aceptarPropuesta(acuerdo.id, usuarioId);
    if (!resultado.ok) {
      setNotificacion({ tipo: 'error', mensaje: resultado.error });
      return;
    }
    navigate(`/acuerdos/${acuerdo.id}`, {
      state: { notificacion: { tipo: 'exito', mensaje: resultado.mensaje } }
    });
  };

  const detallePropuesta = (
    <>
      <h2 className="title-section">{acuerdo.puntoEncuentro}</h2>
      <p className="acu-fuerte">
        {acuerdo.fechaEncuentro} · {acuerdo.franjaHoraria}
      </p>
      {acuerdo.mensajePropuesta && <p className="acu-cita">«{acuerdo.mensajePropuesta}»</p>}
    </>
  );

  return (
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link to="/acuerdos">Mis acuerdos</Link> › <Link to={`/acuerdos/${acuerdo.id}`}>{acuerdo.id}</Link> ›{' '}
        <span>Coordinar la entrega</span>
      </nav>

      <div className="acu-encabezado">
        <div className="acu-encabezado-titulo">
          <h1 className="title-screen">Coordinar la entrega</h1>
          <BadgeEstado
            estado={estado}
            className=""
          />
          <span className="text-aux">
            {propuestaRecibida ? 'Te toca responder' : propuestaPropia ? `Esperando a ${primerNombre(contraparte.nombre)}` : 'Aún sin propuesta'}
          </span>
        </div>
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
          {propuestaRecibida && (
            <section className="acu-tarjeta card-surface">
              <span className="label-upper">Propuesta de la contraparte</span>
              {detallePropuesta}
              <p className="text-aux">
                {contraparte.nombre} · {contraparte.rolTexto} · {contraparte.carrera}{' '}
                {textoReputacion(contraparte.reputacion) && `· ${textoReputacion(contraparte.reputacion)}`}
              </p>
              <button type="button" className="btn btn-primary" onClick={aceptar}>
                Aceptar esta propuesta
              </button>
              <p className="text-aux">
                Al aceptar se genera el código de entrega para ambos.
              </p>
            </section>
          )}

          {propuestaPropia && (
            <section className="acu-tarjeta card-surface">
              <span className="label-upper">Tu propuesta</span>
              {detallePropuesta}
              <div className="notificacion-banner notif-info">
                <span>
                  <strong>Esperando respuesta.</strong> Si {primerNombre(contraparte.nombre)} no responde en 48
                  horas, el acuerdo se marca como pendiente y cualquiera de las partes puede cancelarlo sin penalidad.
                </span>
              </div>
            </section>
          )}

          {!propuestaPropia && (
            <form className="acu-tarjeta acu-formulario card-surface" onSubmit={enviar} noValidate>
              <h2 className="title-section">
                {propuestaRecibida ? 'Proponer una alternativa' : 'Proponer punto y horario'}
              </h2>

              <div className="form-group">
                <span className="label-upper" id="acu-label-punto">
                  Punto de encuentro
                </span>
                <div className="acu-chips" role="group" aria-labelledby="acu-label-punto">
                  {PUNTOS_ENCUENTRO.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      className={`chip chip-selectable ${punto === opcion ? 'active' : ''}`}
                      aria-pressed={punto === opcion}
                      onClick={() => setPunto(opcion)}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
                {errores.punto && <span className="field-error">{errores.punto}</span>}
              </div>

              <div className="form-group">
                <label className="label-upper" htmlFor="acu-fecha">
                  Fecha
                </label>
                <input
                  id="acu-fecha"
                  type="date"
                  className={`form-input ${errores.fecha ? 'input-error' : ''}`}
                  min={hoyIso()}
                  value={fechaIso}
                  onChange={(e) => setFechaIso(e.target.value)}
                  aria-invalid={Boolean(errores.fecha)}
                />
                {errores.fecha && <span className="field-error">{errores.fecha}</span>}
              </div>

              <div className="form-group">
                <span className="label-upper" id="acu-label-franja">
                  Franja horaria
                </span>
                <div className="acu-chips" role="group" aria-labelledby="acu-label-franja">
                  {FRANJAS_HORARIAS.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      className={`chip chip-selectable ${franja === opcion ? 'active' : ''}`}
                      aria-pressed={franja === opcion}
                      onClick={() => setFranja(opcion)}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
                {errores.franja && <span className="field-error">{errores.franja}</span>}
              </div>

              <div className="form-group">
                <label className="label-upper" htmlFor="acu-mensaje">
                  Mensaje (opcional)
                </label>
                <textarea
                  id="acu-mensaje"
                  rows={3}
                  maxLength={200}
                  className="form-textarea"
                  placeholder="¿Podría ser temprano en la Biblioteca?"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {propuestaRecibida ? 'Enviar alternativa' : 'Enviar propuesta'}
              </button>
            </form>
          )}
        </div>

        <aside className="acu-pila">
          <section className="acu-tarjeta card-surface">
            <span className="label-upper">Acuerdo {acuerdo.id}</span>
            <h2 className="subtitle">{acuerdo.avisoTitulo}</h2>
            <p className="price-text acu-fila-monto">
              {formatearPrecio(acuerdo.montoAcordado)} <span className="text-aux">monto acordado</span>
            </p>
          </section>

          <section className="acu-tarjeta card-surface">
            <h2 className="label-upper">Historial de la coordinación</h2>
            <TrazabilidadAcuerdo eventos={acuerdo.trazabilidad} />
          </section>

          {!propuestaPropia && (
            <p className="text-aux">
              Si nadie responde en 48 horas, el acuerdo se marca como pendiente y cualquiera de las partes puede
              cancelarlo sin penalidad.
            </p>
          )}
          <Link to={`/acuerdos/${acuerdo.id}`} className="btn btn-tertiary">
            Ver detalle del acuerdo
          </Link>
        </aside>
      </div>
    </div>
  );
}
