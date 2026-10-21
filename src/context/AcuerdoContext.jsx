import { createContext, useContext, useState, useEffect } from 'react';
import { acuerdosIniciales } from '../data/acuerdosData';
import {
  ESTADOS_ACUERDO,
  ESTADOS_AVISO,
  FRANJAS_HORARIAS,
  PUNTOS_ENCUENTRO,
  STORAGE_KEYS
} from '../data/contratoDatos';
import { useAuth } from './AuthContext';
import { useAviso } from './AvisoContext';

const AcuerdoContext = createContext(null);

/**
 * HU-5: al cancelar un acuerdo el aviso vuelve a "Publicado" y al cerrarse la entrega pasa a "Vendido".
 * Es la única escritura que este módulo hace sobre otra entidad (avisos). Si el grupo prefiere
 * que AvisoContext derive ese estado desde los acuerdos, poner esta constante en false.
 */
const SINCRONIZAR_ESTADO_AVISO = true;

const ETAPA_COORDINACION = [ESTADOS_ACUERDO.ESPERANDO_RESPUESTA, ESTADOS_ACUERDO.PROPUESTA_RECIBIDA];
const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const FORMATO_FECHA = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const dos = (n) => String(n).padStart(2, '0');

function ahoraTexto() {
  const d = new Date();
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} · ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

const primerNombre = (nombreCompleto = '') => nombreCompleto.split(' ')[0];
const minusculaInicial = (texto = '') => texto.charAt(0).toLowerCase() + texto.slice(1);

function crearEvento(titulo, autor, color) {
  return {
    id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    titulo,
    detalle: `${ahoraTexto()} · ${autor}`,
    color
  };
}

function generarCodigoEntrega() {
  const tramo = () =>
    Array.from({ length: 3 }, () => ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)]).join('');
  return `${tramo()}-${tramo()}`;
}

/** Validación de la propuesta de encuentro (se repite aquí aunque el formulario también valide). */
function validarEncuentro({ punto, fecha, franja }) {
  const errores = {};
  if (!PUNTOS_ENCUENTRO.includes(punto)) errores.punto = 'Elige un punto de encuentro.';

  const partes = FORMATO_FECHA.exec(fecha || '');
  if (!partes) {
    errores.fecha = 'Elige una fecha.';
  } else {
    const elegida = new Date(Number(partes[3]), Number(partes[2]) - 1, Number(partes[1]));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (elegida < hoy) errores.fecha = 'La fecha no puede ser anterior a hoy.';
  }

  if (!FRANJAS_HORARIAS.includes(franja)) errores.franja = 'Elige una franja horaria.';
  return errores;
}

