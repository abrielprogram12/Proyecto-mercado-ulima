import { createContext, useContext, useState, useEffect } from 'react';
import { reportesIniciales } from '../data/reportesData';
import { STORAGE_KEYS } from '../data/contratoDatos';

const ReporteContext = createContext(null);

const METRICAS_POR_PERIODO = {
  '7dias': {
    etiqueta: 'Últimos 7 días',
    kpis: [
      { etiqueta: 'AVISOS ACTIVOS', valor: '124', tendencia: '+6 en 7 días' },
      { etiqueta: 'ACUERDOS CERRADOS', valor: '19', tendencia: '+14 % vs. sem. ant.' },
      { etiqueta: 'OFERTAS ENVIADAS', valor: '68', tendencia: '28 % aceptadas' },
      { etiqueta: 'TIEMPO AL ACUERDO', valor: '1.9 d', tendencia: 'mediana en 7 días' },
      { etiqueta: 'REPORTES ABIERTOS', valor: '5', tendencia: '3 nuevos · 2 en rev.', alerta: true }
    ],
    categorias: [
      { nombre: 'Libros de texto', cantidad: 52, porcentaje: 100 },
      { nombre: 'Calculadoras y electrónica', cantidad: 26, porcentaje: 50 },
      { nombre: 'Apuntes y separatas', cantidad: 21, porcentaje: 40 },
      { nombre: 'Batas y laboratorio', cantidad: 12, porcentaje: 23 },
      { nombre: 'Instrumentos y dibujo', cantidad: 8, porcentaje: 15 },
      { nombre: 'Laptops y accesorios', cantidad: 5, porcentaje: 10 }
    ],
    puntosEncuentro: [
      { puesto: 1, nombre: 'Biblioteca', acuerdos: 8, porcentaje: 42 },
      { puesto: 2, nombre: 'Puerta 1', acuerdos: 5, porcentaje: 26 },
      { puesto: 3, nombre: 'Cafetería E', acuerdos: 3, porcentaje: 16 },
      { puesto: 4, nombre: 'Patio H', acuerdos: 2, porcentaje: 11 },
      { puesto: 5, nombre: 'Explanada', acuerdos: 1, porcentaje: 5 }
    ],
    ofertasTotal: 68,
    ofertasDesglose: [
      { estado: 'Aceptadas', cantidad: 19, porcentaje: 28, color: '#2E6B3E' },
      { estado: 'En contraoferta', cantidad: 14, porcentaje: 21, color: '#B8621B' },
      { estado: 'Pendientes', cantidad: 12, porcentaje: 18, color: '#2B5B84' },
      { estado: 'Rechazadas', cantidad: 23, porcentaje: 33, color: '#9E9388' }
    ],
    moderacion: [
      { etiqueta: 'Reportes recibidos en el periodo', valor: '6' },
      { etiqueta: 'Resueltos con retiro de aviso', valor: '2' },
      { etiqueta: 'Resueltos con bloqueo de cuenta', valor: '1' },
      { etiqueta: 'Descartados por improcedentes', valor: '1' },
      { etiqueta: 'Tiempo mediano de resolución', valor: '5 h 40 min' }
    ]
  },
  '30dias': {
    etiqueta: 'Últimos 30 días',
    kpis: [
      { etiqueta: 'AVISOS ACTIVOS', valor: '124', tendencia: '+18 % vs. mes ant.' },
      { etiqueta: 'ACUERDOS CERRADOS', valor: '86', tendencia: '+24 % vs. mes ant.' },
      { etiqueta: 'OFERTAS ENVIADAS', valor: '312', tendencia: '28 % aceptadas' },
      { etiqueta: 'TIEMPO AL ACUERDO', valor: '2.3 d', tendencia: 'mediana de cierre' },
      { etiqueta: 'REPORTES ABIERTOS', valor: '5', tendencia: '3 nuevos · 2 en rev.', alerta: true }
    ],
    categorias: [
      { nombre: 'Libros de texto', cantidad: 52, porcentaje: 100 },
      { nombre: 'Calculadoras y electrónica', cantidad: 26, porcentaje: 50 },
      { nombre: 'Apuntes y separatas', cantidad: 21, porcentaje: 40 },
      { nombre: 'Batas y laboratorio', cantidad: 12, porcentaje: 23 },
      { nombre: 'Instrumentos y dibujo', cantidad: 8, porcentaje: 15 },
      { nombre: 'Laptops y accesorios', cantidad: 5, porcentaje: 10 }
    ],
    puntosEncuentro: [
      { puesto: 1, nombre: 'Biblioteca', acuerdos: 34, porcentaje: 40 },
      { puesto: 2, nombre: 'Puerta 1', acuerdos: 22, porcentaje: 26 },
      { puesto: 3, nombre: 'Cafetería E', acuerdos: 14, porcentaje: 16 },
      { puesto: 4, nombre: 'Patio H', acuerdos: 10, porcentaje: 12 },
      { puesto: 5, nombre: 'Explanada', acuerdos: 6, porcentaje: 7 }
    ],
    ofertasTotal: 312,
    ofertasDesglose: [
      { estado: 'Aceptadas', cantidad: 86, porcentaje: 28, color: '#2E6B3E' },
      { estado: 'En contraoferta', cantidad: 64, porcentaje: 21, color: '#B8621B' },
      { estado: 'Pendientes', cantidad: 48, porcentaje: 15, color: '#2B5B84' },
      { estado: 'Rechazadas', cantidad: 114, porcentaje: 36, color: '#9E9388' }
    ],
    moderacion: [
      { etiqueta: 'Reportes recibidos en el periodo', valor: '19' },
      { etiqueta: 'Resueltos con retiro de aviso', valor: '7' },
      { etiqueta: 'Resueltos con bloqueo de cuenta', valor: '3' },
      { etiqueta: 'Descartados por improcedentes', valor: '4' },
      { etiqueta: 'Tiempo mediano de resolución', valor: '6 h 20 min' }
    ]
  },
  todo: {
    etiqueta: 'Todo el periodo (2026)',
    kpis: [
      { etiqueta: 'AVISOS ACTIVOS', valor: '124', tendencia: '412 históricos' },
      { etiqueta: 'ACUERDOS CERRADOS', valor: '248', tendencia: '94 % entrega efectiva' },
      { etiqueta: 'OFERTAS ENVIADAS', valor: '890', tendencia: '28 % aceptadas' },
      { etiqueta: 'TIEMPO AL ACUERDO', valor: '2.5 d', tendencia: 'mediana histórica' },
      { etiqueta: 'REPORTES ABIERTOS', valor: '5', tendencia: '3 nuevos · 2 en rev.', alerta: true }
    ],
    categorias: [
      { nombre: 'Libros de texto', cantidad: 175, porcentaje: 100 },
      { nombre: 'Calculadoras y electrónica', cantidad: 88, porcentaje: 50 },
      { nombre: 'Apuntes y separatas', cantidad: 72, porcentaje: 41 },
      { nombre: 'Batas y laboratorio', cantidad: 38, porcentaje: 22 },
      { nombre: 'Instrumentos y dibujo', cantidad: 24, porcentaje: 14 },
      { nombre: 'Laptops y accesorios', cantidad: 15, porcentaje: 9 }
    ],
    puntosEncuentro: [
      { puesto: 1, nombre: 'Biblioteca', acuerdos: 98, porcentaje: 40 },
      { puesto: 2, nombre: 'Puerta 1', acuerdos: 64, porcentaje: 26 },
      { puesto: 3, nombre: 'Cafetería E', acuerdos: 40, porcentaje: 16 },
      { puesto: 4, nombre: 'Patio H', acuerdos: 29, porcentaje: 12 },
      { puesto: 5, nombre: 'Explanada', acuerdos: 17, porcentaje: 7 }
    ],
    ofertasTotal: 890,
    ofertasDesglose: [
      { estado: 'Aceptadas', cantidad: 248, porcentaje: 28, color: '#2E6B3E' },
      { estado: 'En contraoferta', cantidad: 185, porcentaje: 21, color: '#B8621B' },
      { estado: 'Pendientes', cantidad: 132, porcentaje: 15, color: '#2B5B84' },
      { estado: 'Rechazadas', cantidad: 325, porcentaje: 36, color: '#9E9388' }
    ],
    moderacion: [
      { etiqueta: 'Reportes recibidos en el periodo', valor: '54' },
      { etiqueta: 'Resueltos con retiro de aviso', valor: '21' },
      { etiqueta: 'Resueltos con bloqueo de cuenta', valor: '8' },
      { etiqueta: 'Descartados por improcedentes', valor: '20' },
      { etiqueta: 'Tiempo mediano de resolución', valor: '6 h 45 min' }
    ]
  }
};

