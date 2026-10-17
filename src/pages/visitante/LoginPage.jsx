import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES_USUARIO } from '../../data/contratoDatos';
import Notificacion from '../../components/Notificacion/Notificacion';

export default function LoginPage() {
  const { login, obtenerCorreoRecordado } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('20201234@aloe.ulima.edu.pe');
  const [password, setPassword] = useState('Password123');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(true);

  const [cargando, setCargando] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [errorCampoPassword, setErrorCampoPassword] = useState('');
  const [errorCampoCorreo, setErrorCampoCorreo] = useState('');

  useEffect(() => {
    const guardado = obtenerCorreoRecordado();
    if (guardado) {
      setCorreo(guardado);
      setRecordarme(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorBanner('');
    setErrorCampoPassword('');
    setErrorCampoCorreo('');

    const correoLimpio = correo.trim().toLowerCase();
    if (
      !correoLimpio.endsWith('@aloe.ulima.edu.pe') &&
      correoLimpio !== 'admin@ulima.edu.pe'
    ) {
      setErrorCampoCorreo('El correo debe terminar en @aloe.ulima.edu.pe.');
      return;
    }

    setCargando(true);

    setTimeout(() => {
      const resultado = login({
        correo: correoLimpio,
        password,
        recordarme
      });

      setCargando(false);

      if (!resultado.ok) {
        setErrorBanner(resultado.error);
        if (!resultado.bloqueado) {
          setErrorCampoPassword('Verifica tu contraseña.');
        }
        return;
      }

      if (resultado.usuario.rol === ROLES_USUARIO.ADMIN) {
        navigate('/admin/reportes');
      } else {
        navigate('/mi-cuenta');
      }
    }, 900);
  };

  const rellenarCuentaDemo = (correoDemo, passDemo = 'Password123') => {
    setCorreo(correoDemo);
    setPassword(passDemo);
    setErrorBanner('');
    setErrorCampoPassword('');
    setErrorCampoCorreo('');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 130px)'
      }}
    >
      {/* Panel izquierdo — Vista 1.2 */}
      <div
        style={{
          backgroundColor: 'var(--color-primary-soft)',
          padding: '64px 72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid var(--color-border)'
        }}
      >
        <div
          className="striped-placeholder"
          style={{
            width: '100%',
            height: '320px',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-border)',
            marginBottom: '28px'
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(253, 250, 247, 0.85)',
              padding: '6px 14px',
              borderRadius: '6px'
            }}
          >
            fotografía · patio del campus
          </span>
        </div>

        <blockquote
          style={{
            fontSize: '22px',
            lineHeight: '30px',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: '10px'
          }}
        >
          «Vendí mis libros de Cálculo en tres días y compré los de Física del ciclo
          siguiente.»
        </blockquote>
        <p className="text-aux" style={{ fontSize: '14px' }}>
          Rosa María Quispe Ríos · Administración
        </p>
      </div>

      {/* Panel derecho — Formulario de inicio de sesión (Vistas 1.2 y 1.8) */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '64px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 className="title-screen" style={{ marginBottom: '10px' }}>
            Iniciar sesión
          </h1>
          <p className="text-aux" style={{ fontSize: '14px', marginBottom: '24px' }}>
            Usa tu correo institucional @aloe.ulima.edu.pe para ofertar, publicar y
            coordinar entregas.
          </p>

          {errorBanner && (
            <Notificacion
              tipo="error"
              mensaje={errorBanner}
              onClose={() => setErrorBanner('')}
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="label-upper" htmlFor="login-correo">
                Correo institucional
              </label>
              <input
                id="login-correo"
                type="email"
                className={`form-input ${
                  errorCampoCorreo || errorBanner ? 'input-error' : ''
                }`}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={cargando}
                required
              />
              {errorCampoCorreo && (
                <span className="field-error">{errorCampoCorreo}</span>
              )}
            </div>

            <div className="form-group">
              <label className="label-upper" htmlFor="login-password">
                Contraseña
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${
                    errorCampoPassword ? 'var(--color-error)' : 'var(--color-border)'
                  }`,
                  borderRadius: 'var(--radius-input)',
                  backgroundColor: cargando
                    ? 'var(--color-neutral)'
                    : 'var(--color-surface)',
                  overflow: 'hidden'
                }}
              >
                <input
                  id="login-password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={cargando}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text)'
                  }}
                  required
                />
                <button
                  type="button"
                  disabled={cargando}
                  onClick={() => setMostrarPassword((prev) => !prev)}
                  style={{
                    padding: '0 16px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: cargando ? 'not-allowed' : 'pointer'
                  }}
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errorCampoPassword && (
                <span className="field-error">{errorCampoPassword}</span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '22px',
                fontSize: '14px'
              }}
            >
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: cargando ? 'not-allowed' : 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  disabled={cargando}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--color-primary)'
                  }}
                />
                <span>Recordarme</span>
              </label>

              <Link
                to="/recuperar-password"
                style={{
                  fontWeight: 600,
                  fontSize: '14px',
                  pointerEvents: cargando ? 'none' : 'auto'
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
              style={{ width: '100%', padding: '13px' }}
            >
              {cargando ? (
                <>
                  <span className="spinner-inline" />
                  <span>Verificando...</span>
                </>
              ) : (
                'Ingresar'
              )}
            </button>

            {cargando && (
              <p className="field-hint" style={{ textAlign: 'center', marginTop: '8px' }}>
                El botón y los campos quedan deshabilitados mientras se validan las
                credenciales.
              </p>
            )}
          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: '22px',
              fontSize: '14px',
              color: 'var(--color-text-secondary)'
            }}
          >
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ fontWeight: 600 }}>
              Crear cuenta
            </Link>
          </p>

          {/* Accesos rápidos para pruebas de cátedra */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '16px',
              borderTop: '1px dashed var(--color-border)'
            }}
          >
            <span className="label-upper" style={{ marginBottom: '8px' }}>
              Cuentas de prueba (Contraseña: Password123)
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() => rellenarCuentaDemo('20201234@aloe.ulima.edu.pe')}
              >
                Rosa Quispe (Usuario)
              </button>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() => rellenarCuentaDemo('admin@ulima.edu.pe')}
              >
                Julio Mendoza (Admin)
              </button>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() => rellenarCuentaDemo('20189922@aloe.ulima.edu.pe')}
              >
                Marco Loayza (Bloqueado)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
