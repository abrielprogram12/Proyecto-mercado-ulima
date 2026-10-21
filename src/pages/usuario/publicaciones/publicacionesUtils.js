/**
 * Utilidades y constantes del módulo de Publicaciones (Integrante 2 · HU-2)
 */

export const PESTANAS_MIS_AVISOS = [
  { clave: 'Todos', etiqueta: 'Todos' },
  { clave: 'Publicado', etiqueta: 'Publicados' },
  { clave: 'Pausado', etiqueta: 'Pausados' },
  { clave: 'Borrador', etiqueta: 'Borradores' },
  { clave: 'Vendido', etiqueta: 'Vendidos' }
];

export const FOTOS_INICIALES_FORMULARIO = [
  { id: 'f-new-1', etiqueta: 'fotografía principal', principal: true },
  { id: 'f-new-2', etiqueta: 'lomo del libro', principal: false },
  { id: 'f-new-3', etiqueta: 'hojas interiores', principal: false }
];

export const FOTOS_INICIALES_CARGA = [
  { id: 'f-1', etiqueta: 'portada', principal: true },
  { id: 'f-2', etiqueta: 'lomo', principal: false },
  { id: 'f-3', etiqueta: 'hojas interiores', principal: false },
  { id: 'f-4', etiqueta: 'contraportada', principal: false }
];

export function calcularConteosAvisos(misAvisos = []) {
  return {
    Todos: misAvisos.length,
    Publicado: misAvisos.filter((a) => a.estado === 'Publicado').length,
    Pausado: misAvisos.filter((a) => a.estado === 'Pausado').length,
    Borrador: misAvisos.filter((a) => a.estado === 'Borrador').length,
    Vendido: misAvisos.filter((a) => a.estado === 'Vendido').length
  };
}

export function filtrarAvisosVendedor(misAvisos = [], filtroEstado = 'Todos', busqueda = '') {
  const termino = busqueda.trim().toLowerCase();
  return misAvisos.filter((a) => {
    const cumpleEstado = filtroEstado === 'Todos' || a.estado === filtroEstado;
    const cumpleBusqueda =
      !termino ||
      a.titulo.toLowerCase().includes(termino) ||
      (a.curso || '').toLowerCase().includes(termino) ||
      (a.categoria || '').toLowerCase().includes(termino);
    return cumpleEstado && cumpleBusqueda;
  });
}

export function validarFormularioAviso({
  titulo,
  categoria,
  precio,
  aceptaOfertas,
  montoMinimo,
  fotos
}) {
  const errs = {};

  if (!titulo || titulo.trim().length < 15) {
    errs.titulo =
      'El título debe tener al menos 15 caracteres e incluir autor o modelo.';
  }
  if (!categoria) {
    errs.categoria = 'Este campo es obligatorio.';
  }
  if (!precio || Number(precio) <= 0) {
    errs.precio = 'Ingresa un precio válido mayor a S/ 0.00.';
  }
  if (aceptaOfertas && Number(montoMinimo) > Number(precio)) {
    errs.montoMinimo = 'El mínimo no puede ser mayor que el precio pedido.';
  }
  if (!fotos || fotos.length === 0) {
    errs.fotos = 'Necesitas al menos una fotografía para publicar.';
  }

  return errs;
}
