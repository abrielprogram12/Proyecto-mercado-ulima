import { formatearPrecio, obtenerIniciales } from '../../../data/contratoDatos';

export const PESTAÑAS_ESTADO_OFERTA = [
  { clave: 'Todas', etiqueta: 'Todas' },
  { clave: 'Enviada', etiqueta: 'Enviadas' },
  { clave: 'Contraofertada', etiqueta: 'Contraofertadas' },
  { clave: 'Aceptada', etiqueta: 'Aceptadas' },
  { clave: 'Rechazada', etiqueta: 'Rechazadas' }
];

export function calcularConteosOfertas(lista = []) {
  return {
    Todas: lista.length,
    Enviada: lista.filter((o) => o.estado === 'Enviada').length,
    Contraofertada: lista.filter((o) => o.estado === 'Contraofertada').length,
    Aceptada: lista.filter((o) => o.estado === 'Aceptada').length,
    Rechazada: lista.filter((o) => o.estado === 'Rechazada').length
  };
}

export function filtrarOfertasPorEstado(lista = [], filtroEstado = 'Todas') {
  if (filtroEstado === 'Todas') return lista;
  return lista.filter((o) => o.estado === filtroEstado);
}

export function agruparOfertasPorAviso(recibidasFiltradas = []) {
  const mapa = new Map();
  recibidasFiltradas.forEach((of) => {
    if (!mapa.has(of.avisoId)) {
      mapa.set(of.avisoId, {
        avisoId: of.avisoId,
        avisoTitulo: of.avisoTitulo,
        precioPedido: of.precioPedido,
        montoMinimo: of.montoMinimo,
        ofertas: []
      });
    }
    mapa.get(of.avisoId).ofertas.push(of);
  });

  return Array.from(mapa.values()).map((grupo) => {
    const ordenadas = [...grupo.ofertas].sort(
      (a, b) => Number(b.monto) - Number(a.monto)
    );
    const activas = ordenadas.filter(
      (o) => o.estado === 'Enviada' || o.estado === 'Contraofertada'
    );
    const mejorMonto =
      activas.length > 0
        ? Math.max(...activas.map((o) => Number(o.monto)))
        : null;
    const acuerdoGenerado = ordenadas.find((o) => o.acuerdoId)?.acuerdoId;

    return {
      ...grupo,
      mejorMonto,
      acuerdoGenerado,
      ofertas: ordenadas.map((o) => ({
        ...o,
        esMejorOferta:
          mejorMonto !== null &&
          o.estado === 'Enviada' &&
          Number(o.monto) === mejorMonto
      }))
    };
  });
}

export function obtenerMovimientosHilo(oferta) {
  if (!oferta) return [];
  if (Array.isArray(oferta.movimientos) && oferta.movimientos.length > 0) {
    return oferta.movimientos;
  }
  return [
    {
      id: 'm-def-1',
      autorNombre: oferta.compradorNombre,
      rolAutor: 'comprador',
      tipo: 'Oferta enviada',
      monto: oferta.monto,
      notaMonto: `sobre ${formatearPrecio(oferta.precioPedido)} pedidos`,
      mensaje: oferta.mensaje,
      fechaHora: `${oferta.fecha} · 14:20`
    }
  ];
}

export function obtenerInicialesComprador(nombreCompleto = 'Lucía Ramírez') {
  const partes = (nombreCompleto || 'Lucía Ramírez').split(' ');
  return obtenerIniciales(partes[0], partes[1] || '');
}
