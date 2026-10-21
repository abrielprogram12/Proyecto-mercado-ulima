import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../context/AuthContext';
import { CARRERAS_ULIMA, CICLOS_ULIMA } from '../../data/contratoDatos';
import Notificacion from '../../components/Notificacion/Notificacion';
import { validarFormularioRegistro } from './visitanteUtils';
import './visitante.css';

/**
 * MÓDULO: Visitante y Acceso (Integrante 1 · HU-1)
 * Vista 1.3 y 1.8 — Registro de cuenta institucional y pantalla de confirmación
 */
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

  const handleChange = (campo, valor) => {
    const actualizado = { ...formData, [campo]: valor };
    setFormData(actualizado);
    if (Object.keys(errores).length > 0) {
      setErrores(validarFormularioRegistro(actualizado, validarPasswordSegura));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validarFormularioRegistro(formData, validarPasswordSegura);
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
      <div className="page-container vis-contenedor-confirmacion">
        <div className="card-surface vis-tarjeta-confirmacion">
          <div className="vis-circulo-exito">✓</div>

          <h1 className="title-screen">Cuenta creada</h1>
          <p className="text-aux vis-texto-confirmacion">
            Enviamos un enlace de confirmación a{' '}
            <strong className="vis-texto-resaltado">{correoRegistrado}</strong>.
            Tienes 24 horas para activarla.
          </p>

          {notifReenvio && (
            <Notificacion
              tipo="exito"
              mensaje={notifReenvio}
              onClose={() => setNotifReenvio('')}
            />
          )}

          <Link to="/login" className="btn btn-primary vis-btn-bloque">
            Ir a iniciar sesión
          </Link>

          <button
            type="button"
            className="btn btn-tertiary vis-btn-bloque"
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
  const claseGrupoPass = [
    'vis-pass-grupo',
    errores.password ? 'con-error' : infoPassword.esValida ? 'con-exito' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="page-container vis-contenedor-registro">
      <div className="card-surface vis-tarjeta-amplia">
        <h1 className="title-screen">Crear cuenta</h1>
        <p className="text-aux vis-subtitulo-form">
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
          <div className="vis-registro-grid">
            {/* Nombres */}
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group vis-col-completa">
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
            <div className="form-group">
              <label className="label-upper" htmlFor="reg-pass">
                Contraseña
              </label>
              <div className={claseGrupoPass}>
                <input
                  id="reg-pass"
                  type={mostrarPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="vis-pass-input"
                />
                {infoPassword.esValida && (
                  <span className="vis-pass-check">✓</span>
                )}
                <button
                  type="button"
                  onClick={() => setMostrarPass((p) => !p)}
                  className="vis-pass-toggle"
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
            <div className="form-group">
              <label className="label-upper" htmlFor="reg-confirmar">
                Confirmar contraseña
              </label>
              <div
                className={`vis-pass-grupo ${
                  errores.confirmarPassword ? 'con-error' : ''
                }`}
              >
                <input
                  id="reg-confirmar"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  value={formData.confirmarPassword}
                  onChange={(e) => handleChange('confirmarPassword', e.target.value)}
                  className="vis-pass-input"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar((p) => !p)}
                  className="vis-pass-toggle"
                >
                  {mostrarConfirmar ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errores.confirmarPassword && (
                <span className="field-error">{errores.confirmarPassword}</span>
              )}
            </div>

            {/* Carrera */}
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="vis-col-completa">
              <label className="vis-check-label">
                <input
                  type="checkbox"
                  checked={formData.aceptaNormas}
                  onChange={(e) => handleChange('aceptaNormas', e.target.checked)}
                  className="vis-check-input"
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

          <div className="vis-acciones-derecha">
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
