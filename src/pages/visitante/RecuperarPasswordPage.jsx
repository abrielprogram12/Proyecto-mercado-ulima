import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../context/AuthContext';
import Notificacion from '../../components/Notificacion/Notificacion';
import { PASOS_RECUPERACION, formatearTiempoMMSS } from './visitanteUtils';
import './visitante.css';

/**
 * MÓDULO: Visitante y Acceso (Integrante 1 · HU-1)
 * Vista 1.4 y 1.8 — Flujo de 3 pasos para recuperar contraseña
 */
export default function RecuperarPasswordPage() {
  const { solicitarEnlaceRecuperacion, restablecerPassword } = useAuth();
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('20201234@aloe.ulima.edu.pe');
  const [errorCorreo, setErrorCorreo] = useState('');

  // Temporizador para el Paso 2 (02:41 = 161 segundos)
  const [segundosRestantes, setSegundosRestantes] = useState(161);

  // Paso 3
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    if (paso !== 2 || segundosRestantes <= 0) return;
    const timer = setInterval(() => {
      setSegundosRestantes((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [paso, segundosRestantes]);

  const handleEnviarEnlace = (e) => {
    e.preventDefault();
    setErrorCorreo('');
    const res = solicitarEnlaceRecuperacion(correo);
    if (!res.ok) {
      setErrorCorreo(res.error);
      return;
    }
    setSegundosRestantes(161);
    setPaso(2);
  };

  const handleGuardarPassword = (e) => {
    e.preventDefault();
    setErrorPass('');
    setNotificacion(null);

    const val = validarPasswordSegura(nuevaPassword);
    if (!val.esValida) {
      setErrorPass('Mínimo 8 caracteres, con una mayúscula y un número.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setErrorPass('Las contraseñas no coinciden.');
      return;
    }

    const res = restablecerPassword({ correo, nuevaPassword });
    if (!res.ok) {
      setErrorPass(res.error);
      return;
    }

    setNotificacion({
      tipo: 'exito',
      titulo: 'Listo.',
      mensaje: 'Ya puedes iniciar sesión con tu nueva contraseña.'
    });

    setTimeout(() => {
      navigate('/login');
    }, 1800);
  };

  const infoSeguridad = validarPasswordSegura(nuevaPassword);

  return (
    <div className="page-container vis-contenedor-recuperar">
      {/* Barra de progreso de 3 pasos — Vista 1.4 */}
      <div className="vis-pasos-barra">
        {PASOS_RECUPERACION.map((item) => {
          const estadoClase =
            paso === item.num ? 'activo' : paso > item.num ? 'completado' : '';
          return (
            <div
              key={item.num}
              className={`vis-paso-indicador ${estadoClase}`}
            >
              {item.texto}
            </div>
          );
        })}
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="card-surface vis-tarjeta-amplia">
        {/* PASO 1 · Correo (Vista 1.4) */}
        {paso === 1 && (
          <form onSubmit={handleEnviarEnlace} noValidate>
            <h1 className="title-screen">Ingresa tu correo institucional</h1>
            <p className="text-aux vis-subtitulo-form">
              Te enviaremos un enlace para crear una nueva contraseña. El enlace vence
              en 30 minutos.
            </p>

            <div className="form-group">
              <label className="label-upper" htmlFor="rec-correo">
                Correo institucional
              </label>
              <input
                id="rec-correo"
                type="email"
                className={`form-input ${errorCorreo ? 'input-error' : ''}`}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              {errorCorreo && <span className="field-error">{errorCorreo}</span>}
            </div>

            <div className="vis-acciones-entre">
              <Link
                to="/login"
                className="btn btn-tertiary vis-btn-sin-padding-izq"
              >
                Volver al inicio de sesión
              </Link>
              <button type="submit" className="btn btn-primary">
                Enviar enlace
              </button>
            </div>
          </form>
        )}

        {/* PASO 2 · Revisa tu correo (Vista 1.8) */}
        {paso === 2 && (
          <div>
            <div className="vis-circulo-correo">✉</div>

            <h1 className="title-screen">Revisa tu correo</h1>
            <p className="text-aux vis-subtitulo-form">
              Enviamos el enlace a{' '}
              <strong className="vis-texto-resaltado">{correo}</strong>. Si no lo ves,
              revisa la carpeta de correo no deseado.
            </p>

            <div className="vis-caja-reenvio">
              {segundosRestantes > 0 ? (
                <>
                  Puedes reenviar el enlace en{' '}
                  <strong>{formatearTiempoMMSS(segundosRestantes)}</strong>.
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-tertiary vis-btn-sin-padding-izq"
                  onClick={() => setSegundosRestantes(161)}
                >
                  Reenviar enlace ahora
                </button>
              )}
            </div>

            <div className="vis-pie-simulacion">
              <Link
                to="/login"
                className="btn btn-tertiary vis-btn-sin-padding-izq"
              >
                Volver al inicio de sesión
              </Link>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setNotificacion(null);
                  setPaso(3);
                }}
              >
                Continuar al restablecimiento →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 · Crea tu nueva contraseña (Vista 1.8) */}
        {paso === 3 && (
          <form onSubmit={handleGuardarPassword} noValidate>
            <h1 className="title-screen vis-espacio-abajo">
              Crea tu nueva contraseña
            </h1>

            <div className="form-group">
              <label className="label-upper" htmlFor="rec-nueva-pass">
                Nueva contraseña
              </label>
              <div
                className={`vis-pass-grupo ${errorPass ? 'con-error' : ''}`}
              >
                <input
                  id="rec-nueva-pass"
                  type={mostrarNueva ? 'text' : 'password'}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="vis-pass-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarNueva((p) => !p)}
                  className="vis-pass-toggle"
                >
                  {mostrarNueva ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              {/* Barra de fortaleza de 4 segmentos (Vista 1.8) */}
              <div className="vis-fortaleza-barra">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={`vis-fortaleza-segmento ${
                      infoSeguridad.puntaje >= seg ? 'activo' : ''
                    }`}
                  />
                ))}
              </div>
              <span className="field-hint">
                Mínimo 8 caracteres, con una mayúscula y un número.
              </span>
            </div>

            <div className="form-group">
              <label className="label-upper" htmlFor="rec-confirmar-pass">
                Confirmar contraseña
              </label>
              <input
                id="rec-confirmar-pass"
                type="password"
                className={`form-input ${errorPass ? 'input-error' : ''}`}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
              />
              {errorPass && <span className="field-error">{errorPass}</span>}
            </div>

            <button type="submit" className="btn btn-primary vis-btn-bloque">
              Guardar contraseña
            </button>
          </form>
        )}
      </div>

      {paso === 1 && (
        <p className="text-aux vis-nota-pie">
          Si no recibes el correo en 5 minutos, revisa la carpeta de correo no deseado
          o contacta a la mesa de ayuda en <strong>tablon@ulima.edu.pe</strong>.
        </p>
      )}
    </div>
  );
}
