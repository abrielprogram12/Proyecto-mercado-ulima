import { createContext, useContext, useState, useEffect } from 'react';
import { acuerdosIniciales } from '../data/acuerdosData';
import { STORAGE_KEYS } from '../data/contratoDatos';

const AcuerdoContext = createContext(null);

export function AcuerdoProvider({ children }) {
  const [acuerdos, setAcuerdos] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.ACUERDOS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error leyendo acuerdos de localStorage:', err);
    }
    return acuerdosIniciales;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACUERDOS, JSON.stringify(acuerdos));
    } catch (err) {
      console.error('Error guardando acuerdos en localStorage:', err);
    }
  }, [acuerdos]);

  const obtenerAcuerdoPorId = (id) => acuerdos.find((a) => a.id === id) || null;

  return (
    <AcuerdoContext.Provider
      value={{
        acuerdos,
        setAcuerdos,
        obtenerAcuerdoPorId
      }}
    >
      {children}
    </AcuerdoContext.Provider>
  );
}

export function useAcuerdo() {
  const context = useContext(AcuerdoContext);
  if (!context) {
    throw new Error('useAcuerdo debe utilizarse dentro de un <AcuerdoProvider>');
  }
  return context;
}
