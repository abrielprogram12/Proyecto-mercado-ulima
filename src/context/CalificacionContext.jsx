import { createContext, useContext, useState, useEffect } from 'react';
import { calificacionesIniciales } from '../data/calificacionesData';
import { STORAGE_KEYS } from '../data/contratoDatos';

const CalificacionContext = createContext(null);

export function CalificacionProvider({ children }) {
  const [calificaciones, setCalificaciones] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.CALIFICACIONES);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error leyendo calificaciones de localStorage:', err);
    }
    return calificacionesIniciales;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CALIFICACIONES,
        JSON.stringify(calificaciones)
      );
    } catch (err) {
      console.error('Error guardando calificaciones en localStorage:', err);
    }
  }, [calificaciones]);

  const esVendedorConfiable = (acuerdosCerrados = 0, promedio = 0) => {
    return Number(acuerdosCerrados) >= 10 && Number(promedio) >= 4.5;
  };

  /**
   * Publicar nueva calificación (1 por acuerdo y por parte — HU-6 · Vista 6.1)
   */
  const publicarCalificacion = ({
    acuerdoId = 'A-2201',
    avisoTitulo = 'Juego de escuadras y escalímetro Faber',
    emisorId = 'u-1',
    emisorNombre = 'Rosa María Quispe Ríos',
    emisorCarrera = 'Administración',
    receptorId = 'u-6',
    receptorNombre = 'Carla Huamaní Bravo',
    receptorCarrera = 'Arquitectura',
    puntaje,
    aspectos = [],
    comentario = ''
  }) => {
    if (!puntaje || Number(puntaje) < 1 || Number(puntaje) > 5) {
      return {
        ok: false,
        error: 'Selecciona un puntaje para publicar tu calificación.'
      };
    }

    const nueva = {
      id: `cal-${Date.now()}`,
      acuerdoId,
      avisoTitulo,
      emisorId,
      emisorNombre,
      emisorCarrera,
      receptorId,
      receptorNombre,
      receptorCarrera,
      puntaje: Number(puntaje),
      aspectos,
      comentario: comentario.trim(),
      fecha: '01/09/2026',
      editableHasta: '08/09/2026',
      dentroDePlazo: true
    };

    setCalificaciones((prev) => [nueva, ...prev]);

    return {
      ok: true,
      calificacion: nueva,
      mensaje: `Éxito. Tu calificación se publicó en el perfil de ${receptorNombre}.`
    };
  };

  /**
   * Editar calificación (solo permitida dentro de los 7 días posteriores a la entrega — HU-6)
   */
  const editarCalificacion = (id, { puntaje, aspectos, comentario }) => {
    const objetivo = calificaciones.find((c) => c.id === id);
    if (!objetivo) {
      return { ok: false, error: 'No se encontró la calificación.' };
    }
    if (!objetivo.dentroDePlazo) {
      return {
        ok: false,
        error: 'Plazo vencido. Ya no puedes editar esta calificación.'
      };
    }

    setCalificaciones((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              puntaje: Number(puntaje || c.puntaje),
              aspectos: aspectos || c.aspectos,
              comentario:
                comentario !== undefined ? comentario.trim() : c.comentario
            }
          : c
      )
    );

    return {
      ok: true,
      mensaje: 'Éxito. Tu calificación fue actualizada.'
    };
  };

  /**
   * Eliminar calificación emitida dentro del plazo de 7 días (HU-6 · Vista 6.3)
   */
  const eliminarCalificacion = (id) => {
    const objetivo = calificaciones.find((c) => c.id === id);
    if (!objetivo) {
      return { ok: false, error: 'No se encontró la calificación.' };
    }
    if (!objetivo.dentroDePlazo) {
      return {
        ok: false,
        error: 'Plazo vencido. Ya no puedes eliminar esta calificación.'
      };
    }

    setCalificaciones((prev) => prev.filter((c) => c.id !== id));
    return {
      ok: true,
      mensaje: 'Calificación eliminada correctamente.'
    };
  };

  return (
    <CalificacionContext.Provider
      value={{
        calificaciones,
        setCalificaciones,
        esVendedorConfiable,
        publicarCalificacion,
        editarCalificacion,
        eliminarCalificacion
      }}
    >
      {children}
    </CalificacionContext.Provider>
  );
}

export function useCalificacion() {
  const context = useContext(CalificacionContext);
  if (!context) {
    throw new Error(
      'useCalificacion debe utilizarse dentro de un <CalificacionProvider>'
    );
  }
  return context;
}
