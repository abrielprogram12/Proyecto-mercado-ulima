import { createContext, useContext, useState, useEffect } from 'react';
import { ofertasIniciales } from '../data/ofertasData';
import { STORAGE_KEYS, formatearPrecio } from '../data/contratoDatos';

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

  /**
   * Envío de nueva oferta (HU-4)
   * Valida que el comprador no sea el propio vendedor, 1 sola oferta activa por aviso y usuario, y monto mínimo si aplica.
   */
  const enviarOferta = ({ aviso, comprador, monto, mensaje }) => {
    if (!aviso || !comprador) {
      return { ok: false, error: 'Datos incompletos para enviar la oferta.' };
    }

    if (aviso.vendedorId === comprador.id) {
      return {
        ok: false,
        error: 'No puedes enviar una oferta sobre tu propia publicación.'
      };
    }

    const activaExistente = ofertas.find(
      (o) =>
        o.avisoId === aviso.id &&
        o.compradorId === comprador.id &&
        (o.estado === 'Enviada' || o.estado === 'Contraofertada')
    );

    if (activaExistente) {
      return {
        ok: false,
        error: `Ya tienes una oferta activa de ${formatearPrecio(activaExistente.monto)} en este aviso.`
      };
    }

    const montoNum = Number(monto || 0);
    if (aviso.aceptaOfertas && montoNum < Number(aviso.montoMinimo || 0)) {
      return {
        ok: false,
        error: `El vendedor no acepta ofertas por debajo de ${formatearPrecio(aviso.montoMinimo)}.`
      };
    }

    const nueva = {
      id: `of-${Date.now()}`,
      avisoId: aviso.id,
      avisoTitulo: aviso.titulo,
      precioPedido: aviso.precio,
      montoMinimo: aviso.montoMinimo,
      vendedorId: aviso.vendedorId,
      vendedorNombre: aviso.vendedorNombre,
      compradorId: comprador.id,
      compradorNombre: `${comprador.nombres} ${comprador.apellidos}`,
      compradorCarrera: comprador.carrera,
      compradorReputacion: comprador.reputacion || 4.8,
      monto: montoNum,
      mensaje: mensaje || 'Oferta enviada al vendedor',
      estado: 'Enviada',
      fecha: '04/09/2026',
      movimientos: [
        {
          id: `m-${Date.now()}`,
          autorId: comprador.id,
          autorNombre: `${comprador.nombres.split(' ')[0]} ${comprador.apellidos.split(' ')[0]}`,
          rolAutor: 'comprador',
          tipo: 'Oferta enviada',
          monto: montoNum,
          notaMonto: `sobre ${formatearPrecio(aviso.precio)} pedidos`,
          mensaje: mensaje || '',
          fechaHora: '04/09/2026 · 10:30'
        }
      ]
    };

    setOfertas((prev) => [nueva, ...prev]);
    return {
      ok: true,
      oferta: nueva,
      mensaje: `Éxito. Tu oferta de ${formatearPrecio(montoNum)} se envió. Te avisaremos cuando el vendedor responda.`
    };
  };

  /**
   * Aceptar oferta o contraoferta (HU-4)
   * Rechaza automáticamente las demás ofertas activas del mismo aviso.
   */
  const aceptarOferta = (ofertaId, codigoAcuerdoExterno, montoFinalAcordado) => {
    const objetivo = obtenerOfertaPorId(ofertaId);
    if (!objetivo) {
      return { ok: false, error: 'No se encontró la oferta.' };
    }

    const montoCerrado =
      montoFinalAcordado !== undefined
        ? Number(montoFinalAcordado)
        : Number(objetivo.monto);

    const codigoAcuerdo = codigoAcuerdoExterno || objetivo.acuerdoId || 'A-2314';
    const otrasRechazadas = ofertas.filter(
      (o) =>
        o.id !== ofertaId &&
        o.avisoId === objetivo.avisoId &&
        (o.estado === 'Enviada' || o.estado === 'Contraofertada')
    ).length;

    setOfertas((prev) =>
      prev.map((o) => {
        if (o.id === ofertaId) {
          return {
            ...o,
            monto: montoCerrado,
            estado: 'Aceptada',
            acuerdoId: codigoAcuerdo,
            mensaje: `aceptada por ${formatearPrecio(montoCerrado)}`
          };
        }
        if (
          o.avisoId === objetivo.avisoId &&
          (o.estado === 'Enviada' || o.estado === 'Contraofertada')
        ) {
          return {
            ...o,
            estado: 'Rechazada',
            mensaje: 'Rechazada automáticamente al aceptarse otra oferta'
          };
        }
        return o;
      })
    );

    return {
      ok: true,
      acuerdoId: codigoAcuerdo,
      oferta: {
        ...objetivo,
        monto: montoCerrado,
        estado: 'Aceptada',
        acuerdoId: codigoAcuerdo
      },
      otrasOfertasRechazadas: otrasRechazadas,
      mensaje: `Oferta aceptada. Se generó el acuerdo ${codigoAcuerdo}.`
    };
  };

  /**
   * Rechazar oferta (HU-4)
   */
  const rechazarOferta = (ofertaId) => {
    setOfertas((prev) =>
      prev.map((o) => (o.id === ofertaId ? { ...o, estado: 'Rechazada' } : o))
    );
    return {
      ok: true,
      mensaje: 'La negociación fue rechazada y se notificó a la contraparte.'
    };
  };

  /**
   * Enviar contraoferta del vendedor y registrar en el hilo de negociación (HU-4 · Vistas 4.4 y 4.5)
   */
  const enviarContraoferta = (
    ofertaId,
    { monto, mensaje, autorNombre = 'Vendedor', rolAutor = 'vendedor' }
  ) => {
    const montoNum = Number(monto || 0);
    setOfertas((prev) =>
      prev.map((o) => {
        if (o.id !== ofertaId) return o;
        const nuevoMov = {
          id: `m-${Date.now()}`,
          autorId: rolAutor === 'vendedor' ? o.vendedorId : o.compradorId,
          autorNombre,
          rolAutor,
          tipo: 'Contraoferta',
          monto: montoNum,
          notaMonto:
            rolAutor === 'vendedor'
              ? `propuesta del vendedor sobre ${formatearPrecio(o.precioPedido)}`
              : `nueva propuesta del comprador`,
          mensaje: mensaje || '',
          fechaHora: '04/09/2026 · 12:40'
        };
        if (rolAutor === 'comprador') {
          return {
            ...o,
            estado: 'Contraofertada',
            monto: montoNum,
            mensaje: `nueva propuesta de ${formatearPrecio(montoNum)} enviada`,
            movimientos: [...(o.movimientos || []), nuevoMov]
          };
        }
        return {
          ...o,
          estado: 'Contraofertada',
          montoContraoferta: montoNum,
          mensaje: `contraoferta de ${formatearPrecio(montoNum)} pendiente`,
          movimientos: [...(o.movimientos || []), nuevoMov]
        };
      })
    );

    return {
      ok: true,
      mensaje:
        rolAutor === 'comprador'
          ? `Éxito. Se envió tu nueva propuesta de ${formatearPrecio(montoNum)} al vendedor.`
          : `Éxito. Se envió tu contraoferta de ${formatearPrecio(montoNum)} al comprador.`
    };
  };

  /**
   * Retirar oferta enviada mientras no haya sido respondida (HU-4 · Vista 4.2)
   */
  const retirarOferta = (ofertaId) => {
    const objetivo = obtenerOfertaPorId(ofertaId);
    if (!objetivo || objetivo.estado !== 'Enviada') {
      return {
        ok: false,
        error: 'Solo puedes retirar tu oferta mientras el vendedor no haya respondido.'
      };
    }

    setOfertas((prev) => prev.filter((o) => o.id !== ofertaId));
    return {
      ok: true,
      mensaje: 'Oferta retirada. Puedes enviar una nueva cuando quieras.'
    };
  };

  return (
    <OfertaContext.Provider
      value={{
        ofertas,
        setOfertas,
        obtenerOfertaPorId,
        enviarOferta,
        aceptarOferta,
        rechazarOferta,
        enviarContraoferta,
        retirarOferta
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
