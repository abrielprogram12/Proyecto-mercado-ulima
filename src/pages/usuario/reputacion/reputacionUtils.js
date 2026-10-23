import { obtenerIniciales } from '../../../data/contratoDatos';

export const ASPECTOS_OPCIONES = [
  'Puntualidad',
  'Buena comunicación',
  'Producto como se describía',
  'Flexibilidad con el horario'
];

export const DISTRIBUCION_ESTRELLAS = [
  { estrellas: 5, count: 9, fillClass: 'rep-bar-fill--82' },
  { estrellas: 4, count: 2, fillClass: 'rep-bar-fill--18' },
  { estrellas: 3, count: 0, fillClass: 'rep-bar-fill--0' },
  { estrellas: 2, count: 0, fillClass: 'rep-bar-fill--0' },
  { estrellas: 1, count: 0, fillClass: 'rep-bar-fill--0' }
];

export const FILTROS_PUNTAJE_REPUTACION = [
  { clave: 'Todos', etiqueta: 'Todos · 11' },
  { clave: '5', etiqueta: '5 ★ · 9' },
  { clave: '4', etiqueta: '4 ★ · 2' },
  { clave: '3_menos', etiqueta: '3 ★ o menos · 0' }
];

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

export function obtenerInicialesDeNombre(nombreCompleto = 'Usuario') {
  const partes = (nombreCompleto || 'Usuario').split(' ');
  return obtenerIniciales(partes[0], partes[1] || '');
}
