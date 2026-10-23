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

  const obtenerAvisosPorVendedor = (vendedorId) => {
    return avisos.filter((a) => a.vendedorId === vendedorId);
  };

  const crearAviso = (datos, estadoInicial = 'Publicado') => {
    const fechaHoy = '17/10/2026';
    const nuevo = {
      id: `av-${Date.now()}`,
      titulo: (datos.titulo || 'Aviso sin título').trim(),
      descripcion: (datos.descripcion || '').trim(),
      categoria: datos.categoria || 'Libros de texto',
      curso: datos.curso || 'Cálculo I',
      condicion: datos.condicion || 'Muy buen estado',
      precio: Number(datos.precio || 0),
      aceptaOfertas: Boolean(datos.aceptaOfertas),
      montoMinimo: datos.aceptaOfertas
        ? Number(datos.montoMinimo || datos.precio || 0)
        : Number(datos.precio || 0),
      estado: estadoInicial,
      fechaPublicacion: estadoInicial === 'Borrador' ? 'Sin publicar' : fechaHoy,
      vendedorId: datos.vendedorId || 'u-1',
      vendedorNombre: datos.vendedorNombre || 'Rosa María Quispe Ríos',
      fotos: Array.isArray(datos.fotos)
        ? datos.fotos.map((f, idx) => ({ ...f, principal: idx === 0 }))
        : [],
      ofertasCount: 0
    };

    setAvisos((prev) => [nuevo, ...prev]);
    return {
      ok: true,
      aviso: nuevo,
      mensaje:
        estadoInicial === 'Borrador'
          ? 'Borrador guardado. Puedes completarlo y publicarlo cuando quieras.'
          : 'Éxito. Tu aviso se publicó correctamente.'
    };
  };

  const editarAviso = (id, cambios) => {
    let avisoActualizado = null;
    setAvisos((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nuevoEstado = cambios.estado || a.estado;
        const fechaPublicacion =
          a.estado === 'Borrador' && nuevoEstado === 'Publicado'
            ? '17/10/2026'
            : a.fechaPublicacion;
        avisoActualizado = {
          ...a,
          ...cambios,
          precio:
            cambios.precio !== undefined ? Number(cambios.precio) : a.precio,
          montoMinimo:
            cambios.montoMinimo !== undefined
              ? Number(cambios.montoMinimo)
              : a.montoMinimo,
          fechaPublicacion
        };
        return avisoActualizado;
      })
    );

    return {
      ok: Boolean(avisoActualizado),
      aviso: avisoActualizado,
      mensaje: 'Éxito. Los cambios del aviso se guardaron correctamente.'
    };
  };

  const cambiarEstadoAviso = (id, nuevoEstado) => {
    let avisoObjetivo = null;
    setAvisos((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        avisoObjetivo = {
          ...a,
          estado: nuevoEstado,
          fechaPublicacion:
            a.fechaPublicacion === 'Sin publicar' && nuevoEstado === 'Publicado'
              ? '17/10/2026'
              : a.fechaPublicacion,
          fechaVenta: nuevoEstado === 'Vendido' ? '17/10/2026' : a.fechaVenta
        };
        return avisoObjetivo;
      })
    );

    const mensajes = {
      Vendido: 'Éxito. El aviso se marcó como vendido y salió del catálogo.',
      Pausado: 'Aviso pausado temporalmente. No aparecerá en las búsquedas hasta que lo reactives.',
      Publicado: 'Éxito. El aviso se reactivó y volvió al catálogo.'
    };

    return {
      ok: Boolean(avisoObjetivo),
      aviso: avisoObjetivo,
      mensaje: mensajes[nuevoEstado] || `El estado cambió a ${nuevoEstado}.`
    };
  };

  const duplicarAvisoComoBorrador = (id) => {
    const original = obtenerAvisoPorId(id);
    if (!original) {
      return { ok: false, error: 'No se encontró el aviso a duplicar.' };
    }

    const copia = {
      ...original,
      id: `av-${Date.now()}`,
      titulo: `${original.titulo} (Copia)`,
      estado: 'Borrador',
      fechaPublicacion: 'Sin publicar',
      ofertasCount: 0
    };

    setAvisos((prev) => [copia, ...prev]);
    return {
      ok: true,
      aviso: copia,
      mensaje: `Éxito. Se creó un nuevo borrador a partir de «${original.titulo}».`
    };
  };

  const eliminarAviso = (id) => {
    const original = obtenerAvisoPorId(id);
    if (!original) {
      return { ok: false, error: 'El aviso no existe.' };
    }
    const ofertasActivas = Number(original.ofertasCount || 0);
    setAvisos((prev) => prev.filter((a) => a.id !== id));

    return {
      ok: true,
      ofertasRechazadas: ofertasActivas,
      mensaje:
        ofertasActivas > 0
          ? `Aviso eliminado. Se rechazaron ${ofertasActivas} ofertas activas y se notificó a los compradores.`
          : `Aviso eliminado. «${original.titulo}» fue retirado de tus publicaciones.`
    };
  };

  const actualizarFotosAviso = (id, nuevasFotos = []) => {
    const normalizadas = nuevasFotos.slice(0, 6).map((f, idx) => ({
      ...f,
      principal: idx === 0
    }));

    setAvisos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, fotos: normalizadas } : a))
    );

    return {
      ok: true,
      fotos: normalizadas,
      mensaje: `Éxito. Se guardaron ${normalizadas.length} fotografías. La primera será la portada del aviso.`
    };
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
        obtenerAvisosPorVendedor,
        crearAviso,
        editarAviso,
        cambiarEstadoAviso,
        duplicarAvisoComoBorrador,
        eliminarAviso,
        actualizarFotosAviso,
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
