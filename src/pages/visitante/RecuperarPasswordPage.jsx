import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../context/AuthContext';
import Notificacion from '../../components/Notificacion/Notificacion';

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

  const formatearTiempo = (totalSeg) => {
    const min = String(Math.floor(totalSeg / 60)).padStart(2, '0');
    const seg = String(totalSeg % 60).padStart(2, '0');
    return `${min}:${seg}`;
  };

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
    <div className="page-container" style={{ maxWidth: '580px' }}>
      {/* Barra de progreso de 3 pasos — Vista 1.4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        {[
          { num: 1, texto: 'Paso 1 · Correo' },
          { num: 2, texto: 'Paso 2 · Enlace' },
          { num: 3, texto: 'Paso 3 · Nueva contraseña' }
        ].map((item) => {
          const activo = paso === item.num;
          const completado = paso > item.num;
          return (
            <div
              key={item.num}
              style={{
                borderTop: `3px solid ${
                  activo || completado ? 'var(--color-primary)' : 'var(--color-border)'
                }`,
                paddingTop: '8px',
                fontSize: '12px',
                fontWeight: activo ? 700 : 400,
                color: activo ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
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

      <div className="card-surface" style={{ padding: '40px 38px' }}>
        {/* PASO 1 · Correo (Vista 1.4) */}
        {paso === 1 && (
          <form onSubmit={handleEnviarEnlace} noValidate>
            <h1 className="title-screen" style={{ marginBottom: '10px' }}>
              Ingresa tu correo institucional
            </h1>
            <p className="text-aux" style={{ fontSize: '14px', marginBottom: '24px' }}>
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

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px'
              }}
            >
              <Link to="/login" className="btn btn-tertiary" style={{ paddingLeft: 0 }}>
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
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-info-bg)',
                color: 'var(--color-info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginBottom: '16px'
              }}
            >
              ✉
            </div>

            <h1 className="title-screen" style={{ marginBottom: '8px' }}>
              Revisa tu correo
            </h1>
            <p className="text-aux" style={{ fontSize: '14px', marginBottom: '20px' }}>
              Enviamos el enlace a{' '}
              <strong style={{ color: 'var(--color-text)' }}>{correo}</strong>. Si no
              lo ves, revisa la carpeta de correo no deseado.
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-primary-soft)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-btn)',
                fontSize: '14px',
                color: 'var(--color-text)',
                marginBottom: '24px'
              }}
            >
              {segundosRestantes > 0 ? (
                <>
                  Puedes reenviar el enlace en{' '}
                  <strong>{formatearTiempo(segundosRestantes)}</strong>.
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-tertiary"
                  style={{ padding: 0 }}
                  onClick={() => setSegundosRestantes(161)}
                >
                  Reenviar enlace ahora
                </button>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px dashed var(--color-border)'
              }}
            >
              <button
                type="button"
                className="btn btn-tertiary"
                style={{ paddingLeft: 0 }}
                onClick={() =>
                  setNotificacion({
                    tipo: 'error',
                    titulo: 'Enlace vencido.',
                    mensaje: 'Solicita uno nuevo para continuar.'
                  })
                }
              >
                Simular enlace vencido
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setNotificacion(null);
                  setPaso(3);
                }}
              >
                Abrir enlace del correo (Paso 3) →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 · Crea tu nueva contraseña (Vista 1.8) */}
        {paso === 3 && (
          <form onSubmit={handleGuardarPassword} noValidate>
            <h1 className="title-screen" style={{ marginBottom: '20px' }}>
              Crea tu nueva contraseña
            </h1>

            <div className="form-group">
              <label className="label-upper" htmlFor="rec-nueva-pass">
                Nueva contraseña
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${
                    errorPass ? 'var(--color-error)' : 'var(--color-border)'
                  }`,
                  borderRadius: 'var(--radius-input)',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}
              >
                <input
                  id="rec-nueva-pass"
                  type={mostrarNueva ? 'text' : 'password'}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    border: 'none',
                    outline: 'none'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarNueva((p) => !p)}
                  style={{
                    padding: '0 14px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {mostrarNueva ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              {/* Barra de fortaleza de 4 segmentos (Vista 1.8) */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor:
                        infoSeguridad.puntaje >= seg
                          ? 'var(--color-success)'
                          : 'var(--color-border)'
                    }}
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              Guardar contraseña
            </button>
          </form>
        )}
      </div>

      {paso === 1 && (
        <p
          className="text-aux"
          style={{ textAlign: 'center', marginTop: '24px' }}
        >
          Si no recibes el correo en 5 minutos, revisa la carpeta de correo no deseado
          o escribe a <a href="mailto:tablon@ulima.edu.pe">tablon@ulima.edu.pe</a>.
        </p>
      )}
    </div>
  );
}
