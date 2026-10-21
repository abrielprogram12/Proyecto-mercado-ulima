import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES_USUARIO } from '../../data/contratoDatos';
import Notificacion from '../../components/Notificacion/Notificacion';
import { CUENTAS_PRUEBA_LOGIN } from './visitanteUtils';
import './visitante.css';

/**
 * MÓDULO: Visitante y Acceso (Integrante 1 · HU-1)
 * Vista 1.2 y 1.8 — Inicio de sesión institucional
 */
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

  const clasesPassGrupo = [
    'vis-pass-grupo',
    errorCampoPassword ? 'con-error' : '',
    cargando ? 'deshabilitado' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="vis-login-layout">
      {/* Panel izquierdo — Vista 1.2 */}
      <div className="vis-login-izq">
        <div className="striped-placeholder vis-login-foto">
          <span className="vis-foto-etiqueta">fotografía · patio del campus</span>
        </div>

        <blockquote className="vis-login-cita">
          «Vendí mis libros de Cálculo en tres días y compré los de Física del ciclo
          siguiente.»
        </blockquote>
        <p className="text-aux">Rosa María Quispe Ríos · Administración</p>
      </div>

      {/* Panel derecho — Formulario de inicio de sesión (Vistas 1.2 y 1.8) */}
      <div className="vis-login-der">
        <div className="vis-login-caja">
          <h1 className="title-screen">Iniciar sesión</h1>
          <p className="text-aux vis-subtitulo-form">
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
              <div className={clasesPassGrupo}>
                <input
                  id="login-password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={cargando}
                  className="vis-pass-input"
                  required
                />
                <button
                  type="button"
                  disabled={cargando}
                  onClick={() => setMostrarPassword((prev) => !prev)}
                  className="vis-pass-toggle"
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errorCampoPassword && (
                <span className="field-error">{errorCampoPassword}</span>
              )}
            </div>

            <div className="vis-login-opciones">
              <label className="vis-check-label">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  disabled={cargando}
                  className="vis-check-input"
                />
                <span>Recordarme</span>
              </label>

              <Link
                to="/recuperar-password"
                className={`vis-link-fuerte ${
                  cargando ? 'vis-link-deshabilitado' : ''
                }`}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary vis-btn-bloque"
              disabled={cargando}
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
              <p className="field-hint vis-hint-centrado">
                El botón y los campos quedan deshabilitados mientras se validan las
                credenciales.
              </p>
            )}
          </form>

          <p className="vis-pie-registro">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="vis-link-fuerte">
              Crear cuenta
            </Link>
          </p>

          {/* Accesos rápidos para pruebas de cátedra */}
          <div className="vis-demo-seccion">
            <span className="label-upper">
              Cuentas de prueba (Contraseña: Password123)
            </span>
            <div className="vis-demo-chips">
              {CUENTAS_PRUEBA_LOGIN.map((cuenta) => (
                <button
                  key={cuenta.correo}
                  type="button"
                  className="chip chip-selectable"
                  onClick={() => rellenarCuentaDemo(cuenta.correo)}
                >
                  {cuenta.etiqueta}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
