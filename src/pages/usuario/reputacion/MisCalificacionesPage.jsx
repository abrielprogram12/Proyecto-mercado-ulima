import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { useCalificacion } from '../../../context/CalificacionContext';
import { obtenerPortadaAviso } from '../../../data/imagenesDatos';
import Estrellas from '../../../components/Estrellas/Estrellas';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import { obtenerInicialesDeNombre } from './reputacionUtils';
import './reputacion.css';

export default function MisCalificacionesPage() {
  const { usuarioActual } = useAuth();
  const { avisos } = useAviso();
  const { obtenerAcuerdosDeUsuario } = useAcuerdo();
  const {
    calificaciones,
    editarCalificacion,
    eliminarCalificacion
  } = useCalificacion();
  const navigate = useNavigate();

  const [pestanaActiva, setPestanaActiva] = useState('Emitidas');
  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicion, setTextoEdicion] = useState('');
  const [puntajeEdicion, setPuntajeEdicion] = useState(5);
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);
  const [notificacion, setNotificacion] = useState(null);

  const usuarioId = usuarioActual?.id || 'u-1';

  const emitidas = useMemo(() => {
    return calificaciones.filter((c) => c.emisorId === usuarioId);
  }, [calificaciones, usuarioId]);

  const recibidas = useMemo(() => {
    return calificaciones.filter((c) => c.receptorId === usuarioId);
  }, [calificaciones, usuarioId]);

  const acuerdosPendientesDeCalificar = useMemo(() => {
    const misAcuerdos = obtenerAcuerdosDeUsuario(usuarioId);
    return misAcuerdos.filter(
      (a) =>
        a.estado === 'Entregado' &&
        !emitidas.some((c) => c.acuerdoId === a.id)
    );
  }, [obtenerAcuerdosDeUsuario, usuarioId, emitidas]);

  const obtenerMiniatura = (avisoId, avisoTitulo) => {
    const encontrado =
      avisos.find((a) => a.id === avisoId) ||
      avisos.find((a) =>
        (a.titulo || '').toLowerCase().includes((avisoTitulo || '').toLowerCase().slice(0, 15))
      );
    return obtenerPortadaAviso(
      encontrado || { id: avisoId || 'av-103', titulo: avisoTitulo }
    );
  };

  const iniciarEdicion = (cal) => {
    setEditandoId(cal.id);
    setTextoEdicion(cal.comentario);
    setPuntajeEdicion(cal.puntaje);
  };

  const guardarEdicion = (id) => {
    const res = editarCalificacion(id, {
      puntaje: puntajeEdicion,
      comentario: textoEdicion
    });
    setEditandoId(null);
    if (res.ok) {
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

  const confirmarEliminacion = () => {
    if (!confirmarEliminarId) return;
    const res = eliminarCalificacion(confirmarEliminarId);
    setConfirmarEliminarId(null);
    if (res.ok) {
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

  return (
    <div className="page-container">
      <h1 className="title-screen rep-page-title">Mis calificaciones</h1>

      <div className="rep-tabs-bar">
        <button
          type="button"
          onClick={() => setPestanaActiva('Emitidas')}
          className={`rep-tab-btn ${
            pestanaActiva === 'Emitidas' ? 'rep-tab-btn--active' : ''
          }`}
        >
          Emitidas · {emitidas.length}
        </button>

        <button
          type="button"
          onClick={() => setPestanaActiva('Recibidas')}
          className={`rep-tab-btn ${
            pestanaActiva === 'Recibidas' ? 'rep-tab-btn--active' : ''
          }`}
        >
          Recibidas · {recibidas.length}
        </button>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="rep-my-grid">
        <div className="rep-my-list">
          {pestanaActiva === 'Emitidas' ? (
            emitidas.length === 0 && acuerdosPendientesDeCalificar.length === 0 && usuarioId !== 'u-1' ? (
              <EstadoVacio
                icono="★"
                titulo="Todavía no has calificado a nadie"
                descripcion="Cuando confirmes una entrega en el campus podrás calificar a la otra parte."
                textoBoton="Ver mis acuerdos"
                rutaBoton="/acuerdos"
              />
            ) : (
              <>
                {emitidas.map((cal) => {
                  const thumb = obtenerMiniatura(cal.avisoId, cal.avisoTitulo);
                  return (
                    <div key={cal.id} className="card-surface rep-my-card">
                      <div className="rep-my-card-header">
                        <div className="rep-my-card-left">
                          <div className="striped-placeholder rep-my-thumb">
                            <img
                              src={thumb}
                              alt={cal.avisoTitulo}
                              className="media-img-cover"
                            />
                          </div>
                          <div>
                            <strong className="rep-my-aviso-title">
                              {cal.avisoTitulo}
                            </strong>
                            <span className="text-aux">
                              {cal.acuerdoId} · a {cal.receptorNombre} · {cal.fecha}
                            </span>
                          </div>
                        </div>

                        <Estrellas valor={cal.puntaje} tamano="sm" />
                      </div>

                      {editandoId === cal.id ? (
                        <div className="rep-edit-box">
                          <div className="rep-edit-stars">
                            <Estrellas
                              valor={puntajeEdicion}
                              interactivo
                              onChange={setPuntajeEdicion}
                            />
                          </div>
                          <textarea
                            rows={2}
                            className="form-textarea rep-edit-textarea"
                            value={textoEdicion}
                            onChange={(e) => setTextoEdicion(e.target.value)}
                          />
                          <div className="rep-edit-actions">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => guardarEdicion(cal.id)}
                            >
                              Guardar cambios
                            </button>
                            <button
                              type="button"
                              className="btn btn-tertiary btn-sm"
                              onClick={() => setEditandoId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="rep-my-comment">{cal.comentario}</p>

                          <div className="rep-my-footer">
                            {cal.dentroDePlazo ? (
                              <>
                                <BadgeEstado
                                  estado={`Editable hasta el ${
                                    cal.editableHasta || '08/09/2026'
                                  }`}
                                  variante="warning"
                                />
                                <div className="rep-my-footer-actions">
                                  <button
                                    type="button"
                                    className="btn btn-tertiary btn-sm"
                                    onClick={() => iniciarEdicion(cal)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-tertiary btn-sm rep-btn-danger-text"
                                    onClick={() => setConfirmarEliminarId(cal.id)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </>
                            ) : (
                              <BadgeEstado
                                estado="Plazo de edición vencido"
                                variante="neutral"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {acuerdosPendientesDeCalificar.map((ac) => {
                  const contraparte =
                    ac.vendedorId === usuarioId
                      ? ac.compradorNombre
                      : ac.vendedorNombre;
                  const thumb = obtenerMiniatura(ac.avisoId, ac.avisoTitulo);
                  return (
                    <div key={ac.id} className="card-surface rep-pending-card">
                      <div className="rep-my-card-left">
                        <div className="striped-placeholder rep-my-thumb">
                          <img
                            src={thumb}
                            alt={ac.avisoTitulo}
                            className="media-img-cover"
                          />
                        </div>
                        <div>
                          <strong className="rep-my-aviso-title">
                            {ac.avisoTitulo}
                          </strong>
                          <span className="text-aux">
                            {ac.id} · a {contraparte} · entregado el{' '}
                            {ac.fechaEncuentro || '26/08/2026'}
                          </span>
                        </div>
                      </div>

                      <div className="rep-pending-right">
                        <BadgeEstado
                          estado="Pendiente de calificar"
                          variante="info"
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/acuerdos/${ac.id}/calificar`)}
                        >
                          Calificar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {usuarioId === 'u-1' && (
                  <div className="card-surface rep-pending-card">
                    <div className="rep-my-card-left">
                      <div className="striped-placeholder rep-my-thumb">
                        <img
                          src={obtenerMiniatura('av-104', 'Apuntes de Contabilidad General')}
                          alt="Apuntes de Contabilidad General"
                          className="media-img-cover"
                        />
                      </div>
                      <div>
                        <strong className="rep-my-aviso-title">
                          Apuntes de Contabilidad General
                        </strong>
                        <span className="text-aux">
                          A-2044 · a Paola Zegarra Ibáñez · entregado el 19/08/2026
                        </span>
                      </div>
                    </div>

                    <div className="rep-pending-right">
                      <BadgeEstado
                        estado="Pendiente de calificar"
                        variante="info"
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate('/acuerdos/A-2201/calificar')}
                      >
                        Calificar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          ) : recibidas.length === 0 ? (
            <EstadoVacio
              icono="★"
              titulo="Todavía no has recibido calificaciones"
              descripcion="Cuando cierres acuerdos de entrega en el campus, tus contrapartes podrán calificarte."
              textoBoton="Ver mis acuerdos"
              rutaBoton="/acuerdos"
            />
          ) : (
            recibidas.map((cal) => (
              <div key={cal.id} className="card-surface rep-my-card">
                <div className="rep-received-header">
                  <div>
                    <strong>{cal.emisorNombre}</strong>
                    <span className="text-aux rep-received-meta">
                      {cal.acuerdoId} · {cal.avisoTitulo} · {cal.fecha}
                    </span>
                  </div>
                  <Estrellas valor={cal.puntaje} tamano="sm" />
                </div>
                <p className="rep-review-text">{cal.comentario}</p>
              </div>
            ))
          )}
        </div>

        <div className="rep-my-side-col">
          <div className="card-surface rep-my-side-card">
            <span className="label-upper rep-my-side-label">
              Resumen de «Recibidas»
            </span>

            <div className="rep-my-side-summary">
              <div className="rep-my-side-score-wrap">
                <strong className="rep-my-side-score">
                  {usuarioActual?.reputacion || 4.8}
                </strong>
                <div>
                  <Estrellas
                    valor={Math.round(usuarioActual?.reputacion || 5)}
                    tamano="sm"
                  />
                  <span className="text-aux rep-score-count">
                    promedio de {usuarioActual?.totalCalificaciones || recibidas.length || 11}{' '}
                    calificaciones
                  </span>
                </div>
              </div>
              {(usuarioActual?.acuerdosCerrados || 12) >= 10 && (
                <BadgeEstado estado="Vendedora confiable" />
              )}
            </div>

            {recibidas.slice(0, 2).map((cal) => {
              const ini = obtenerInicialesDeNombre(cal.emisorNombre);
              return (
                <div key={cal.id} className="rep-mini-review">
                  <div className="rep-mini-review-top">
                    <div className="rep-mini-review-author">
                      <div className="rep-mini-avatar">{ini}</div>
                      <div>
                        <strong className="rep-mini-author-name">
                          {cal.emisorNombre}
                        </strong>
                        <span className="text-aux rep-mini-meta">
                          {cal.acuerdoId} · {cal.fecha}
                        </span>
                      </div>
                    </div>
                    <Estrellas valor={cal.puntaje} tamano="sm" />
                  </div>
                  <p className="rep-mini-comment">{cal.comentario}</p>
                </div>
              );
            })}

            <p className="text-aux rep-side-note">
              Las calificaciones recibidas no se pueden editar ni eliminar.
            </p>
          </div>
        </div>
      </div>

      {confirmarEliminarId && (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmarEliminarId(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title rep-modal-title">
              ¿Eliminar esta calificación?
            </h3>
            <p className="text-aux rep-modal-desc">
              Esta acción retirará tu comentario del perfil público de la
              contraparte.
            </p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setConfirmarEliminarId(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-destructive"
                onClick={confirmarEliminacion}
              >
                Eliminar calificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
