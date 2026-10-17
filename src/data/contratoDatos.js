/**
 * CONTRATO DE DATOS OFICIAL — Tablón ULima
 * Define las constantes compartidas por todos los integrantes del equipo
 * para evitar acoplamientos y conflictos entre módulos.
 */

export const CATEGORIAS = [
  'Libros de texto',
  'Calculadoras',
  'Instrumentos de dibujo',
  'Apuntes y guías',
  'Laptops y accesorios',
  'Uniformes y mandiles',
  'Material de laboratorio'
];

export const CURSOS_ASOCIADOS = [
  'Cálculo I',
  'Física II',
  'Dibujo Técnico',
  'Contabilidad General',
  'Química General',
  'Estadística Aplicada',
  'Programación Web',
  'Economía General'
];

export const CONDICIONES_PRODUCTO = [
  'Como nuevo',
  'Muy buen estado',
  'Buen estado',
  'Con marcas de uso'
];

export const PUNTOS_ENCUENTRO = [
  'Biblioteca',
  'Puerta 1',
  'Cafetería del pabellón E',
  'Explanada central',
  'Patio del pabellón H'
];

export const FRANJAS_HORARIAS = [
  '08:00 – 10:00',
  '10:00 – 12:00',
  '14:00 – 16:00',
  '16:00 – 18:00'
];

export const CARRERAS_ULIMA = [
  'Administración',
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ing. de Sistemas',
  'Ing. Industrial',
  'Arquitectura',
  'Comunicación',
  'Derecho',
  'Economía',
  'Contabilidad',
  'Psicología',
  'Marketing',
  'Negocios Internacionales'
];

export const CICLOS_ULIMA = [
  'Primero',
  'Segundo',
  'Tercero',
  'Cuarto',
  'Quinto',
  'Sexto',
  'Séptimo',
  'Octavo',
  'Noveno',
  'Décimo'
];

export const ESTADOS_AVISO = {
  BORRADOR: 'Borrador',
  PUBLICADO: 'Publicado',
  PAUSADO: 'Pausado',
  VENDIDO: 'Vendido'
};

export const ESTADOS_OFERTA = {
  ENVIADA: 'Enviada',
  CONTRAOFERTADA: 'Contraofertada',
  ACEPTADA: 'Aceptada',
  RECHAZADA: 'Rechazada',
  VENCIDA: 'Vencida'
};

export const ESTADOS_ACUERDO = {
  ESPERANDO_RESPUESTA: 'Esperando respuesta',
  PROPUESTA_RECIBIDA: 'Propuesta recibida',
  ACORDADO: 'Acordado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
};

export const ESTADOS_REPORTE = {
  NUEVO: 'Nuevo',
  EN_REVISION: 'En revisión',
  RESUELTO: 'Resuelto',
  DESCARTADO: 'Descartado'
};

export const ROLES_USUARIO = {
  VISITANTE: 'visitante',
  USUARIO: 'usuario',
  ADMIN: 'admin'
};

export const STORAGE_KEYS = {
  AUTH_USER: 'tablon_ulima_auth_user_v1',
  USUARIOS: 'tablon_ulima_usuarios_v1',
  AVISOS: 'tablon_ulima_avisos_v1',
  FAVORITOS: 'tablon_ulima_favoritos_v1',
  OFERTAS: 'tablon_ulima_ofertas_v1',
  ACUERDOS: 'tablon_ulima_acuerdos_v1',
  CALIFICACIONES: 'tablon_ulima_calificaciones_v1',
  REPORTES: 'tablon_ulima_reportes_v1',
  CORREO_RECORDADO: 'tablon_ulima_correo_recordado_v1'
};

/**
 * Formatea un monto numérico siempre con el formato oficial: S/ 95.00
 */
export function formatearPrecio(monto) {
  const numero = Number(monto || 0);
  return `S/ ${numero.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Obtiene las iniciales de un usuario (ej. Rosa Quispe -> RQ)
 */
export function obtenerIniciales(nombres = '', apellidos = '') {
  const n = nombres.trim().charAt(0) || '';
  const a = apellidos.trim().charAt(0) || '';
  return (n + a).toUpperCase() || 'UL';
}
