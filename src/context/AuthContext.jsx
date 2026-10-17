import { createContext, useContext, useState, useEffect } from 'react';
import { usuariosIniciales } from '../data/usuariosData';
import { STORAGE_KEYS, ROLES_USUARIO } from '../data/contratoDatos';

const AuthContext = createContext(null);

export function validarPasswordSegura(password = '') {
  const tieneLongitud = password.length >= 8;
  const tieneMayuscula = /[A-ZÁÉÍÓÚÑ]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  return {
    esValida: tieneLongitud && tieneMayuscula && tieneNumero,
    tieneLongitud,
    tieneMayuscula,
    tieneNumero,
    puntaje: [tieneLongitud, tieneMayuscula, tieneNumero, password.length >= 12].filter(Boolean).length
  };
}

export function validarCorreoInstitucional(correo = '') {
  const limpio = correo.trim().toLowerCase();
  return limpio.endsWith('@aloe.ulima.edu.pe') || limpio === 'admin@ulima.edu.pe';
}

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.USUARIOS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error leyendo usuarios de localStorage:', err);
    }
    return usuariosIniciales;
  });

  const [usuarioActual, setUsuarioActual] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (guardado) {
        return JSON.parse(guardado);
      }
    } catch (err) {
      console.error('Error leyendo sesión de localStorage:', err);
    }
    return null;
  });

  const [intentosFallidos, setIntentosFallidos] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
    } catch (err) {
      console.error('Error guardando usuarios en localStorage:', err);
    }
  }, [usuarios]);

  useEffect(() => {
    try {
      if (usuarioActual) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(usuarioActual));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch (err) {
      console.error('Error guardando sesión en localStorage:', err);
    }
  }, [usuarioActual]);

  const rolActual = usuarioActual?.rol || ROLES_USUARIO.VISITANTE;

  const obtenerCorreoRecordado = () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CORREO_RECORDADO) || '';
    } catch {
      return '';
    }
  };

  const guardarCorreoRecordado = (correo, recordar) => {
    try {
      if (recordar && correo) {
        localStorage.setItem(STORAGE_KEYS.CORREO_RECORDADO, correo.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.CORREO_RECORDADO);
      }
    } catch (err) {
      console.error('Error manejando correo recordado:', err);
    }
  };

  /**
   * Inicio de sesión (HU-1)
   * Impide el ingreso a cuentas bloqueadas y lleva el conteo de intentos antes del bloqueo temporal.
   */
  const login = ({ correo, password, recordarme = false }) => {
    const correoLimpio = (correo || '').trim().toLowerCase();
    const usuario = usuarios.find((u) => u.correo.toLowerCase() === correoLimpio);

    if (usuario && (usuario.estadoCuenta === 'Bloqueado' || usuario.estadoCuenta === 'Bloqueada')) {
      return {
        ok: false,
        bloqueado: true,
        error: 'Cuenta bloqueada. Tu cuenta ha sido suspendida por incumplir las normas del tablón y no puede iniciar sesión.'
      };
    }

    if (!usuario || usuario.password !== password) {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      const restantes = Math.max(0, 3 - (nuevosIntentos % 4));
      return {
        ok: false,
        intentosRestantes: restantes === 0 ? 3 : restantes,
        error: `No pudimos ingresar. El correo o la contraseña no coinciden. Te quedan ${restantes === 0 ? 3 : restantes} intentos antes del bloqueo temporal.`
      };
    }

    setIntentosFallidos(0);
    guardarCorreoRecordado(correoLimpio, recordarme);
    setUsuarioActual(usuario);
    return {
      ok: true,
      usuario
    };
  };

  /**
   * Cierre de sesión (HU-1)
   */
  const logout = () => {
    setUsuarioActual(null);
  };

  /**
   * Registro de nueva cuenta de estudiante (HU-1)
   */
  const registrarUsuario = ({
    nombres,
    apellidos,
    correo,
    password,
    carrera,
    ciclo,
    aceptaNormas
  }) => {
    const correoLimpio = (correo || '').trim().toLowerCase();

    if (!correoLimpio.endsWith('@aloe.ulima.edu.pe')) {
      return {
        ok: false,
        campo: 'correo',
        error: 'El correo debe terminar en @aloe.ulima.edu.pe.'
      };
    }

    const existe = usuarios.some((u) => u.correo.toLowerCase() === correoLimpio);
    if (existe) {
      return {
        ok: false,
        campo: 'correo',
        error: 'Este correo institucional ya tiene una cuenta registrada.'
      };
    }

    const validacionPass = validarPasswordSegura(password);
    if (!validacionPass.esValida) {
      return {
        ok: false,
        campo: 'password',
        error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.'
      };
    }

    if (!aceptaNormas) {
      return {
        ok: false,
        campo: 'aceptaNormas',
        error: 'Debes aceptar las normas de convivencia del tablón.'
      };
    }

    const nuevoUsuario = {
      id: `u-${Date.now()}`,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correoLimpio,
      password,
      carrera,
      ciclo,
      telefono: '987 654 321',
      puntoEncuentroPreferido: 'Biblioteca',
      rol: ROLES_USUARIO.USUARIO,
      estadoCuenta: 'Activa',
      reputacion: 5.0,
      totalCalificaciones: 0,
      acuerdosCerrados: 0,
      avisosPublicadosCount: 0,
      entregasConfirmadasPct: 100,
      tiempoRespuesta: '1 d',
      fechaRegistro: '16/10/2026',
      antiguedadTexto: 'en el tablón desde octubre de 2026',
      reportesAcumulados: 0,
      verificado: true
    };

    setUsuarios((prev) => [nuevoUsuario, ...prev]);
    guardarCorreoRecordado(correoLimpio, true);

    return {
      ok: true,
      usuario: nuevoUsuario
    };
  };

  /**
   * Edición de datos personales y punto de encuentro preferido (HU-1 · Vista 1.5)
   */
  const actualizarDatosCuenta = (cambios) => {
    if (!usuarioActual) {
      return { ok: false, error: 'Debes iniciar sesión para editar tu cuenta.' };
    }

    const usuarioActualizado = {
      ...usuarioActual,
      ...cambios
    };

    setUsuarioActual(usuarioActualizado);
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioActual.id ? usuarioActualizado : u))
    );

    return {
      ok: true,
      usuario: usuarioActualizado,
      mensaje: 'Éxito. Los datos de tu cuenta se actualizaron correctamente.'
    };
  };

  /**
   * Cambio de contraseña desde Mi Cuenta (HU-1 · Vista 1.5)
   */
  const cambiarPassword = ({ passwordActual, nuevaPassword }) => {
    if (!usuarioActual) {
      return { ok: false, error: 'No hay una sesión activa.' };
    }

    if (usuarioActual.password !== passwordActual) {
      return {
        ok: false,
        campo: 'passwordActual',
        error: 'La contraseña actual no coincide con nuestros registros.'
      };
    }

    const validacion = validarPasswordSegura(nuevaPassword);
    if (!validacion.esValida) {
      return {
        ok: false,
        campo: 'nuevaPassword',
        error: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.'
      };
    }

    const actualizado = {
      ...usuarioActual,
      password: nuevaPassword
    };

    setUsuarioActual(actualizado);
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioActual.id ? actualizado : u))
    );

    return {
      ok: true,
      mensaje: 'Éxito. Tu contraseña se actualizó correctamente.'
    };
  };

  /**
   * Flujo de recuperación de contraseña (HU-1 · Vista 1.4 y 1.8)
   */
  const solicitarEnlaceRecuperacion = (correo) => {
    const correoLimpio = (correo || '').trim().toLowerCase();
    if (!correoLimpio.endsWith('@aloe.ulima.edu.pe')) {
      return {
        ok: false,
        error: 'El correo debe terminar en @aloe.ulima.edu.pe.'
      };
    }
    return {
      ok: true,
      correo: correoLimpio
    };
  };

  const restablecerPassword = ({ correo, nuevaPassword }) => {
    const validacion = validarPasswordSegura(nuevaPassword);
    if (!validacion.esValida) {
      return {
        ok: false,
        error: 'Mínimo 8 caracteres, con una mayúscula y un número.'
      };
    }

    const correoLimpio = (correo || '').trim().toLowerCase();
    const existe = usuarios.some((u) => u.correo.toLowerCase() === correoLimpio);

    if (existe) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.correo.toLowerCase() === correoLimpio ? { ...u, password: nuevaPassword } : u
        )
      );
      if (usuarioActual && usuarioActual.correo.toLowerCase() === correoLimpio) {
        setUsuarioActual((prev) => ({ ...prev, password: nuevaPassword }));
      }
    }

    return {
      ok: true,
      mensaje: 'Listo. Ya puedes iniciar sesión con tu nueva contraseña.'
    };
  };

  /**
   * Selector rápido de sesión de prueba en el Header
   */
  const cambiarSesionPrueba = (claveSesion) => {
    if (claveSesion === 'visitante') {
      setUsuarioActual(null);
      return null;
    }
    const mapa = {
      rosa: 'u-1',
      diego: 'u-2',
      admin: 'u-admin'
    };
    const idBuscado = mapa[claveSesion] || claveSesion;
    const encontrado =
      usuarios.find((u) => u.id === idBuscado) ||
      usuariosIniciales.find((u) => u.id === idBuscado);
    if (encontrado) {
      setUsuarioActual(encontrado);
      return encontrado;
    }
    return null;
  };

  const obtenerUsuarioPorId = (id) => {
    return usuarios.find((u) => u.id === id) || null;
  };

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        setUsuarios,
        usuarioActual,
        rolActual,
        estaAutenticado: Boolean(usuarioActual),
        intentosFallidos,
        login,
        logout,
        registrarUsuario,
        actualizarDatosCuenta,
        cambiarPassword,
        solicitarEnlaceRecuperacion,
        restablecerPassword,
        cambiarSesionPrueba,
        obtenerUsuarioPorId,
        obtenerCorreoRecordado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un <AuthProvider>');
  }
  return context;
}
