import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { useCalificacion } from '../../../context/CalificacionContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import Estrellas from '../../../components/Estrellas/Estrellas';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../../components/Notificacion/Notificacion';
import { ASPECTOS_OPCIONES } from './reputacionUtils';
import './reputacion.css';

export default function CalificarContrapartePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerAcuerdoPorId, acuerdos } = useAcuerdo();
  const { publicarCalificacion } = useCalificacion();

  const acuerdo =
    obtenerAcuerdoPorId(id) ||
    acuerdos.find((a) => a.id === 'A-2201') ||
    acuerdos[0];

  const [puntaje, setPuntaje] = useState(5);
  const [aspectos, setAspectos] = useState([
    'Puntualidad',
    'Producto como se describía'
  ]);
  const [comentario, setComentario] = useState(
    'Llegó cinco minutos antes al patio del pabellón H y todo salió sin problemas. La recomiendo.'
  );
  const [errorPuntaje, setErrorPuntaje] = useState('');
  const [notificacion, setNotificacion] = useState(null);

  const toggleAspecto = (asp) => {
    setAspectos((prev) =>
      prev.includes(asp) ? prev.filter((x) => x !== asp) : [...prev, asp]
    );
  };

  const handlePublicar = (e) => {
    e.preventDefault();
    if (!puntaje || puntaje < 1) {
      setErrorPuntaje('Selecciona un puntaje para publicar tu calificación.');
      return;
    }
    setErrorPuntaje('');

    const res = publicarCalificacion({
      acuerdoId: acuerdo?.id || 'A-2201',
      avisoTitulo:
        acuerdo?.avisoTitulo || 'Juego de escuadras y escalímetro Faber',
      receptorId: acuerdo?.compradorId || 'u-6',
      receptorNombre: acuerdo?.compradorNombre || 'Carla Huamaní Bravo',
      receptorCarrera: acuerdo?.compradorCarrera || 'Arquitectura',
      puntaje,
      aspectos,
      comentario
    });

    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
      setTimeout(() => navigate('/calificaciones'), 1300);
    }
  };

  const nombreCorto = (acuerdo?.compradorNombre || 'Carla Huamaní').split(
    ' '
  )[0];

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/acuerdos">Mis acuerdos</Link>
        <span>›</span>
        <Link to={`/acuerdos/${acuerdo?.id || 'A-2201'}`}>
          {acuerdo?.id || 'A-2201'}
        </Link>
        <span>›</span>
        <span>Calificar</span>
      </div>

      {/* Grilla de 2 columnas — Vista 6.1 */}
      <div className="rep-rate-grid">
        {/* Columna izquierda: Formulario de calificación */}
        <form
          onSubmit={handlePublicar}
          className="card-surface rep-rate-form-card"
        >
          <h1 className="title-screen rep-rate-title">
            ¿Cómo te fue con {nombreCorto}?
          </h1>
          <p className="text-aux rep-rate-subtitle">
            Tu calificación es pública y ayuda a que el tablón siga siendo
            confiable.
          </p>

          {/* Resumen del acuerdo entregado */}
          <div className="card-surface rep-acuerdo-summary">
            <div className="striped-placeholder rep-acuerdo-thumb" />
            <div>
              <strong className="rep-acuerdo-title">
                {acuerdo?.avisoTitulo ||
                  'Juego de escuadras y escalímetro Faber'}
              </strong>
              <span className="text-aux rep-acuerdo-meta">
                Acuerdo {acuerdo?.id || 'A-2201'} · entregado el 01/09/2026 ·{' '}
                {acuerdo?.puntoEncuentro || 'Patio del pabellón H'}
              </span>
              <div>
                <strong className="price-text rep-acuerdo-price">
                  {formatearPrecio(acuerdo?.montoAcordado || 34)}
                </strong>{' '}
                <span className="text-aux">
                  compradora: {acuerdo?.compradorNombre || 'Carla Huamaní Bravo'}
                </span>
              </div>
            </div>
          </div>

          {/* Selector de puntaje */}
          <div className="form-group">
            <span className="label-upper">Tu puntaje</span>
            <div className="rep-stars-selector-wrap">
              <Estrellas
                valor={puntaje}
                interactivo
                onChange={(val) => {
                  setPuntaje(val);
                  setErrorPuntaje('');
                }}
                mostrarEtiqueta
                tamano="lg"
              />
            </div>
            <span className="field-hint">
              Puntual, respetuosa y cumplió con lo acordado.
            </span>
            {errorPuntaje && <span className="field-error">{errorPuntaje}</span>}
          </div>

          {/* Chips de aspectos positivos */}
          <div className="form-group">
            <span className="label-upper">¿Qué destacarías? (Opcional)</span>
            <div className="rep-aspectos-chips">
              {ASPECTOS_OPCIONES.map((asp) => (
                <button
                  key={asp}
                  type="button"
                  className={`chip chip-selectable ${
                    aspectos.includes(asp) ? 'active' : ''
                  }`}
                  onClick={() => toggleAspecto(asp)}
                >
                  {asp}
                </button>
              ))}
            </div>
          </div>

          {/* Comentario con contador de 300 caracteres */}
          <div className="form-group">
            <label className="label-upper">Comentario</label>
            <textarea
              rows={3}
              maxLength={300}
              className="form-textarea"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <span className="field-hint">
              {comentario.length}/300 caracteres. Evita datos personales.
            </span>
          </div>

          <div className="notificacion-banner notif-advertencia rep-deadline-banner">
            <span>
              <strong>Puedes editar tu calificación hasta el 08/09/2026</strong>{' '}
              (7 días después de la entrega). Luego queda fija.
            </span>
          </div>

          <div className="rep-form-actions">
            <Link to="/acuerdos" className="btn btn-tertiary">
              Calificar después
            </Link>
            <button type="submit" className="btn btn-primary">
              Publicar calificación
            </button>
          </div>
        </form>

        {/* Columna derecha: Estados del selector, Calificación publicada y Notificaciones */}
        <div className="rep-side-col">
          <div className="card-surface rep-side-card">
            <span className="label-upper rep-side-label">
              Selector de estrellas · estados
            </span>
            <div className="rep-states-list">
              <div className="rep-state-row">
                <Estrellas valor={0} tamano="sm" />
                <span className="text-aux">Sin puntaje (obligatorio)</span>
              </div>
              <div className="rep-state-row">
                <Estrellas valor={3} tamano="sm" />
                <span className="text-aux">3 de 5 — «Aceptable»</span>
              </div>
              <div className="rep-state-row">
                <Estrellas valor={5} tamano="sm" />
                <span className="text-aux">5 de 5 — «Excelente»</span>
              </div>
            </div>
            <button
              type="button"
              className="chip chip-selectable"
              onClick={() => {
                setPuntaje(0);
                setErrorPuntaje(
                  'Selecciona un puntaje para publicar tu calificación.'
                );
              }}
            >
              Probar estado sin puntaje
            </button>
          </div>

          <div className="card-surface rep-side-card">
            <span className="label-upper rep-side-label">
              Calificación ya publicada · dentro del plazo
            </span>
            <div className="rep-published-header">
              <div className="rep-published-stars">
                <Estrellas valor={5} tamano="sm" />
                <span className="text-aux">Publicada el 01/09/2026</span>
              </div>
              <BadgeEstado estado="Visible en su perfil" variante="success" />
            </div>
            <p className="rep-published-comment">
              Llegó cinco minutos antes al patio del pabellón H y todo salió sin
              problemas. La recomiendo.
            </p>
            <div className="rep-published-actions">
              <Link to="/calificaciones" className="btn btn-secondary btn-sm">
                Editar hasta el 08/09/2026
              </Link>
              <Link
                to="/calificaciones"
                className="btn btn-tertiary btn-sm rep-btn-danger-text"
              >
                Eliminar
              </Link>
            </div>
          </div>

          <div className="card-surface rep-side-card">
            <span className="label-upper rep-side-label">Notificaciones</span>
            {notificacion ? (
              <Notificacion
                tipo={notificacion.tipo}
                mensaje={notificacion.mensaje}
              />
            ) : (
              <Notificacion
                tipo="exito"
                titulo="Éxito."
                mensaje="Tu calificación se publicó en el perfil de Carla Huamaní."
              />
            )}
            <Notificacion
              tipo="error"
              titulo="Plazo vencido."
              mensaje="Ya no puedes editar esta calificación."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
