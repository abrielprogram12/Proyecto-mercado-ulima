import { obtenerIniciales } from '../../../data/contratoDatos';

/**
 * Aspectos positivos sugeridos al calificar a la contraparte (HU-6 · Vista 6.1)
 */
export const ASPECTOS_OPCIONES = [
  'Puntualidad',
  'Buena comunicación',
  'Producto como se describía',
  'Flexibilidad con el horario'
];

/**
 * Barras de distribución de estrellas para el perfil de reputación (Vista 6.2)
 */
export const DISTRIBUCION_ESTRELLAS = [
  { estrellas: 5, count: 9, fillClass: 'rep-bar-fill--82' },
  { estrellas: 4, count: 2, fillClass: 'rep-bar-fill--18' },
  { estrellas: 3, count: 0, fillClass: 'rep-bar-fill--0' },
  { estrellas: 2, count: 0, fillClass: 'rep-bar-fill--0' },
  { estrellas: 1, count: 0, fillClass: 'rep-bar-fill--0' }
];

/**
 * Pestañas de filtro por puntaje en Perfil de Reputación (Vista 6.2)
 */
export const FILTROS_PUNTAJE_REPUTACION = [
  { clave: 'Todos', etiqueta: 'Todos · 11' },
  { clave: '5', etiqueta: '5 ★ · 9' },
  { clave: '4', etiqueta: '4 ★ · 2' },
  { clave: '3_menos', etiqueta: '3 ★ o menos · 0' }
];

/**
 * Filtra los comentarios recibidos según el filtro de puntaje activo
 */
export function filtrarCalificacionesPorPuntaje(recibidas = [], filtroPuntaje = 'Todos') {
  if (filtroPuntaje === '5') {
    return recibidas.filter((c) => Number(c.puntaje) === 5);
  }
  if (filtroPuntaje === '4') {
    return recibidas.filter((c) => Number(c.puntaje) === 4);
  }
  if (filtroPuntaje === '3_menos') {
    return recibidas.filter((c) => Number(c.puntaje) <= 3);
  }
  return recibidas;
}

/**
 * Obtiene las iniciales de un nombre completo
 */
export function obtenerInicialesDeNombre(nombreCompleto = 'Usuario') {
  const partes = (nombreCompleto || 'Usuario').split(' ');
  return obtenerIniciales(partes[0], partes[1] || '');
}
