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
      localStorage.setItem(STORAGE_KEYS.CALIFICACIONES, JSON.stringify(calificaciones));
    } catch (err) {
      console.error('Error guardando calificaciones en localStorage:', err);
    }
  }, [calificaciones]);

  const esVendedorConfiable = (acuerdosCerrados = 0, promedio = 0) => {
    return Number(acuerdosCerrados) >= 10 && Number(promedio) >= 4.5;
  };

  return (
    <CalificacionContext.Provider
      value={{
        calificaciones,
        setCalificaciones,
        esVendedorConfiable
      }}
    >
      {children}
    </CalificacionContext.Provider>
  );
}

export function useCalificacion() {
  const context = useContext(CalificacionContext);
  if (!context) {
    throw new Error('useCalificacion debe utilizarse dentro de un <CalificacionProvider>');
  }
  return context;
}
