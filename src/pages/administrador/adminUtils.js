/**
 * Opciones de periodo para el Tablero de Métricas (HU-7 · Vista 7.4)
 */
export const OPCIONES_PERIODO_METRICAS = [
  { id: '7dias', label: '7 días' },
  { id: '30dias', label: '30 días' },
  { id: 'todo', label: 'Todo el periodo' }
];

/**
 * Filtra la lista de reportes según pestaña de estado, tipo y búsqueda (Vista 7.1)
 */
export function filtrarReportesBandeja(
  reportes = [],
  { tabEstado = 'Todos', filtroTipo = 'Todos', busqueda = '' } = {}
) {
  return reportes.filter((r) => {
    if (tabEstado === 'Nuevos' && r.estado !== 'Nuevo') return false;
    if (tabEstado === 'En revisión' && r.estado !== 'En revisión') return false;
    if (tabEstado === 'Resueltos' && r.estado !== 'Resuelto') return false;
    if (tabEstado === 'Descartados' && r.estado !== 'Descartado') return false;

    if (filtroTipo !== 'Todos' && r.tipo !== filtroTipo) return false;

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      const coincide =
        r.id.toLowerCase().includes(q) ||
        (r.elementoTitulo || '').toLowerCase().includes(q) ||
        (r.usuarioReportadoNombre || '').toLowerCase().includes(q) ||
        (r.reportanteNombre || '').toLowerCase().includes(q) ||
        (r.motivo || '').toLowerCase().includes(q);
      if (!coincide) return false;
    }

    return true;
  });
}

/**
 * Verifica si una cuenta de estudiante está bloqueada
 */
export function esUsuarioBloqueado(u) {
  return u?.estadoCuenta === 'Bloqueado' || u?.estadoCuenta === 'Bloqueada';
}

/**
 * Verifica si una cuenta activa tiene reportes acumulados
 */
export function usuarioTieneReportes(u) {
  return (
    !esUsuarioBloqueado(u) &&
    ((u?.reportesAcumulados || 0) > 0 ||
      (u?.estadoCuenta || '').toLowerCase().includes('reporte'))
  );
}

/**
 * Filtra las cuentas de estudiantes en Gestión de Usuarios (Vista 7.3)
 */
export function filtrarUsuariosPadron(
  cuentasEstudiantes = [],
  {
    tabActivo = 'Todos',
    filtroCarrera = 'Todas',
    filtroReputacion = 'Todas',
    busqueda = ''
  } = {}
) {
  return cuentasEstudiantes.filter((u) => {
    if (
      tabActivo === 'Activos' &&
      (esUsuarioBloqueado(u) || usuarioTieneReportes(u))
    ) {
      return false;
    }
    if (tabActivo === 'Con reportes' && !usuarioTieneReportes(u)) {
      return false;
    }
    if (tabActivo === 'Bloqueados' && !esUsuarioBloqueado(u)) {
      return false;
    }

    if (filtroCarrera !== 'Todas' && u.carrera !== filtroCarrera) {
      return false;
    }

    if (filtroReputacion === 'Alta' && (u.reputacion || 0) < 4.5) {
      return false;
    }
    if (
      filtroReputacion === 'Baja' &&
      ((u.reputacion || 0) >= 4.0 || (u.totalCalificaciones || 0) === 0)
    ) {
      return false;
    }
    if (
      filtroReputacion === 'Sin calificaciones' &&
      (u.totalCalificaciones || 0) > 0
    ) {
      return false;
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      const nombreCompleto = `${u.nombres} ${u.apellidos}`.toLowerCase();
      const coincide =
        nombreCompleto.includes(q) ||
        (u.correo || '').toLowerCase().includes(q) ||
        (u.carrera || '').toLowerCase().includes(q);
      if (!coincide) return false;
    }

    return true;
  });
}

/**
 * Obtiene la clase de ancho porcentual para barras analíticas en TableroMetricasPage
 */
export function obtenerClaseAnchoPorcentaje(porcentaje = 0) {
  return `adm-w-${porcentaje}`;
}

/**
 * Obtiene la clase de color semántico según el estado de oferta en el desglose analítico
 */
export function obtenerClaseColorOferta(estado = '') {
  if (estado === 'Aceptadas') return 'adm-seg-bg--aceptadas';
  if (estado === 'Contraoferta') return 'adm-seg-bg--contraoferta';
  if (estado === 'Pendientes') return 'adm-seg-bg--pendientes';
  return 'adm-seg-bg--rechazadas';
}
