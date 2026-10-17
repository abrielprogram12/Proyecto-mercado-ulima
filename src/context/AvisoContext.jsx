import { createContext, useContext, useState, useEffect } from 'react';
import { avisosIniciales, favoritosInicialesPorUsuario } from '../data/avisosData';
import { STORAGE_KEYS } from '../data/contratoDatos';

const AvisoContext = createContext(null);

export function AvisoProvider({ children }) {
  const [avisos, setAvisos] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.AVISOS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error leyendo avisos de localStorage:', err);
    }
    return avisosIniciales;
  });

  const [favoritosPorUsuario, setFavoritosPorUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEYS.FAVORITOS);
      if (guardado) return JSON.parse(guardado);
    } catch (err) {
      console.error('Error leyendo favoritos de localStorage:', err);
    }
    return favoritosInicialesPorUsuario;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AVISOS, JSON.stringify(avisos));
    } catch (err) {
      console.error('Error guardando avisos en localStorage:', err);
    }
  }, [avisos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(favoritosPorUsuario));
    } catch (err) {
      console.error('Error guardando favoritos en localStorage:', err);
    }
  }, [favoritosPorUsuario]);

  const obtenerAvisoPorId = (id) => {
    return avisos.find((a) => a.id === id) || null;
  };

  const obtenerAvisosPublicados = () => {
    return avisos.filter((a) => a.estado === 'Publicado');
  };

  const toggleFavorito = (usuarioId, avisoId) => {
    if (!usuarioId) return false;
    setFavoritosPorUsuario((prev) => {
      const actuales = prev[usuarioId] || [];
      const existe = actuales.includes(avisoId);
      const nuevos = existe
        ? actuales.filter((id) => id !== avisoId)
        : [...actuales, avisoId];
      return { ...prev, [usuarioId]: nuevos };
    });
    return true;
  };

  const esFavorito = (usuarioId, avisoId) => {
    if (!usuarioId) return false;
    return (favoritosPorUsuario[usuarioId] || []).includes(avisoId);
  };

  return (
    <AvisoContext.Provider
      value={{
        avisos,
        setAvisos,
        favoritosPorUsuario,
        obtenerAvisoPorId,
        obtenerAvisosPublicados,
        toggleFavorito,
        esFavorito
      }}
    >
      {children}
    </AvisoContext.Provider>
  );
}

export function useAviso() {
  const context = useContext(AvisoContext);
  if (!context) {
    throw new Error('useAviso debe utilizarse dentro de un <AvisoProvider>');
  }
  return context;
}
