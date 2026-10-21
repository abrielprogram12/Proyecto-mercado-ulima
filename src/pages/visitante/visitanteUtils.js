/**
 * Utilidades y constantes del módulo de Visitante y Acceso (Integrante 1 · HU-1)
 */

export const PASOS_COMO_FUNCIONA = [
  {
    num: 1,
    titulo: 'Publica tu aviso',
    desc: 'Sube fotografías, indica el estado del producto y tu precio pedido.'
  },
  {
    num: 2,
    titulo: 'Recibe y negocia ofertas',
    desc: 'Acepta, rechaza o contraoferta desde el hilo de negociación.'
  },
  {
    num: 3,
    titulo: 'Coordinen la entrega',
    desc: 'Elijan punto y horario en el campus y confirmen la entrega.'
  }
];

export const CUENTAS_PRUEBA_LOGIN = [
  { etiqueta: 'Rosa Quispe (Usuario)', correo: '20201234@aloe.ulima.edu.pe' },
  { etiqueta: 'Julio Mendoza (Admin)', correo: 'admin@ulima.edu.pe' },
  { etiqueta: 'Marco Loayza (Bloqueado)', correo: '20189922@aloe.ulima.edu.pe' }
];

export const PASOS_RECUPERACION = [
  { num: 1, texto: 'Paso 1 · Correo' },
  { num: 2, texto: 'Paso 2 · Enlace' },
  { num: 3, texto: 'Paso 3 · Nueva contraseña' }
];

/** Formatea segundos totales en MM:SS (ej. 161 -> '02:41') */
export function formatearTiempoMMSS(totalSegundos) {
  const min = String(Math.floor(totalSegundos / 60)).padStart(2, '0');
  const seg = String(totalSegundos % 60).padStart(2, '0');
  return `${min}:${seg}`;
}

/** Valida los campos del formulario de registro institucional (Vista 1.3) */
export function validarFormularioRegistro(datos, validarPasswordSegura) {
  const errores = {};

  if (!datos.nombres.trim()) {
    errores.nombres = 'Ingresa tus nombres.';
  }
  if (!datos.apellidos.trim()) {
    errores.apellidos = 'Ingresa tus apellidos.';
  }
  if (!datos.correo.trim()) {
    errores.correo = 'El correo institucional es obligatorio.';
  } else if (!datos.correo.trim().toLowerCase().endsWith('@aloe.ulima.edu.pe')) {
    errores.correo = 'El correo debe terminar en @aloe.ulima.edu.pe.';
  }

  if (!datos.password) {
    errores.password = 'Ingresa una contraseña.';
  } else if (!validarPasswordSegura(datos.password).esValida) {
    errores.password = 'Debe tener al menos 8 caracteres, una mayúscula y un número.';
  }

  if (!datos.confirmarPassword || datos.confirmarPassword !== datos.password) {
    errores.confirmarPassword = 'Las contraseñas no coinciden.';
  }

  if (!datos.carrera) {
    errores.carrera = 'Selecciona tu carrera.';
  }

  if (!datos.ciclo) {
    errores.ciclo = 'Selecciona tu ciclo.';
  }

  if (!datos.aceptaNormas) {
    errores.aceptaNormas = 'Debes aceptar las normas de convivencia del tablón.';
  }

  return errores;
}