export function ReporteProvider({ children }) {
  const [reportes, setReportes] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.REPORTES);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((r) => r.id));
          const faltantes = reportesIniciales.filter((r) => !ids.has(r.id));
          return [...parsed, ...faltantes];
        }
      }
    } catch (err) {
      console.error('Error leyendo reportes de localStorage:', err);
    }
    return reportesIniciales;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTES, JSON.stringify(reportes));
    } catch (err) {
      console.error('Error guardando reportes en localStorage:', err);
    }
  }, [reportes]);

  /**
   * Crea un nuevo reporte desde el catálogo o perfil de vendedor
   */
  const crearReporte = ({
    tipo = 'Aviso',
    elementoId,
    elementoTitulo,
    elementoSubtitulo,
    usuarioReportadoId,
    usuarioReportadoNombre,
    motivo,
    descripcion,
    reportante
  }) => {
    if (!motivo || !descripcion || descripcion.trim().length < 30) {
      return {
        ok: false,
        error: 'Faltan datos. Selecciona un motivo y describe el problema (mínimo 30 caracteres).'
      };
    }

    const nuevoCodigo = `R-${1043 + reportes.length}`;
    const nuevo = {
      id: nuevoCodigo,
      tipo,
      elementoId,
      elementoTitulo,
      elementoSubtitulo,
      usuarioReportadoId,
      usuarioReportadoNombre,
      motivo,
      descripcion: descripcion.trim(),
      reportanteId: reportante?.id || 'visitante',
      reportanteNombre: reportante
        ? `${reportante.nombres.split(' ')[0]} ${reportante.apellidos.split(' ')[0]}`
        : 'Estudiante ULima',
      reportanteNombreCompleto: reportante
        ? `${reportante.nombres} ${reportante.apellidos}`
        : 'Estudiante ULima',
      reportanteCarrera: reportante?.carrera || 'Ing. de Sistemas',
      reportanteReputacion: reportante?.reputacion || 4.8,
      fecha: '04/09/2026',
      hora: '16:00',
      estado: 'Nuevo',
      notaBitacora: ''
    };

    setReportes((prev) => [nuevo, ...prev]);
    return {
      ok: true,
      reporte: nuevo,
      mensaje: `Reporte enviado. Recibimos tu reporte ${nuevoCodigo}; te avisaremos cuando se resuelva.`
    };
  };

  const obtenerReportePorId = (id) => {
    return reportes.find((r) => r.id === id) || null;
  };

  const obtenerReportesDeUsuario = (usuarioId) => {
    if (!usuarioId) return [];
    return reportes.filter((r) => r.usuarioReportadoId === usuarioId);
  };

  /**
   * Pasa un reporte de "Nuevo" a "En revisión" cuando el administrador lo abre o presiona Revisar
   */
  const iniciarRevision = (reporteId) => {
    setReportes((prev) =>
      prev.map((r) =>
        r.id === reporteId && r.estado === 'Nuevo'
          ? { ...r, estado: 'En revisión' }
          : r
      )
    );
  };

  /**
   * Guarda o actualiza la nota interna de bitácora de un reporte
   */
  const guardarNotaBitacora = (reporteId, notaBitacora) => {
    setReportes((prev) =>
      prev.map((r) =>
        r.id === reporteId ? { ...r, notaBitacora } : r
      )
    );
    return {
      ok: true,
      mensaje: 'Nota guardada en la bitácora del reporte.'
    };
  };

  /**
   * Resuelve un reporte (por retiro de aviso o bloqueo de cuenta)
   */
  const resolverReporte = (reporteId, { accion, notaBitacora }) => {
    const notaFinal =
      (notaBitacora || '').trim() ||
      (accion === 'retirar_aviso'
        ? 'Se retiró el aviso reportado tras verificar el incumplimiento de las normas.'
        : 'Se bloqueó la cuenta del usuario reportado por reincidencia.');

    setReportes((prev) =>
      prev.map((r) =>
        r.id === reporteId
          ? {
              ...r,
              estado: 'Resuelto',
              accionTomada: accion,
              notaBitacora: notaFinal,
              fechaResolucion: '04/09/2026'
            }
          : r
      )
    );

    return {
      ok: true,
      mensaje:
        accion === 'retirar_aviso'
          ? `Reporte ${reporteId} resuelto. El aviso fue retirado del catálogo y se notificó a las partes.`
          : `Reporte ${reporteId} resuelto. La cuenta fue bloqueada y se registró en la bitácora.`
    };
  };

  /**
   * Descarta un reporte improcedente
   */
  const descartarReporte = (reporteId, notaBitacora) => {
    const notaFinal =
      (notaBitacora || '').trim() ||
      'Reporte descartado tras revisar las evidencias; no infringe las normas del tablón.';

    setReportes((prev) =>
      prev.map((r) =>
        r.id === reporteId
          ? {
              ...r,
              estado: 'Descartado',
              accionTomada: 'descartado',
              notaBitacora: notaFinal,
              fechaResolucion: '04/09/2026'
            }
          : r
      )
    );

    return {
      ok: true,
      mensaje: `Reporte ${reporteId} marcado como Descartado.`
    };
  };

  const obtenerConteosReportes = () => {
    return {
      todos: reportes.length,
      nuevos: reportes.filter((r) => r.estado === 'Nuevo').length,
      enRevision: reportes.filter((r) => r.estado === 'En revisión').length,
      resueltos: reportes.filter((r) => r.estado === 'Resuelto').length,
      descartados: reportes.filter((r) => r.estado === 'Descartado').length
    };
  };

  const obtenerMetricasPorPeriodo = (periodo = '30dias') => {
    const base = METRICAS_POR_PERIODO[periodo] || METRICAS_POR_PERIODO['30dias'];
    const conteos = obtenerConteosReportes();
    const abiertos = conteos.nuevos + conteos.enRevision;

    return {
      ...base,
      kpis: base.kpis.map((kpi, idx) =>
        idx === 4
          ? {
              ...kpi,
              valor: String(abiertos),
              tendencia: `${conteos.nuevos} nuevos · ${conteos.enRevision} en rev.`
            }
          : kpi
      )
    };
  };

  return (
    <ReporteContext.Provider
      value={{
        reportes,
        setReportes,
        crearReporte,
        obtenerReportePorId,
        obtenerReportesDeUsuario,
        iniciarRevision,
        guardarNotaBitacora,
        resolverReporte,
        descartarReporte,
        obtenerConteosReportes,
        obtenerMetricasPorPeriodo
      }}
    >
      {children}
    </ReporteContext.Provider>
  );
}

export function useReporte() {
  const context = useContext(ReporteContext);
  if (!context) {
    throw new Error('useReporte debe utilizarse dentro de un <ReporteProvider>');
  }
  return context;
}
