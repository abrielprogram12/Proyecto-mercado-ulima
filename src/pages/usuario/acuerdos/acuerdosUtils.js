import { ESTADOS_ACUERDO } from '../../../data/contratoDatos';

export const ESTADOS_EN_CURSO = [
  ESTADOS_ACUERDO.ESPERANDO_RESPUESTA,
  ESTADOS_ACUERDO.PROPUESTA_RECIBIDA,
  ESTADOS_ACUERDO.ACORDADO
];

export const esEnCurso = (estado) => ESTADOS_EN_CURSO.includes(estado);

const dos = (n) => String(n).padStart(2, '0');

export function hoyIso() {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

export function isoAFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export const primerNombre = (nombreCompleto = '') => nombreCompleto.split(' ')[0];
export const minusculaInicial = (texto = '') => texto.charAt(0).toLowerCase() + texto.slice(1);

export function inicialesDe(nombreCompleto = '') {
  const palabras = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return 'UL';
  if (palabras.length >= 3) return (palabras[0][0] + palabras[palabras.length - 2][0]).toUpperCase();
  return (palabras[0][0] + (palabras[1]?.[0] || '')).toUpperCase();
}

export function datosContraparte(acuerdo, rol, obtenerUsuarioPorId) {
  if (rol === 'vendedor') {
    return {
      id: acuerdo.compradorId,
      nombre: acuerdo.compradorNombre,
      carrera: acuerdo.compradorCarrera,
      reputacion: acuerdo.compradorReputacion,
      telefono: acuerdo.compradorTelefono,
      rolTexto: 'Comprador'
    };
  }
  const vendedor = obtenerUsuarioPorId(acuerdo.vendedorId);
  return {
    id: acuerdo.vendedorId,
    nombre: acuerdo.vendedorNombre,
    carrera: vendedor?.carrera,
    reputacion: vendedor?.reputacion,
    telefono: acuerdo.vendedorTelefono,
    rolTexto: 'Vendedor'
  };
}

export const textoReputacion = (reputacion) =>
  typeof reputacion === 'number' ? `${reputacion.toFixed(1)} ★` : '';

export const describirEncuentro = (acuerdo) =>
  `${acuerdo.puntoEncuentro} · ${acuerdo.fechaEncuentro} · ${acuerdo.franjaHoraria}`;

export function textoRelacion(rol, enCurso) {
  if (rol === 'vendedor') return enCurso ? 'vendes a' : 'vendías a';
  return enCurso ? 'compras a' : 'compraste a';
}

const TITULOS_NOTIFICACION = { exito: 'Éxito.', error: 'Error.', info: 'Atención.', advertencia: 'Atención.' };
export const tituloNotificacion = (tipo) => TITULOS_NOTIFICACION[tipo] || '';
