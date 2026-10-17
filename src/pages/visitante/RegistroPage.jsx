import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../context/AuthContext';
import { CARRERAS_ULIMA, CICLOS_ULIMA } from '../../data/contratoDatos';
import Notificacion from '../../components/Notificacion/Notificacion';

export default function RegistroPage() {
  const { registrarUsuario } = useAuth();

  const [formData, setFormData] = useState({
    nombres: 'Rosa María',
    apellidos: 'Quispe Ríos',
    correo: '',
    password: '',
    confirmarPassword: '',
    carrera: 'Administración',
    ciclo: 'Cuarto',
    aceptaNormas: true
  });

  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errores, setErrores] = useState({});
  const [cuentaCreada, setCuentaCreada] = useState(false);
  const [correoRegistrado, setCorreoRegistrado] = useState('');
  const [notifReenvio, setNotifReenvio] = useState('');

  const infoPassword = validarPasswordSegura(formData.password);

  const validarEnLinea = (datos) => {
    const nuevosErrores = {};

    if (!datos.nombres.trim()) {
      nuevosErrores.nombres = 'Ingresa tus nombres.';
    }
    if (!datos.apellidos.trim()) {
      nuevosErrores.apellidos = 'Ingresa tus apellidos.';
    }
    if (!datos.correo.trim()) {
      nuevosErrores.correo = 'El correo institucional es obligatorio.';
    } else if (!datos.correo.trim().toLowerCase().endsWith('@aloe.ulima.edu.pe')) {
      nuevosErrores.correo = 'El correo debe terminar en @aloe.ulima.edu.pe.';
    }

    if (!datos.password) {
      nuevosErrores.password = 'Ingresa una contraseña.';
    } else if (!validarPasswordSegura(datos.password).esValida) {
      nuevosErrores.password =
        'Debe tener al menos 8 caracteres, una mayúscula y un número.';
    }

    if (!datos.confirmarPassword || datos.confirmarPassword !== datos.password) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    if (!datos.carrera) {
      nuevosErrores.carrera = 'Selecciona tu carrera.';
    }

    if (!datos.ciclo) {
      nuevosErrores.ciclo = 'Selecciona tu ciclo.';
    }

    if (!datos.aceptaNormas) {
      nuevosErrores.aceptaNormas =
        'Debes aceptar las normas de convivencia del tablón.';
    }

    return nuevosErrores;
  };

  const handleChange = (campo, valor) => {
    const actualizado = { ...formData, [campo]: valor };
    setFormData(actualizado);
    if (Object.keys(errores).length > 0) {
      setErrores(validarEnLinea(actualizado));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validarEnLinea(formData);
    setErrores(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    const res = registrarUsuario({
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      correo: formData.correo,
      password: formData.password,
      carrera: formData.carrera,
      ciclo: formData.ciclo,
      aceptaNormas: formData.aceptaNormas
    });

    if (!res.ok) {
      setErrores({ [res.campo || 'correo']: res.error });
      return;
    }

    setCorreoRegistrado(res.usuario.correo);
    setCuentaCreada(true);
  };

  // Vista 1.8 — CUENTA CREADA · CONFIRMACIÓN
  if (cuentaCreada) {
    return (
      <div className="page-container" style={{ maxWidth: '540px' }}>
        <div
          className="card-surface"
          style={{ padding: '44px 36px', textAlign: 'center' }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              fontSize: '26px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}
          >
            ✓
          </div>

          <h1 className="title-screen" style={{ marginBottom: '12px' }}>
            Cuenta creada
          </h1>
          <p className="text-aux" style={{ fontSize: '15px', marginBottom: '26px' }}>
            Enviamos un enlace de confirmación a{' '}
            <strong style={{ color: 'var(--color-text)' }}>{correoRegistrado}</strong>.
            Tienes 24 horas para activarla.
          </p>

          {notifReenvio && (
            <Notificacion
              tipo="exito"
              mensaje={notifReenvio}
              onClose={() => setNotifReenvio('')}
            />
          )}

          <Link
            to="/login"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '14px' }}
          >
            Ir a iniciar sesión
          </Link>

          <button
            type="button"
            className="btn btn-tertiary"
            onClick={() =>
              setNotifReenvio(
                `Éxito. Reenviamos el enlace de confirmación a ${correoRegistrado}.`
              )
            }
          >
            Reenviar el correo de confirmación
          </button>
        </div>
      </div>
    );
  }

  const totalErrores = Object.keys(errores).length;

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div className="card-surface" style={{ padding: '40px 44px' }}>
        <h1 className="title-screen" style={{ marginBottom: '6px' }}>
          Crear cuenta
        </h1>
        <p className="text-aux" style={{ fontSize: '14px', marginBottom: '24px' }}>
          Solo para estudiantes con correo institucional. La cuenta se activa al
          confirmar el correo.
        </p>

        {totalErrores > 0 && (
          <Notificacion
            tipo="error"
            titulo={`Revisa ${totalErrores} ${
              totalErrores === 1 ? 'campo' : 'campos'
            }.`}
            mensaje="Corrige lo marcado en rojo para continuar."
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            {/* Nombres */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-nombres">
                Nombres
              </label>
              <input
                id="reg-nombres"
                type="text"
                className={`form-input ${errores.nombres ? 'input-error' : ''}`}
                value={formData.nombres}
                onChange={(e) => handleChange('nombres', e.target.value)}
              />
              {errores.nombres && (
                <span className="field-error">{errores.nombres}</span>
              )}
            </div>

            {/* Apellidos */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-apellidos">
                Apellidos
              </label>
              <input
                id="reg-apellidos"
                type="text"
                className={`form-input ${errores.apellidos ? 'input-error' : ''}`}
                value={formData.apellidos}
                onChange={(e) => handleChange('apellidos', e.target.value)}
              />
              {errores.apellidos && (
                <span className="field-error">{errores.apellidos}</span>
              )}
            </div>

            {/* Correo institucional */}
            <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-correo">
                Correo institucional
              </label>
              <input
                id="reg-correo"
                type="email"
                placeholder="20201234@aloe.ulima.edu.pe"
                className={`form-input ${errores.correo ? 'input-error' : ''}`}
                value={formData.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
              />
              {errores.correo && (
                <span className="field-error">{errores.correo}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-pass">
                Contraseña
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${
                    errores.password
                      ? 'var(--color-error)'
                      : infoPassword.esValida
                        ? 'var(--color-success)'
                        : 'var(--color-border)'
                  }`,
                  borderRadius: 'var(--radius-input)',
                  overflow: 'hidden'
                }}
              >
                <input
                  id="reg-pass"
                  type={mostrarPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    border: 'none',
                    outline: 'none'
                  }}
                />
                {infoPassword.esValida && (
                  <span
                    style={{
                      color: 'var(--color-success)',
                      fontWeight: 700,
                      marginRight: '8px'
                    }}
                  >
                    ✓
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setMostrarPass((p) => !p)}
                  style={{
                    padding: '0 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {mostrarPass ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errores.password ? (
                <span className="field-error">{errores.password}</span>
              ) : (
                <span
                  className={`field-hint ${
                    infoPassword.esValida ? 'hint-success' : ''
                  }`}
                >
                  Cumple los 8 caracteres, una mayúscula y un número.
                </span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-confirmar">
                Confirmar contraseña
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${
                    errores.confirmarPassword
                      ? 'var(--color-error)'
                      : 'var(--color-border)'
                  }`,
                  borderRadius: 'var(--radius-input)',
                  overflow: 'hidden'
                }}
              >
                <input
                  id="reg-confirmar"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  value={formData.confirmarPassword}
                  onChange={(e) => handleChange('confirmarPassword', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    border: 'none',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar((p) => !p)}
                  style={{
                    padding: '0 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {mostrarConfirmar ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errores.confirmarPassword && (
                <span className="field-error">{errores.confirmarPassword}</span>
              )}
            </div>

            {/* Carrera */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-carrera">
                Carrera
              </label>
              <select
                id="reg-carrera"
                className={`form-select ${errores.carrera ? 'input-error' : ''}`}
                value={formData.carrera}
                onChange={(e) => handleChange('carrera', e.target.value)}
              >
                {CARRERAS_ULIMA.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errores.carrera && (
                <span className="field-error">{errores.carrera}</span>
              )}
            </div>

            {/* Ciclo */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-upper" htmlFor="reg-ciclo">
                Ciclo
              </label>
              <select
                id="reg-ciclo"
                className={`form-select ${errores.ciclo ? 'input-error' : ''}`}
                value={formData.ciclo}
                onChange={(e) => handleChange('ciclo', e.target.value)}
              >
                {CICLOS_ULIMA.map((ci) => (
                  <option key={ci} value={ci}>
                    {ci}
                  </option>
                ))}
              </select>
              {errores.ciclo && (
                <span className="field-error">{errores.ciclo}</span>
              )}
            </div>

            {/* Normas de convivencia */}
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.aceptaNormas}
                  onChange={(e) => handleChange('aceptaNormas', e.target.checked)}
                  style={{
                    width: '17px',
                    height: '17px',
                    accentColor: 'var(--color-primary)'
                  }}
                />
                <span>
                  Acepto las normas de convivencia del tablón y el registro de mis
                  acuerdos.
                </span>
              </label>
              {errores.aceptaNormas && (
                <span className="field-error">{errores.aceptaNormas}</span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '20px',
              marginTop: '28px'
            }}
          >
            <Link to="/login" className="btn btn-tertiary">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary">
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