export function AcuerdoProvider({ children }) {
  const { obtenerUsuarioPorId } = useAuth();
  const { setAvisos, obtenerAvisoPorId } = useAviso();

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

  // ---------- Consultas ----------

  const obtenerAcuerdoPorId = (id) => acuerdos.find((a) => a.id === id) || null;

  /** 'vendedor' | 'comprador' | null (si el usuario no participa en el acuerdo) */
  const rolEnAcuerdo = (acuerdo, usuarioId) => {
    if (!acuerdo || !usuarioId) return null;
    if (acuerdo.vendedorId === usuarioId) return 'vendedor';
    if (acuerdo.compradorId === usuarioId) return 'comprador';
    return null;
  };

  const obtenerAcuerdosDeUsuario = (usuarioId) =>
    acuerdos.filter((a) => rolEnAcuerdo(a, usuarioId) !== null);

  /** Quién envió la última propuesta. Los datos semilla antiguos no lo traen: se infiere. */
  const proponenteDe = (acuerdo) =>
    acuerdo.propuestaPor ||
    (acuerdo.estado === ESTADOS_ACUERDO.PROPUESTA_RECIBIDA ? acuerdo.compradorId : acuerdo.vendedorId);

  /**
   * Estado tal como lo ve cada usuario: durante la coordinación, quien envió la propuesta
   * ve "Esperando respuesta" y quien la recibe ve "Propuesta recibida".
   */
  const estadoParaUsuario = (acuerdo, usuarioId) => {
    if (!ETAPA_COORDINACION.includes(acuerdo.estado)) return acuerdo.estado;
    if (!acuerdo.puntoEncuentro) return ESTADOS_ACUERDO.ESPERANDO_RESPUESTA;
    return proponenteDe(acuerdo) === usuarioId
      ? ESTADOS_ACUERDO.ESPERANDO_RESPUESTA
      : ESTADOS_ACUERDO.PROPUESTA_RECIBIDA;
  };

  // ---------- Utilidades internas ----------

  const nombreEnAcuerdo = (acuerdo, usuarioId) =>
    usuarioId === acuerdo.vendedorId ? acuerdo.vendedorNombre : acuerdo.compradorNombre;

  const actualizar = (id, cambiar) =>
    setAcuerdos((prev) => prev.map((a) => (a.id === id ? cambiar(a) : a)));

  const sincronizarAviso = (avisoId, estadoNuevo) => {
    if (!SINCRONIZAR_ESTADO_AVISO || !avisoId) return;
    setAvisos((prev) => prev.map((av) => (av.id === avisoId ? { ...av, estado: estadoNuevo } : av)));
  };

  const buscarParaActuar = (id, usuarioId) => {
    const acuerdo = acuerdos.find((a) => a.id === id);
    if (!acuerdo) return { error: 'No encontramos este acuerdo.' };
    const rol = rolEnAcuerdo(acuerdo, usuarioId);
    if (!rol) return { error: 'Tu cuenta no tiene permisos sobre este acuerdo.' };
    return { acuerdo, rol };
  };

  // ---------- Acciones ----------

  /**
   * Para HU-4 (Ofertas): llamar al aceptar una oferta y luego navegar a `/acuerdo-generado/${acuerdo.id}`.
   * `oferta` es un objeto de ofertasData. Si ya existe un acuerdo para esa oferta, lo devuelve sin duplicar.
   */
  const crearAcuerdoDesdeOferta = (oferta, { otrasOfertasRechazadas } = {}) => {
    if (!oferta) return { ok: false, error: 'No se encontró la oferta aceptada.' };

    const existente = acuerdos.find(
      (a) => a.ofertaId === oferta.id || (oferta.acuerdoId && a.id === oferta.acuerdoId)
    );
    if (existente) return { ok: true, acuerdo: existente, yaExistia: true };

    const aviso = obtenerAvisoPorId(oferta.avisoId);
    const vendedor = obtenerUsuarioPorId(oferta.vendedorId);
    const comprador = obtenerUsuarioPorId(oferta.compradorId);
    const numeros = acuerdos.map((a) => Number(String(a.id).replace(/\D/g, ''))).filter(Number.isFinite);
    const id = `A-${Math.max(0, ...numeros) + 1}`;

    const nuevo = {
      id,
      ofertaId: oferta.id,
      avisoId: oferta.avisoId,
      avisoTitulo: oferta.avisoTitulo,
      avisoSubtitulo: aviso ? `${aviso.categoria} · ${aviso.curso} · ${aviso.condicion}` : '',
      precioPedido: oferta.precioPedido,
      montoAcordado: oferta.monto,
      vendedorId: oferta.vendedorId,
      vendedorNombre: oferta.vendedorNombre,
      vendedorTelefono: vendedor?.telefono || '',
      compradorId: oferta.compradorId,
      compradorNombre: oferta.compradorNombre,
      compradorCarrera: oferta.compradorCarrera || comprador?.carrera || '',
      compradorReputacion: oferta.compradorReputacion ?? comprador?.reputacion ?? 5,
      compradorTelefono: comprador?.telefono || '',
      estado: ESTADOS_ACUERDO.ESPERANDO_RESPUESTA,
      puntoEncuentro: null,
      fechaEncuentro: null,
      franjaHoraria: null,
      mensajePropuesta: null,
      propuestaPor: null,
      codigoEntrega: null,
      confirmadoVendedor: false,
      confirmadoComprador: false,
      fechaConfirmacionVendedor: null,
      fechaConfirmacionComprador: null,
      pendienteCalificar: false,
      otrasOfertasRechazadas: otrasOfertasRechazadas ?? null,
      fechaGeneracion: ahoraTexto().slice(0, 10),
      trazabilidad: [
        crearEvento(`Oferta aceptada — S/ ${Number(oferta.monto).toFixed(2)}`, oferta.vendedorNombre, 'green')
      ]
    };

    setAcuerdos((prev) => [nuevo, ...prev]);
    return { ok: true, acuerdo: nuevo };
  };

  /** Propone punto y horario, o responde con una alternativa. `fecha` va en formato DD/MM/AAAA. */
  const proponerEncuentro = (id, usuarioId, { punto, fecha, franja, mensaje = '' }) => {
    const { acuerdo, rol, error } = buscarParaActuar(id, usuarioId);
    if (error) return { ok: false, error };
    if (!ETAPA_COORDINACION.includes(acuerdo.estado)) {
      return { ok: false, error: 'Este acuerdo ya no está en coordinación.' };
    }

    const errores = validarEncuentro({ punto, fecha, franja });
    const cantidad = Object.keys(errores).length;
    if (cantidad > 0) {
      return {
        ok: false,
        errores,
        error: `Revisa ${cantidad === 1 ? '1 campo' : `${cantidad} campos`}. Corrige lo marcado en rojo para continuar.`
      };
    }

    const esAlternativa = Boolean(acuerdo.puntoEncuentro) && proponenteDe(acuerdo) !== usuarioId;
    const evento = crearEvento(
      `${esAlternativa ? 'Alternativa' : 'Propuesta de encuentro'}: ${punto} · ${fecha} · ${franja}`,
      nombreEnAcuerdo(acuerdo, usuarioId),
      esAlternativa ? 'orange' : 'blue'
    );

    actualizar(id, (a) => ({
      ...a,
      estado: ESTADOS_ACUERDO.PROPUESTA_RECIBIDA,
      puntoEncuentro: punto,
      fechaEncuentro: fecha,
      franjaHoraria: franja,
      mensajePropuesta: mensaje.trim(),
      propuestaPor: usuarioId,
      trazabilidad: [...a.trazabilidad, evento]
    }));

    const otro = rol === 'vendedor' ? acuerdo.compradorNombre : acuerdo.vendedorNombre;
    return { ok: true, mensaje: `Tu propuesta se envió. Te avisaremos cuando ${primerNombre(otro)} responda.` };
  };

  /** Acepta la propuesta pendiente de la contraparte: queda "Acordado" y se genera el código de entrega. */
  const aceptarPropuesta = (id, usuarioId) => {
    const { acuerdo, error } = buscarParaActuar(id, usuarioId);
    if (error) return { ok: false, error };
    if (!ETAPA_COORDINACION.includes(acuerdo.estado) || !acuerdo.puntoEncuentro) {
      return { ok: false, error: 'No hay una propuesta pendiente por aceptar.' };
    }
    if (proponenteDe(acuerdo) === usuarioId) {
      return { ok: false, error: 'No puedes aceptar tu propia propuesta; espera la respuesta de la otra parte.' };
    }

    const evento = crearEvento('Punto y horario acordados', nombreEnAcuerdo(acuerdo, usuarioId), 'green');
    const codigo = generarCodigoEntrega();

    actualizar(id, (a) => ({
      ...a,
      estado: ESTADOS_ACUERDO.ACORDADO,
      codigoEntrega: codigo,
      confirmadoVendedor: false,
      confirmadoComprador: false,
      fechaConfirmacionVendedor: null,
      fechaConfirmacionComprador: null,
      trazabilidad: [...a.trazabilidad, evento]
    }));

    return { ok: true, mensaje: 'Aceptaste la propuesta. Se generó el código de entrega para ambos.' };
  };

  /** "Modificar punto y horario": anula lo acordado y el código, y vuelve a la coordinación. */
  const reabrirCoordinacion = (id, usuarioId) => {
    const { acuerdo, error } = buscarParaActuar(id, usuarioId);
    if (error) return { ok: false, error };
    if (acuerdo.estado !== ESTADOS_ACUERDO.ACORDADO) {
      return { ok: false, error: 'Solo se puede modificar un acuerdo que está acordado.' };
    }

    const evento = crearEvento('Se reabrió la coordinación del encuentro', nombreEnAcuerdo(acuerdo, usuarioId), 'orange');

    actualizar(id, (a) => ({
      ...a,
      estado: ESTADOS_ACUERDO.ESPERANDO_RESPUESTA,
      puntoEncuentro: null,
      fechaEncuentro: null,
      franjaHoraria: null,
      mensajePropuesta: null,
      propuestaPor: null,
      codigoEntrega: null,
      confirmadoVendedor: false,
      confirmadoComprador: false,
      fechaConfirmacionVendedor: null,
      fechaConfirmacionComprador: null,
      trazabilidad: [...a.trazabilidad, evento]
    }));

    return { ok: true, mensaje: 'El código de entrega anterior quedó sin efecto. Propongan un nuevo punto y horario.' };
  };

  /** Confirma la entrega de la parte que actúa. Cuando confirman ambas, el acuerdo se cierra. */
  const confirmarEntrega = (id, usuarioId) => {
    const { acuerdo, rol, error } = buscarParaActuar(id, usuarioId);
    if (error) return { ok: false, error };
    if (acuerdo.estado !== ESTADOS_ACUERDO.ACORDADO) {
      return { ok: false, error: 'Solo puedes confirmar la entrega de un acuerdo que está acordado.' };
    }

    const campo = rol === 'vendedor' ? 'confirmadoVendedor' : 'confirmadoComprador';
    const campoFecha = rol === 'vendedor' ? 'fechaConfirmacionVendedor' : 'fechaConfirmacionComprador';
    if (acuerdo[campo]) return { ok: false, error: 'Ya confirmaste esta entrega.' };

    const cerrado = rol === 'vendedor' ? acuerdo.confirmadoComprador : acuerdo.confirmadoVendedor;
    const otro = rol === 'vendedor' ? acuerdo.compradorNombre : acuerdo.vendedorNombre;
    const evento = crearEvento(
      cerrado
        ? `Entrega confirmada por ambas partes en ${acuerdo.puntoEncuentro}`
        : `Entrega confirmada por ${nombreEnAcuerdo(acuerdo, usuarioId)}`,
      nombreEnAcuerdo(acuerdo, usuarioId),
      'green'
    );
    const fechaConfirmacion = ahoraTexto();

    actualizar(id, (a) => ({
      ...a,
      [campo]: true,
      [campoFecha]: fechaConfirmacion,
      estado: cerrado ? ESTADOS_ACUERDO.ENTREGADO : a.estado,
      pendienteCalificar: cerrado ? true : a.pendienteCalificar,
      trazabilidad: [...a.trazabilidad, evento]
    }));
    if (cerrado) sincronizarAviso(acuerdo.avisoId, ESTADOS_AVISO.VENDIDO);

    return {
      ok: true,
      cerrado,
      mensaje: cerrado
        ? 'Entrega confirmada por ambos. El aviso pasó a vendido; ya puedes calificar a la contraparte.'
        : `Falta la confirmación de la otra parte. Te avisaremos cuando ${primerNombre(otro)} confirme la entrega.`
    };
  };

  /** Cancela un acuerdo en curso con motivo obligatorio. El aviso vuelve a "Publicado". */
  const cancelarAcuerdo = (id, usuarioId, { motivo, comentario = '' } = {}) => {
    const { acuerdo, rol, error } = buscarParaActuar(id, usuarioId);
    if (error) return { ok: false, error };
    if (acuerdo.estado === ESTADOS_ACUERDO.ENTREGADO || acuerdo.estado === ESTADOS_ACUERDO.CANCELADO) {
      return { ok: false, error: 'Este acuerdo ya está cerrado y no se puede cancelar.' };
    }
    if (!motivo) return { ok: false, error: 'Selecciona un motivo para poder cancelar el acuerdo.' };

    const evento = crearEvento(
      `Acuerdo cancelado: ${minusculaInicial(motivo)}`,
      nombreEnAcuerdo(acuerdo, usuarioId),
      'red'
    );

    actualizar(id, (a) => ({
      ...a,
      estado: ESTADOS_ACUERDO.CANCELADO,
      motivoCancelacion: motivo,
      comentarioCancelacion: comentario.trim(),
      canceladoPor: usuarioId,
      codigoEntrega: null,
      trazabilidad: [...a.trazabilidad, evento]
    }));
    sincronizarAviso(acuerdo.avisoId, ESTADOS_AVISO.PUBLICADO);

    const otro = rol === 'vendedor' ? acuerdo.compradorNombre : acuerdo.vendedorNombre;
    return { ok: true, mensaje: `Acuerdo cancelado. El aviso volvió al catálogo y se notificó a ${otro}.` };
  };

  return (
    <AcuerdoContext.Provider
      value={{
        acuerdos,
        setAcuerdos,
        obtenerAcuerdoPorId,
        obtenerAcuerdosDeUsuario,
        rolEnAcuerdo,
        estadoParaUsuario,
        crearAcuerdoDesdeOferta,
        proponerEncuentro,
        aceptarPropuesta,
        reabrirCoordinacion,
        confirmarEntrega,
        cancelarAcuerdo
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
