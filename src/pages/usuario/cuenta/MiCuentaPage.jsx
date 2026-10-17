import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, validarPasswordSegura } from '../../../context/AuthContext';
import { PUNTOS_ENCUENTRO, obtenerIniciales } from '../../../data/contratoDatos';
import Notificacion from '../../../components/Notificacion/Notificacion';

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
      <div style={{ marginBottom: '24px' }}>
        <h1 className="title-screen" style={{ marginBottom: '4px' }}>
          Mi cuenta
        </h1>
        <p className="text-aux" style={{ fontSize: '14px' }}>
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.1fr 0.85fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Columna 1: Datos personales */}
        <form
          onSubmit={handleGuardarDatos}
          className="card-surface"
          style={{ padding: '26px 28px' }}
          noValidate
        >
          <h2
            className="title-section"
            style={{ color: 'var(--color-primary)', marginBottom: '18px' }}
          >
            Datos personales
          </h2>

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <form
            onSubmit={handleActualizarPassword}
            className="card-surface"
            style={{ padding: '26px 28px' }}
            noValidate
          >
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '18px' }}
            >
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Actualizar contraseña
            </button>
          </form>

          {/* Punto de encuentro preferido */}
          <div className="card-surface" style={{ padding: '24px 28px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '6px' }}
            >
              Punto de encuentro preferido
            </h2>
            <p className="text-aux" style={{ marginBottom: '16px' }}>
              Se propondrá por defecto al coordinar tus entregas.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="card-surface"
            style={{ padding: '28px 24px', textAlign: 'center' }}
          >
            <div
              className="striped-placeholder"
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                margin: '0 auto 14px',
                fontWeight: 700,
                fontSize: '22px',
                color: 'var(--color-primary)'
              }}
            >
              {iniciales}
            </div>
            <h3 className="subtitle" style={{ marginBottom: '2px' }}>
              {usuarioActual?.nombres || 'Rosa María'}{' '}
              {usuarioActual?.apellidos || 'Quispe Ríos'}
            </h3>
            <p className="text-aux" style={{ marginBottom: '16px' }}>
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

          <div className="card-surface" style={{ padding: '22px 24px' }}>
            <span className="label-upper" style={{ marginBottom: '14px' }}>
              Actividad del ciclo
            </span>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '14px'
              }}
            >
              <span className="text-aux">Avisos publicados</span>
              <strong>{usuarioActual?.avisosPublicadosCount ?? 6}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '14px'
              }}
            >
              <span className="text-aux">Acuerdos cerrados</span>
              <strong>{usuarioActual?.acuerdosCerrados ?? 12}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                fontSize: '14px'
              }}
            >
              <span className="text-aux">Entregas confirmadas</span>
              <strong>{usuarioActual?.entregasConfirmadasPct ?? 100} %</strong>
            </div>
          </div>

          <div
            className="card-surface"
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '15px' }}>
                Cerrar sesión
              </strong>
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
