import { createContext, useContext, useState, useEffect } from 'react';
import { ofertasIniciales } from '../data/ofertasData';
import { STORAGE_KEYS } from '../data/contratoDatos';

const OfertaContext = createContext(null);

export function OfertaProvider({ children }) {
  const [ofertas, setOfertas] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.OFERTAS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error leyendo ofertas de localStorage:', err);
    }
    return ofertasIniciales;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFERTAS, JSON.stringify(ofertas));
    } catch (err) {
      console.error('Error guardando ofertas en localStorage:', err);
    }
  }, [ofertas]);

  const obtenerOfertaPorId = (id) => ofertas.find((o) => o.id === id) || null;

  return (
    <OfertaContext.Provider
      value={{
        ofertas,
        setOfertas,
        obtenerOfertaPorId
      }}
    >
      {children}
    </OfertaContext.Provider>
  );
}

export function useOferta() {
  const context = useContext(OfertaContext);
  if (!context) {
    throw new Error('useOferta debe utilizarse dentro de un <OfertaProvider>');
  }
  return context;
}
