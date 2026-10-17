import { createContext, useContext, useState, useEffect } from 'react';
import { reportesIniciales } from '../data/reportesData';
import { STORAGE_KEYS } from '../data/contratoDatos';

const ReporteContext = createContext(null);

export function ReporteProvider({ children }) {
  const [reportes, setReportes] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.REPORTES);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
        ? `${reportante.nombres} ${reportante.apellidos}`
        : 'Estudiante ULima',
      fecha: '16/10/2026',
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

  return (
    <ReporteContext.Provider
      value={{
        reportes,
        setReportes,
        crearReporte
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
