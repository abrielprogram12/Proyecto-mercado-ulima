import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { ESTADOS_ACUERDO, formatearPrecio } from '../../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../../data/imagenesDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalConfirmarEntrega from '../../../components/Modales/ModalConfirmarEntrega';
import {
  datosContraparte,
  describirEncuentro,
  esEnCurso,
  minusculaInicial,
  textoRelacion,
  textoReputacion,
  tituloNotificacion
} from './acuerdosUtils';
import './acuerdos.css';

/**
 * MÓDULO: Acuerdos de entrega (Integrante 5 · HU-5)
 * Vista 5.3 — Mis acuerdos
 */

const GRUPOS = [
  ['todos', 'Todos'],
  ['curso', 'En curso'],
  ['cerrados', 'Cerrados']
];

function lineaDetalle(acuerdo, estado) {
  if (estado === ESTADOS_ACUERDO.CANCELADO) {
    return `Cancelado: ${minusculaInicial(acuerdo.motivoCancelacion || 'sin motivo registrado')}`;
  }
  if (estado === ESTADOS_ACUERDO.ENTREGADO) {
    return `Entregado en ${acuerdo.puntoEncuentro} · ${acuerdo.fechaEncuentro}`;
  }
  if (estado === ESTADOS_ACUERDO.ACORDADO) return describirEncuentro(acuerdo);
  if (acuerdo.puntoEncuentro) return `Propuesta: ${describirEncuentro(acuerdo)}`;
  return 'Sin punto de encuentro definido';
}

/** Acción principal de cada fila según el estado y lo que le toca hacer al usuario. */
function accionPrincipal(acuerdo, estado, rol) {
  const verDetalle = { texto: 'Ver detalle', clase: 'btn-outline', ruta: `/acuerdos/${acuerdo.id}` };
  switch (estado) {
    case ESTADOS_ACUERDO.ESPERANDO_RESPUESTA:
      return { texto: 'Coordinar', clase: 'btn-primary', ruta: `/acuerdos/${acuerdo.id}/coordinar` };
    case ESTADOS_ACUERDO.PROPUESTA_RECIBIDA:
      return { texto: 'Responder', clase: 'btn-primary', ruta: `/acuerdos/${acuerdo.id}/coordinar` };
    case ESTADOS_ACUERDO.ACORDADO: {
      const yaConfirmo = rol === 'vendedor' ? acuerdo.confirmadoVendedor : acuerdo.confirmadoComprador;
      return yaConfirmo ? verDetalle : { texto: 'Confirmar entrega', clase: 'btn-success', modal: true };
    }
    case ESTADOS_ACUERDO.ENTREGADO:
      return acuerdo.pendienteCalificar
        ? { texto: 'Calificar', clase: 'btn-secondary', ruta: `/acuerdos/${acuerdo.id}/calificar` }
        : verDetalle;
    default:
      return verDetalle;
  }
}

