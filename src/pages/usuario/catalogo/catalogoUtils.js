/**
 * Utilidades y constantes del módulo de Catálogo y Búsqueda (Integrante 3 · HU-3)
 */

export const ITEMS_POR_PAGINA_CATALOGO = 12;

export const FILTROS_INICIALES_CATALOGO = {
  categoria: '',
  curso: '',
  precioMin: '',
  precioMax: '',
  condicion: ''
};

export function filtrarYOrdenarCatalogo(
  avisosPublicados = [],
  filtros = FILTROS_INICIALES_CATALOGO,
  busquedaTexto = '',
  orden = 'recientes'
) {
  const resultado = avisosPublicados.filter((a) => {
    if (filtros.categoria && a.categoria !== filtros.categoria) return false;
    if (filtros.curso && a.curso !== filtros.curso) return false;
    if (filtros.condicion && a.condicion !== filtros.condicion) return false;
    if (
      filtros.precioMin !== '' &&
      Number(a.precio) < Number(filtros.precioMin)
    ) {
      return false;
    }
    if (
      filtros.precioMax !== '' &&
      Number(a.precio) > Number(filtros.precioMax)
    ) {
      return false;
    }
    if (busquedaTexto.trim()) {
      const q = busquedaTexto.trim().toLowerCase();
      const coincideTitulo = a.titulo.toLowerCase().includes(q);
      const coincideDesc = (a.descripcion || '').toLowerCase().includes(q);
      const coincideCurso = (a.curso || '').toLowerCase().includes(q);
      if (!coincideTitulo && !coincideDesc && !coincideCurso) return false;
    }
    return true;
  });

  if (orden === 'precio_asc') {
    resultado.sort((a, b) => Number(a.precio) - Number(b.precio));
  } else if (orden === 'precio_desc') {
    resultado.sort((a, b) => Number(b.precio) - Number(a.precio));
  }
  return resultado;
}

export function construirChipsActivos(filtros = {}, busquedaTexto = '') {
  const chips = [];
  if (filtros.categoria) {
    chips.push({ clave: 'categoria', etiqueta: filtros.categoria });
  }
  if (filtros.curso) {
    chips.push({ clave: 'curso', etiqueta: filtros.curso });
  }
  if (filtros.precioMin || filtros.precioMax) {
    chips.push({
      clave: 'rangoPrecio',
      etiqueta: `S/ ${filtros.precioMin || 0} – S/ ${filtros.precioMax || '∞'}`
    });
  }
  if (filtros.condicion) {
    chips.push({ clave: 'condicion', etiqueta: filtros.condicion });
  }
  if (busquedaTexto.trim()) {
    chips.push({
      clave: 'busqueda',
      etiqueta: `«${busquedaTexto.trim()}»`
    });
  }
  return chips;
}

export function crearObjetoNuevaOferta({
  aviso,
  usuarioActual,
  usuarioId,
  monto,
  mensaje
}) {
  return {
    id: `of-${Date.now()}`,
    avisoId: aviso.id,
    avisoTitulo: aviso.titulo,
    precioPedido: aviso.precio,
    montoMinimo: aviso.montoMinimo,
    vendedorId: aviso.vendedorId,
    vendedorNombre: aviso.vendedorNombre,
    compradorId: usuarioId,
    compradorNombre: usuarioActual
      ? `${usuarioActual.nombres} ${usuarioActual.apellidos}`
      : 'Diego Alonso Vargas Huamán',
    compradorCarrera: usuarioActual?.carrera || 'Ing. de Sistemas',
    compradorReputacion: usuarioActual?.reputacion || 4.6,
    monto: Number(monto),
    mensaje: mensaje || '¿Podemos coordinar la entrega en el campus?',
    estado: 'Enviada',
    fecha: '17/10/2026',
    movimientos: [
      {
        id: `m-${Date.now()}`,
        autorId: usuarioId,
        autorNombre: usuarioActual?.nombres || 'Comprador',
        rolAutor: 'comprador',
        tipo: 'Oferta enviada',
        monto: Number(monto),
        mensaje: mensaje || '',
        fechaHora: '17/10/2026 · 10:00'
      }
    ]
  };
}
