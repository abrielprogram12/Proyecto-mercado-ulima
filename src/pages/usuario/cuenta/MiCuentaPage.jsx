import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../../context/AuthContext';
import { PUNTOS_ENCUENTRO, obtenerIniciales } from '../../../data/contratoDatos';
import Notificacion from '../../../components/Notificacion/Notificacion';
import './cuenta.css';

/**
 * MÓDULO: Mi cuenta (Integrante 1 · HU-1)
 * Vista 1.5 — Edición de datos personales, contraseña y punto de encuentro preferido
 */
export default function MiCuentaPage() {
  const {
    usuarioActual,
    actualizarDatosCuenta,
    cambiarPassword,
    logout
  } = useAuth();
  const navigate = useNavigate();

  const [nombres, setNombres] = useState(usuarioActual?.nombres || 'Rosa María');
  const [apellidos, setApellidos] = useState(usuarioActual?.apellidos || 'Quispe Ríos');
  const [telefono, setTelefono] = useState(usuarioActual?.telefono || '987 654 321');
  const [puntoPreferido, setPuntoPreferido] = useState(
    usuarioActual?.puntoEncuentroPreferido || 'Biblioteca'
  );
  const [erroresDatos, setErroresDatos] = useState({});

  // Estados de cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [erroresPass, setErroresPass] = useState({});

  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    if (usuarioActual) {
      setNombres(usuarioActual.nombres || '');
      setApellidos(usuarioActual.apellidos || '');
      setTelefono(usuarioActual.telefono || '987 654 321');
      setPuntoPreferido(usuarioActual.puntoEncuentroPreferido || 'Biblioteca');
    }
  }, [usuarioActual]);

  const handleGuardarDatos = (e) => {
    e.preventDefault();
    const errs = {};

    if (!nombres.trim()) errs.nombres = 'El nombre es obligatorio.';
    if (!apellidos.trim()) errs.apellidos = 'Los apellidos son obligatorios.';
    const soloDigitos = telefono.replace(/\s+/g, '');
    if (!/^[0-9]{9}$/.test(soloDigitos)) {
      errs.telefono = 'Ingresa un teléfono celular válido de 9 dígitos.';
    }

    setErroresDatos(errs);
    if (Object.keys(errs).length > 0) return;

    const res = actualizarDatosCuenta({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim()
    });

    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        titulo: 'Éxito.',
        mensaje: 'Tus datos personales se guardaron correctamente.'
      });
    }
  };

  const handleDescartarDatos = () => {
    if (!usuarioActual) return;
    setNombres(usuarioActual.nombres);
    setApellidos(usuarioActual.apellidos);
    setTelefono(usuarioActual.telefono);
    setErroresDatos({});
  };

  const handleSeleccionarPunto = (punto) => {
    setPuntoPreferido(punto);
    actualizarDatosCuenta({ puntoEncuentroPreferido: punto });
    setNotificacion({
      tipo: 'exito',
      titulo: 'Punto de encuentro actualizado.',
      mensaje: `Ahora se propondrá "${punto}" por defecto al coordinar tus entregas.`
    });
  };

  const handleActualizarPassword = (e) => {
    e.preventDefault();
    const errs = {};

    if (!passwordActual) {
      errs.passwordActual = 'Ingresa tu contraseña actual.';
    }
    const infoSeg = validarPasswordSegura(nuevaPassword);
    if (!infoSeg.esValida) {
      errs.nuevaPassword = 'Mínimo 8 caracteres, una mayúscula y un número.';
    }
    if (!confirmarPassword || confirmarPassword !== nuevaPassword) {
      errs.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErroresPass(errs);
    if (Object.keys(errs).length > 0) return;

    const res = cambiarPassword({ passwordActual, nuevaPassword });
    if (!res.ok) {
      setErroresPass({ [res.campo || 'passwordActual']: res.error });
      return;
    }

    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');
    setErroresPass({});
    setNotificacion({
      tipo: 'exito',
      titulo: 'Éxito.',
      mensaje: 'Tu contraseña se actualizó correctamente.'
    });
  };

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const iniciales = obtenerIniciales(
    usuarioActual?.nombres || nombres,
    usuarioActual?.apellidos || apellidos
  );

  return (
    <div className="page-container">
      <div className="cue-encabezado">
        <h1 className="title-screen">Mi cuenta</h1>
        <p className="text-aux cue-subtitulo">
          {usuarioActual?.nombres || 'Rosa María'}{' '}
          {usuarioActual?.apellidos || 'Quispe Ríos'} ·{' '}
          {usuarioActual?.carrera || 'Administración'},{' '}
          {(usuarioActual?.ciclo || 'cuarto').toLowerCase()} ciclo ·{' '}
          {usuarioActual?.antiguedadTexto || 'en el tablón desde marzo de 2026'}
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

      {/* Grilla de 3 columnas — Vista 1.5 */}
      <div className="cue-columnas">
        {/* Columna 1: Datos personales */}
        <form
          onSubmit={handleGuardarDatos}
          className="card-surface cue-tarjeta"
          noValidate
        >
          <h2 className="title-section cue-titulo-seccion">Datos personales</h2>

          <div className="form-group">
            <label className="label-upper" htmlFor="cuenta-nombres">
              Nombres
            </label>
            <input
              id="cuenta-nombres"
              type="text"
              className={`form-input ${erroresDatos.nombres ? 'input-error' : ''}`}
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {erroresDatos.nombres && (
              <span className="field-error">{erroresDatos.nombres}</span>
            )}
          </div>

          <div className="form-group">
            <label className="label-upper" htmlFor="cuenta-apellidos">
              Apellidos
            </label>
            <input
              id="cuenta-apellidos"
              type="text"
              className={`form-input ${erroresDatos.apellidos ? 'input-error' : ''}`}
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {erroresDatos.apellidos && (
              <span className="field-error">{erroresDatos.apellidos}</span>
            )}
          </div>

          <div className="form-group">
            <label className="label-upper" htmlFor="cuenta-correo">
              Correo institucional
            </label>
            <input
              id="cuenta-correo"
              type="email"
              className="form-input"
              value={usuarioActual?.correo || '20201234@aloe.ulima.edu.pe'}
              disabled
            />
            <span className="field-hint">No editable.</span>
          </div>

          <div className="form-group">
            <label className="label-upper" htmlFor="cuenta-telefono">
              Teléfono de contacto
            </label>
            <input
              id="cuenta-telefono"
              type="text"
              className={`form-input ${erroresDatos.telefono ? 'input-error' : ''}`}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {erroresDatos.telefono ? (
              <span className="field-error">{erroresDatos.telefono}</span>
            ) : (
              <span className="field-hint">
                Solo se comparte al cerrarse un acuerdo.
              </span>
            )}
          </div>

          <div className="cue-acciones">
            <button type="submit" className="btn btn-primary">
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={handleDescartarDatos}
            >
              Descartar
            </button>
          </div>
        </form>

        {/* Columna 2: Cambiar contraseña + Punto de encuentro preferido */}
        <div className="cue-pila">
          <form
            onSubmit={handleActualizarPassword}
            className="card-surface cue-tarjeta"
            noValidate
          >
            <h2 className="title-section cue-titulo-seccion">
              Cambiar contraseña
            </h2>

            <div className="form-group">
              <label className="label-upper" htmlFor="pass-actual">
                Contraseña actual
              </label>
              <input
                id="pass-actual"
                type="password"
                placeholder="••••••••••"
                className={`form-input ${
                  erroresPass.passwordActual ? 'input-error' : ''
                }`}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
              />
              {erroresPass.passwordActual && (
                <span className="field-error">{erroresPass.passwordActual}</span>
              )}
            </div>

            <div className="form-group">
              <label className="label-upper" htmlFor="pass-nueva">
                Nueva contraseña
              </label>
              <input
                id="pass-nueva"
                type="password"
                placeholder="••••••••••"
                className={`form-input ${
                  erroresPass.nuevaPassword ? 'input-error' : ''
                }`}
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
              />
              {erroresPass.nuevaPassword ? (
                <span className="field-error">{erroresPass.nuevaPassword}</span>
              ) : (
                <span className="field-hint">
                  Mínimo 8 caracteres, una mayúscula y un número.
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="label-upper" htmlFor="pass-confirmar">
                Confirmar nueva contraseña
              </label>
              <input
                id="pass-confirmar"
                type="password"
                placeholder="••••••••••"
                className={`form-input ${
                  erroresPass.confirmarPassword ? 'input-error' : ''
                }`}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
              />
              {erroresPass.confirmarPassword && (
                <span className="field-error">{erroresPass.confirmarPassword}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary cue-btn-bloque">
              Actualizar contraseña
            </button>
          </form>

          {/* Punto de encuentro preferido */}
          <div className="card-surface cue-tarjeta">
            <h2 className="title-section cue-titulo-punto">
              Punto de encuentro preferido
            </h2>
            <p className="text-aux cue-nota-punto">
              Se propondrá por defecto al coordinar tus entregas.
            </p>

            <div className="cue-chips">
              {PUNTOS_ENCUENTRO.map((punto) => (
                <button
                  key={punto}
                  type="button"
                  className={`chip chip-selectable ${
                    puntoPreferido === punto ? 'active' : ''
                  }`}
                  onClick={() => handleSeleccionarPunto(punto)}
                >
                  {punto}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna 3: Tarjeta de perfil, Actividad del ciclo y Cerrar sesión */}
        <div className="cue-pila">
          <div className="card-surface cue-tarjeta-perfil">
            <div className="striped-placeholder cue-avatar-grande">
              {iniciales}
            </div>
            <h3 className="subtitle cue-nombre-perfil">
              {usuarioActual?.nombres || 'Rosa María'}{' '}
              {usuarioActual?.apellidos || 'Quispe Ríos'}
            </h3>
            <p className="text-aux cue-resumen-perfil">
              Reputación {usuarioActual?.reputacion || 4.8} ·{' '}
              {usuarioActual?.acuerdosCerrados ?? 12} acuerdos cerrados
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                setNotificacion({
                  tipo: 'exito',
                  titulo: 'Fotografía actualizada.',
                  mensaje: 'Tu foto de perfil se actualizó correctamente.'
                })
              }
            >
              Cambiar fotografía
            </button>
          </div>

          <div className="card-surface cue-tarjeta-compacta">
            <span className="label-upper cue-label-actividad">
              Actividad del ciclo
            </span>
            <div className="cue-fila-metrica">
              <span className="text-aux">Avisos publicados</span>
              <strong>{usuarioActual?.avisosPublicadosCount ?? 6}</strong>
            </div>
            <div className="cue-fila-metrica">
              <span className="text-aux">Acuerdos cerrados</span>
              <strong>{usuarioActual?.acuerdosCerrados ?? 12}</strong>
            </div>
            <div className="cue-fila-metrica-ultima">
              <span className="text-aux">Entregas confirmadas</span>
              <strong>{usuarioActual?.entregasConfirmadasPct ?? 100} %</strong>
            </div>
          </div>

          <div className="card-surface cue-cerrar-card">
            <div>
              <strong className="cue-cerrar-titulo">Cerrar sesión</strong>
              <span className="text-aux">En este dispositivo.</span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
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