export default function MisAcuerdosPage() {
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { obtenerAvisoPorId } = useAviso();
  const { obtenerAcuerdosDeUsuario, rolEnAcuerdo, estadoParaUsuario, confirmarEntrega } = useAcuerdo();
  const navigate = useNavigate();
  const location = useLocation();

  const [grupo, setGrupo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [notificacion, setNotificacion] = useState(location.state?.notificacion ?? null);
  const [porConfirmar, setPorConfirmar] = useState(null);

  const usuarioId = usuarioActual?.id;
  const acuerdos = obtenerAcuerdosDeUsuario(usuarioId);
  const enCurso = acuerdos.filter((a) => esEnCurso(a.estado));
  const cerrados = acuerdos.filter((a) => !esEnCurso(a.estado));
  const pendientesCalificar = cerrados.filter(
    (a) => a.estado === ESTADOS_ACUERDO.ENTREGADO && a.pendienteCalificar
  ).length;
  const conteo = { todos: acuerdos.length, curso: enCurso.length, cerrados: cerrados.length };

  const pasaFiltroEstado = (a) => filtroEstado === 'todos' || estadoParaUsuario(a, usuarioId) === filtroEstado;
  const secciones = [
    ['En curso', enCurso, grupo !== 'cerrados'],
    ['Cerrados', cerrados, grupo !== 'curso']
  ]
    .map(([titulo, lista, visible]) => [titulo, lista.filter(pasaFiltroEstado), visible])
    .filter(([, lista, visible]) => visible && lista.length > 0);

  const alConfirmarEntrega = () => {
    const resultado = confirmarEntrega(porConfirmar.id, usuarioId);
    setPorConfirmar(null);
    setNotificacion(
      resultado.ok
        ? { tipo: resultado.cerrado ? 'exito' : 'info', mensaje: resultado.mensaje }
        : { tipo: 'error', mensaje: resultado.error }
    );
  };

  const avisoNotificacion = notificacion && (
    <Notificacion
      tipo={notificacion.tipo}
      titulo={tituloNotificacion(notificacion.tipo)}
      mensaje={notificacion.mensaje}
      onClose={() => setNotificacion(null)}
    />
  );

  if (acuerdos.length === 0) {
    return (
      <div className="page-container">
        {avisoNotificacion}
        <h1 className="title-screen">
          Mis acuerdos
        </h1>
        <p className="text-aux">
          Ningún acuerdo todavía
        </p>
        <EstadoVacio
          titulo="Aún no tienes acuerdos de entrega"
          descripcion="Cuando aceptes o te acepten una oferta, se generará un acuerdo para coordinar el encuentro en el campus."
          textoBoton="Explorar catálogo"
          rutaBoton="/catalogo"
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      {avisoNotificacion}

      <div className="acu-encabezado">
        <div>
          <h1 className="title-screen">Mis acuerdos</h1>
          <p className="text-aux">
            {acuerdos.length} {acuerdos.length === 1 ? 'acuerdo' : 'acuerdos'} · {enCurso.length} en curso ·{' '}
            {pendientesCalificar} pendiente{pendientesCalificar === 1 ? '' : 's'} de calificar
          </p>
        </div>

        <div className="acu-filtros">
          <div className="acu-chips" role="group" aria-label="Filtrar por grupo">
            {GRUPOS.map(([clave, texto]) => (
              <button
                key={clave}
                type="button"
                className={`chip chip-selectable ${grupo === clave ? 'active' : ''}`}
                aria-pressed={grupo === clave}
                onClick={() => setGrupo(clave)}
              >
                {texto} · {conteo[clave]}
              </button>
            ))}
          </div>
          <select
            className="form-select"
            aria-label="Filtrar por estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            {Object.values(ESTADOS_ACUERDO).map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>

      {secciones.length === 0 && (
        <EstadoVacio
          icono="🔎"
          titulo="Ningún acuerdo coincide con el filtro"
          descripcion="Prueba con otro estado o muestra todos tus acuerdos."
          textoBoton="Ver todos"
          onAccion={() => {
            setGrupo('todos');
            setFiltroEstado('todos');
          }}
        />
      )}

      {secciones.map(([titulo, lista]) => (
        <section key={titulo} className="acu-seccion">
          <h2 className="label-upper">{titulo}</h2>
          <ul className="acu-lista">
            {lista.map((acuerdo) => {
              const rol = rolEnAcuerdo(acuerdo, usuarioId);
              const estado = estadoParaUsuario(acuerdo, usuarioId);
              const contraparte = datosContraparte(acuerdo, rol, obtenerUsuarioPorId);
              const cerrado = !esEnCurso(acuerdo.estado);
              const accion = accionPrincipal(acuerdo, estado, rol);
              const avisoObj = obtenerAvisoPorId(acuerdo.avisoId) || {
                id: acuerdo.avisoId,
                titulo: acuerdo.avisoTitulo
              };
              const portada = obtenerPortadaAviso(avisoObj);

              return (
                <li key={acuerdo.id} className={`acu-fila card-surface ${cerrado ? 'acu-fila-cerrada' : ''}`}>
                  <div className="acu-fila-miniatura striped-placeholder" aria-hidden="true">
                    <img
                      src={portada}
                      alt={acuerdo.avisoTitulo}
                      className="media-img-cover"
                    />
                  </div>
                  <div className="acu-fila-info">
                    <Link to={`/acuerdos/${acuerdo.id}`} className="acu-fila-titulo">
                      {acuerdo.avisoTitulo}
                    </Link>
                    <p className="text-aux">
                      {acuerdo.id} · {textoRelacion(rol, !cerrado)} {contraparte.nombre}
                      {!cerrado && textoReputacion(contraparte.reputacion) && ` · ${textoReputacion(contraparte.reputacion)}`}
                    </p>
                    <p className={`text-aux ${estado === ESTADOS_ACUERDO.ACORDADO ? 'acu-fuerte' : ''}`}>
                      {lineaDetalle(acuerdo, estado)}
                    </p>
                  </div>
                  <span className="price-text acu-fila-monto">{formatearPrecio(acuerdo.montoAcordado)}</span>
                  <BadgeEstado estado={estado} />
                  <button
                    type="button"
                    className={`btn ${accion.clase}`}
                    onClick={() => (accion.modal ? setPorConfirmar(acuerdo) : navigate(accion.ruta))}
                  >
                    {accion.texto}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {porConfirmar && (
        <ModalConfirmarEntrega
          abierto
          acuerdo={porConfirmar}
          onClose={() => setPorConfirmar(null)}
          onConfirmar={alConfirmarEntrega}
        />
      )}
    </div>
  );
}
