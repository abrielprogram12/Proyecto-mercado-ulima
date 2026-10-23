import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../../context/AuthContext';
import {
  CARRERAS_ULIMA,
  CICLOS_ULIMA,
  PUNTOS_ENCUENTRO,
  obtenerIniciales
} from '../../../data/contratoDatos';
import { leerArchivoImagen } from '../../../data/imagenesDatos';
import Notificacion from '../../../components/Notificacion/Notificacion';
import './cuenta.css';

export default function MiCuentaPage() {
  const { usuarioActual, actualizarDatosCuenta, cambiarPassword, logout } =
    useAuth();
  const navigate = useNavigate();
  const inputFotoRef = useRef(null);

  const [datos, setDatos] = useState({
    nombres: usuarioActual?.nombres || 'Rosa María',
    apellidos: usuarioActual?.apellidos || 'Quispe Ríos',
    carrera: usuarioActual?.carrera || 'Administración',
    ciclo: usuarioActual?.ciclo || 'Cuarto',
    telefono: usuarioActual?.telefono || '987 654 321',
    puntoEncuentroPreferido:
      usuarioActual?.puntoEncuentroPreferido || 'Biblioteca'
  });

  const [passwords, setPasswords] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });

  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [notificacion, setNotificacion] = useState(null);

  const handleGuardarDatos = (e) => {
    e.preventDefault();
    const res = actualizarDatosCuenta(datos);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        titulo: 'Éxito.',
        mensaje: 'Los datos de tu cuenta se actualizaron correctamente.'
      });
    }
  };

  const handleSeleccionarPunto = (punto) => {
    const actualizado = { ...datos, puntoEncuentroPreferido: punto };
    setDatos(actualizado);
    actualizarDatosCuenta({ puntoEncuentroPreferido: punto });
    setNotificacion({
      tipo: 'exito',
      titulo: 'Punto preferido actualizado.',
      mensaje: `Se preseleccionará «${punto}» cuando coordines un acuerdo.`
    });
  };

  const handleSubirFotografia = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await leerArchivoImagen(file);
    e.target.value = '';

    if (!res.ok) {
      setNotificacion({
        tipo: 'error',
        titulo: 'No se pudo cargar la fotografía.',
        mensaje: res.error
      });
      return;
    }

    actualizarDatosCuenta({ fotoPerfil: res.url });
    setNotificacion({
      tipo: 'exito',
      titulo: 'Fotografía actualizada.',
      mensaje: `Tu foto de perfil («${res.nombre}») se guardó correctamente.`
    });
  };

  const handleQuitarFotografia = () => {
    actualizarDatosCuenta({ fotoPerfil: null });
    setNotificacion({
      tipo: 'info',
      titulo: 'Fotografía retirada.',
      mensaje: 'Se restauró tu avatar con tus iniciales institucionales.'
    });
  };

  const handleGuardarPassword = (e) => {
    e.preventDefault();
    setErrorPass('');

    if (!passwords.passwordActual) {
      setErrorPass('Ingresa tu contraseña actual.');
      return;
    }

    const val = validarPasswordSegura(passwords.nuevaPassword);
    if (!val.esValida) {
      setErrorPass('Mínimo 8 caracteres, una mayúscula y un número.');
      return;
    }

    if (passwords.nuevaPassword !== passwords.confirmarPassword) {
      setErrorPass('La confirmación de la nueva contraseña no coincide.');
      return;
    }

    const res = cambiarPassword({
      passwordActual: passwords.passwordActual,
      nuevaPassword: passwords.nuevaPassword
    });

    if (!res.ok) {
      setErrorPass(res.error);
      return;
    }

    setPasswords({
      passwordActual: '',
      nuevaPassword: '',
      confirmarPassword: ''
    });

    setNotificacion({
      tipo: 'exito',
      titulo: 'Contraseña actualizada.',
      mensaje: res.mensaje
    });
  };

  const handleCerrarSesion = () => {
    logout();
    navigate('/');
  };

  const iniciales = obtenerIniciales(datos.nombres, datos.apellidos);

  return (
    <div className="page-container">
      <div className="cue-encabezado">
        <h1 className="title-screen">Mi cuenta</h1>
        <p className="text-aux cue-subtitulo">
          Actualiza tus datos personales, tu punto de encuentro preferido y tu
          contraseña.
        </p>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="cue-columnas">
        <form
          onSubmit={handleGuardarDatos}
          className="card-surface cue-tarjeta"
        >
          <h2 className="title-section cue-titulo-seccion">Datos personales</h2>

          <div className="form-group">
            <label className="label-upper">Nombres</label>
            <input
              type="text"
              className="form-input"
              value={datos.nombres}
              onChange={(e) => setDatos({ ...datos, nombres: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="label-upper">Apellidos</label>
            <input
              type="text"
              className="form-input"
              value={datos.apellidos}
              onChange={(e) =>
                setDatos({ ...datos, apellidos: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="label-upper">Correo institucional</label>
            <input
              type="email"
              className="form-input"
              value={usuarioActual?.correo || '20201234@aloe.ulima.edu.pe'}
              disabled
            />
            <span className="field-hint">
              El correo institucional no se puede modificar.
            </span>
          </div>

          <div className="form-group">
            <label className="label-upper">Carrera</label>
            <select
              className="form-select"
              value={datos.carrera}
              onChange={(e) => setDatos({ ...datos, carrera: e.target.value })}
            >
              {CARRERAS_ULIMA.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label-upper">Ciclo actual</label>
            <select
              className="form-select"
              value={datos.ciclo}
              onChange={(e) => setDatos({ ...datos, ciclo: e.target.value })}
            >
              {CICLOS_ULIMA.map((ci) => (
                <option key={ci} value={ci}>
                  {ci}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label-upper">Teléfono de contacto (Opcional)</label>
            <input
              type="text"
              className="form-input"
              value={datos.telefono}
              onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
            />
            <span className="field-hint">
              Solo se muestra a la otra parte cuando hay un acuerdo activo.
            </span>
          </div>

          <div className="cue-acciones">
            <button type="submit" className="btn btn-primary">
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={() =>
                setDatos({
                  nombres: usuarioActual?.nombres || 'Rosa María',
                  apellidos: usuarioActual?.apellidos || 'Quispe Ríos',
                  carrera: usuarioActual?.carrera || 'Administración',
                  ciclo: usuarioActual?.ciclo || 'Cuarto',
                  telefono: usuarioActual?.telefono || '987 654 321',
                  puntoEncuentroPreferido:
                    usuarioActual?.puntoEncuentroPreferido || 'Biblioteca'
                })
              }
            >
              Descartar
            </button>
          </div>
        </form>

        <div className="cue-pila">
          <form
            onSubmit={handleGuardarPassword}
            className="card-surface cue-tarjeta"
          >
            <h2 className="title-section cue-titulo-seccion">
              Cambiar contraseña
            </h2>

            <div className="form-group">
              <label className="label-upper">Contraseña actual</label>
              <div className="vis-pass-grupo">
                <input
                  type={mostrarActual ? 'text' : 'password'}
                  value={passwords.passwordActual}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      passwordActual: e.target.value
                    })
                  }
                  placeholder="••••••••••"
                  className="vis-pass-input"
                />
                <button
                  type="button"
                  onClick={() => setMostrarActual((p) => !p)}
                  className="vis-pass-toggle"
                >
                  {mostrarActual ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label-upper">Nueva contraseña</label>
              <div className="vis-pass-grupo">
                <input
                  type={mostrarNueva ? 'text' : 'password'}
                  value={passwords.nuevaPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      nuevaPassword: e.target.value
                    })
                  }
                  className="vis-pass-input"
                />
                <button
                  type="button"
                  onClick={() => setMostrarNueva((p) => !p)}
                  className="vis-pass-toggle"
                >
                  {mostrarNueva ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <span className="field-hint">
                Mínimo 8 caracteres, una mayúscula y un número.
              </span>
            </div>

            <div className="form-group">
              <label className="label-upper">Confirmar nueva contraseña</label>
              <div className="vis-pass-grupo">
                <input
                  type={mostrarConfirmar ? 'text' : 'password'}
                  value={passwords.confirmarPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmarPassword: e.target.value
                    })
                  }
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
              {errorPass && <span className="field-error">{errorPass}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-secondary cue-btn-bloque"
            >
              Actualizar contraseña
            </button>
          </form>

          <div className="card-surface cue-tarjeta-compacta">
            <h2 className="title-section cue-titulo-punto">
              Punto de encuentro preferido
            </h2>
            <p className="text-aux cue-nota-punto">
              Se preseleccionará cuando coordines la entrega de un acuerdo.
            </p>

            <div className="cue-chips">
              {PUNTOS_ENCUENTRO.map((punto) => {
                const activo = datos.puntoEncuentroPreferido === punto;
                return (
                  <button
                    key={punto}
                    type="button"
                    className={`chip chip-selectable ${activo ? 'active' : ''}`}
                    onClick={() => handleSeleccionarPunto(punto)}
                  >
                    {punto}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="cue-pila">
          <div className="card-surface cue-tarjeta-perfil">
            <div className="striped-placeholder cue-avatar-grande">
              {usuarioActual?.fotoPerfil ? (
                <img
                  src={usuarioActual.fotoPerfil}
                  alt={`${datos.nombres} ${datos.apellidos}`}
                  className="media-img-cover cue-avatar-img"
                />
              ) : (
                iniciales
              )}
            </div>

            <h3 className="subtitle cue-nombre-perfil">
              {datos.nombres} {datos.apellidos}
            </h3>
            <p className="text-aux cue-resumen-perfil">
              {datos.carrera} · {datos.ciclo} ciclo ·{' '}
              {usuarioActual?.reputacion || 4.8} ★
            </p>

            <input
              ref={inputFotoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="cue-input-oculto"
              onChange={handleSubirFotografia}
            />

            <button
              type="button"
              className="btn btn-secondary btn-sm cue-btn-bloque"
              onClick={() => inputFotoRef.current?.click()}
            >
              Cambiar fotografía
            </button>

            {usuarioActual?.fotoPerfil && (
              <button
                type="button"
                className="btn btn-tertiary btn-sm cue-btn-quitar-foto"
                onClick={handleQuitarFotografia}
              >
                Restaurar iniciales
              </button>
            )}
          </div>

          <div className="card-surface cue-tarjeta-compacta">
            <span className="label-upper cue-label-actividad">
              Actividad en el tablón
            </span>

            <div className="cue-fila-metrica">
              <span className="text-aux">Miembro desde</span>
              <strong>{usuarioActual?.fechaRegistro || '15/03/2026'}</strong>
            </div>

            <div className="cue-fila-metrica">
              <span className="text-aux">Avisos publicados</span>
              <strong>{usuarioActual?.avisosPublicadosCount ?? 6}</strong>
            </div>

            <div className="cue-fila-metrica">
              <span className="text-aux">Acuerdos cerrados</span>
              <strong>{usuarioActual?.acuerdosCerrados ?? 12}</strong>
            </div>

            <div className="cue-fila-metrica-ultima">
              <span className="text-aux">Reputación</span>
              <strong>
                {usuarioActual?.reputacion || 4.8} ★ (
                {usuarioActual?.totalCalificaciones ?? 11})
              </strong>
            </div>
          </div>

          <div className="card-surface cue-cerrar-card">
            <div>
              <strong className="cue-cerrar-titulo">Cerrar sesión</strong>
              <span className="text-aux">En este dispositivo</span>
            </div>
            <button
              type="button"
              className="btn btn-destructive btn-sm"
              onClick={handleCerrarSesion}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
