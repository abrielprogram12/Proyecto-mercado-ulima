import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES_USUARIO } from '../../data/contratoDatos';
import { ILUSTRACION_HERO_CAMPUS } from '../../data/imagenesDatos';
import Notificacion from '../../components/Notificacion/Notificacion';
import './visitante.css';

export default function LoginPage() {
  const { login, obtenerCorreoRecordado } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('20201234@aloe.ulima.edu.pe');
  const [password, setPassword] = useState('Password123');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(true);

  const [cargando, setCargando] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState('');
  const [alertaGeneral, setAlertaGeneral] = useState(null);
  const [cuentaBloqueada, setCuentaBloqueada] = useState(false);

  useEffect(() => {
    const recordado = obtenerCorreoRecordado();
    if (recordado) {
      setCorreo(recordado);
    }
  }, []);

  const validarFormatoCorreo = (valor) => {
    const limpio = valor.trim().toLowerCase();
    if (!limpio) {
      return 'Ingresa tu correo institucional.';
    }
    if (!limpio.endsWith('@aloe.ulima.edu.pe') && limpio !== 'admin@ulima.edu.pe') {
      return 'El correo debe terminar en @aloe.ulima.edu.pe.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertaGeneral(null);
    setCuentaBloqueada(false);

    const errFormato = validarFormatoCorreo(correo);
    if (errFormato) {
      setErrorCorreo(errFormato);
      return;
    }
    setErrorCorreo('');
    setCargando(true);

    setTimeout(() => {
      const resultado = login({ correo, password, recordarme });
      setCargando(false);

      if (!resultado.ok) {
        if (resultado.bloqueado) {
          setCuentaBloqueada(true);
          setAlertaGeneral({
            tipo: 'error',
            titulo: 'Cuenta bloqueada.',
            mensaje:
              'Tu cuenta ha sido suspendida por incumplir las normas del tablón y no puede iniciar sesión.'
          });
        } else {
          setAlertaGeneral({
            tipo: 'error',
            titulo: 'No pudimos ingresar.',
            mensaje: `El correo o la contraseña no coinciden. Te quedan ${resultado.intentosRestantes} intentos antes del bloqueo temporal.`
          });
        }
        return;
      }

      if (resultado.usuario.rol === ROLES_USUARIO.ADMIN) {
        navigate('/admin/reportes');
      } else {
        navigate('/catalogo');
      }
    }, 350);
  };

  const seleccionarCuentaRapida = (emailCuenta) => {
    setErrorCorreo('');
    setCuentaBloqueada(false);
    setAlertaGeneral(null);
    setCorreo(emailCuenta);
    setPassword('Password123');
  };

  const claseGrupoPassword = [
    'vis-pass-grupo',
    alertaGeneral && !cuentaBloqueada ? 'con-error' : '',
    cargando || cuentaBloqueada ? 'deshabilitado' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="vis-login-layout">
      <div className="vis-login-izq">
        <div className="striped-placeholder vis-login-foto">
          <img
            src={ILUSTRACION_HERO_CAMPUS}
            alt="Ilustración del intercambio estudiantil ULima"
            className="media-img-cover"
          />
        </div>

        <blockquote className="vis-login-cita">
          «Compré mi Stewart de Cálculo I a mitad de precio y lo recogí en la
          Biblioteca el mismo día.»
        </blockquote>
        <span className="text-aux">
          Diego Vargas · Ingeniería de Sistemas · quinto ciclo
        </span>
      </div>

      <div className="vis-login-der">
        <div className="vis-login-caja">
          <h1 className="title-screen">Iniciar sesión</h1>
          <p className="text-aux vis-subtitulo-form">
            Usa tu correo institucional <strong>@aloe.ulima.edu.pe</strong>.
          </p>

          {alertaGeneral && (
            <Notificacion
              tipo={alertaGeneral.tipo}
              titulo={alertaGeneral.titulo}
              mensaje={alertaGeneral.mensaje}
              onClose={() => {
                setAlertaGeneral(null);
                setCuentaBloqueada(false);
              }}
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
                className={`form-input ${errorCorreo ? 'input-error' : ''}`}
                value={correo}
                disabled={cargando || cuentaBloqueada}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errorCorreo) setErrorCorreo('');
                }}
              />
              {errorCorreo && <span className="field-error">{errorCorreo}</span>}
            </div>

            <div className="form-group">
              <label className="label-upper" htmlFor="login-password">
                Contraseña
              </label>
              <div className={claseGrupoPassword}>
                <input
                  id="login-password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  disabled={cargando || cuentaBloqueada}
                  onChange={(e) => setPassword(e.target.value)}
                  className="vis-pass-input"
                />
                <button
                  type="button"
                  disabled={cargando || cuentaBloqueada}
                  onClick={() => setMostrarPassword((p) => !p)}
                  className="vis-pass-toggle"
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="vis-login-opciones">
              <label className="vis-check-label">
                <input
                  type="checkbox"
                  checked={recordarme}
                  disabled={cargando || cuentaBloqueada}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="vis-check-input"
                />
                <span>Recordarme</span>
              </label>

              <Link
                to="/recuperar-password"
                className={`vis-link-fuerte ${
                  cuentaBloqueada ? 'vis-link-deshabilitado' : ''
                }`}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary vis-btn-bloque"
              disabled={cargando || cuentaBloqueada}
            >
              {cargando ? (
                <>
                  <span className="spinner-inline" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                'Ingresar'
              )}
            </button>

            {cuentaBloqueada && (
              <p className="field-hint vis-hint-centrado">
                Si crees que es un error, escríbenos a{' '}
                <strong>tablon@ulima.edu.pe</strong>.
              </p>
            )}
          </form>

          <p className="vis-pie-registro">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="vis-link-fuerte">
              Crear cuenta
            </Link>
          </p>

          <div className="vis-demo-seccion">
            <span className="label-upper">
              Cuentas institucionales registradas (Contraseña: Password123)
            </span>
            <div className="vis-demo-chips">
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() =>
                  seleccionarCuentaRapida('20201234@aloe.ulima.edu.pe')
                }
              >
                Rosa Quispe (Usuario)
              </button>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() =>
                  seleccionarCuentaRapida('20204455@aloe.ulima.edu.pe')
                }
              >
                Diego Vargas (Usuario)
              </button>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() =>
                  seleccionarCuentaRapida('20208899@aloe.ulima.edu.pe')
                }
              >
                Lucía Ramírez (Usuario)
              </button>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() => seleccionarCuentaRapida('admin@ulima.edu.pe')}
              >
                Julio Mendoza (Admin)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
