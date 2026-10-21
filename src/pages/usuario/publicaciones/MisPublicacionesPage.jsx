import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalEstadoAviso from '../../../components/Modales/ModalEstadoAviso';
import {
  PESTANAS_MIS_AVISOS,
  calcularConteosAvisos,
  filtrarAvisosVendedor
} from './publicacionesUtils';
import './publicaciones.css';

/**
 * MÓDULO: Publicaciones (Integrante 2 · HU-2)
 * Vistas 2.1, 2.2 y 2.6 — Mis publicaciones, estado vacío y gestión de estado/eliminación
 */
export default function MisPublicacionesPage() {
  const { usuarioActual } = useAuth();
  const {
    avisos,
    cambiarEstadoAviso,
    duplicarAvisoComoBorrador,
    eliminarAviso
  } = useAviso();
  const navigate = useNavigate();

  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [menuAbiertoId, setMenuAbiertoId] = useState(null);
  const [notificacion, setNotificacion] = useState(null);

  // Estado para modales (Vista 2.6)
  const [modalConfig, setModalConfig] = useState({
    abierto: false,
    modo: 'estado',
    aviso: null
  });

  const vendedorId = usuarioActual?.id || 'u-1';

  const misAvisos = useMemo(() => {
    return avisos.filter((a) => a.vendedorId === vendedorId);
  }, [avisos, vendedorId]);

  const conteos = useMemo(() => calcularConteosAvisos(misAvisos), [misAvisos]);

  const totalOfertasPorResponder = useMemo(() => {
    return misAvisos
      .filter((a) => a.estado !== 'Vendido' && a.estado !== 'Borrador')
      .reduce((acc, a) => acc + Number(a.ofertasCount || 0), 0);
  }, [misAvisos]);

  const avisosFiltrados = useMemo(
    () => filtrarAvisosVendedor(misAvisos, filtroEstado, busqueda),
    [misAvisos, filtroEstado, busqueda]
  );

  const handleDuplicar = (aviso) => {
    setMenuAbiertoId(null);
    const res = duplicarAvisoComoBorrador(aviso.id);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  const handleAbrirModal = (aviso, modo) => {
    setMenuAbiertoId(null);
    setModalConfig({
      abierto: true,
      modo,
      aviso
    });
  };

  const handleConfirmarCambioEstado = (nuevoEstado) => {
    if (!modalConfig.aviso) return;
    const res = cambiarEstadoAviso(modalConfig.aviso.id, nuevoEstado);
    setModalConfig({ abierto: false, modo: 'estado', aviso: null });
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  const handleConfirmarEliminar = (aviso) => {
    const res = eliminarAviso(aviso.id);
    setModalConfig({ abierto: false, modo: 'eliminar', aviso: null });
    if (res.ok) {
      setNotificacion({
        tipo: res.ofertasRechazadas > 0 ? 'error' : 'exito',
        mensaje: res.mensaje
      });
    }
  };

  return (
    <div className="page-container">
      {/* Encabezado — Vistas 2.1 y 2.2 */}
      <div className="pub-encabezado">
        <div>
          <h1 className="title-screen">Mis publicaciones</h1>
          <p className="text-aux">
            {misAvisos.length === 0
              ? 'Ningún aviso todavía'
              : `${misAvisos.length} avisos · ${totalOfertasPorResponder} ofertas por responder`}
          </p>
        </div>

        <Link to="/nuevo-aviso" className="btn btn-primary">
          Nuevo aviso
        </Link>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Pestañas de filtro por estado + Buscador */}
      <div className="pub-barra-filtros">
        <div className="pub-chips">
          {PESTANAS_MIS_AVISOS.map((tab) => (
            <button
              key={tab.clave}
              type="button"
              className={`chip chip-selectable ${
                filtroEstado === tab.clave ? 'active' : ''
              }`}
              onClick={() => setFiltroEstado(tab.clave)}
            >
              {tab.etiqueta} · {conteos[tab.clave]}
            </button>
          ))}
        </div>

        {misAvisos.length > 0 && (
          <input
            type="search"
            className="form-input pub-buscador"
            placeholder="Buscar en mis avisos…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        )}
      </div>

      {/* Estado vacío (Vista 2.2) o Tabla de publicaciones (Vista 2.1) */}
      {avisosFiltrados.length === 0 ? (
        <EstadoVacio
          icono="📘"
          titulo="Todavía no publicas nada"
          descripcion="Ese libro del ciclo pasado le puede servir a alguien esta semana. Publicar un aviso toma menos de tres minutos."
          textoBoton="Crear mi primer aviso"
          rutaBoton="/nuevo-aviso"
          textoEnlaceSecundario="Ver cómo funciona el tablón"
          rutaEnlaceSecundario="/#como-funciona"
        />
      ) : (
        <div className="card-surface pub-tabla-contenedor">
          <table className="pub-tabla">
            <thead>
              <tr className="pub-tabla-head">
                <th className="label-upper pub-th-izq">Foto</th>
                <th className="label-upper pub-th">Aviso</th>
                <th className="label-upper pub-th">Precio</th>
                <th className="label-upper pub-th">Estado</th>
                <th className="label-upper pub-th">Ofertas</th>
                <th className="label-upper pub-th">Publicado</th>
                <th className="label-upper pub-th-der">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {avisosFiltrados.map((aviso) => {
                const esPausado = aviso.estado === 'Pausado';
                const esVendido = aviso.estado === 'Vendido';
                const esBorrador = aviso.estado === 'Borrador';
                const tieneFoto =
                  Array.isArray(aviso.fotos) && aviso.fotos.length > 0;
                const clasesFila = [
                  'pub-fila',
                  esPausado ? 'pub-fila-pausada' : '',
                  esVendido ? 'pub-fila-vendida' : ''
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <tr key={aviso.id} className={clasesFila}>
                    <td className="pub-td-foto">
                      <div className="striped-placeholder pub-miniatura-tabla">
                        {!tieneFoto ? 'sin foto' : ''}
                      </div>
                    </td>

                    <td className="pub-td">
                      <Link
                        to={`/aviso/${aviso.id}`}
                        className="pub-link-titulo"
                      >
                        {aviso.titulo}
                      </Link>
                      <span className="text-aux">
                        {aviso.categoria}
                        {aviso.curso ? ` · ${aviso.curso}` : ''} · {aviso.condicion}
                      </span>
                    </td>

                    <td className="pub-td">
                      <span className="price-text pub-precio-celda">
                        {formatearPrecio(aviso.precio)}
                      </span>
                    </td>

                    <td className="pub-td">
                      <BadgeEstado estado={aviso.estado} />
                    </td>

                    <td className="pub-td-ofertas">
                      {esBorrador ? (
                        <span className="text-aux">—</span>
                      ) : esVendido ? (
                        <span className="text-aux">Cerrado con 1</span>
                      ) : Number(aviso.ofertasCount || 0) > 0 ? (
                        <Link to="/ofertas" className="pub-link-ofertas">
                          {aviso.ofertasCount} ofertas
                        </Link>
                      ) : (
                        <span className="text-aux">Sin ofertas</span>
                      )}
                    </td>

                    <td className="pub-td">
                      <span className="text-aux">{aviso.fechaPublicacion}</span>
                    </td>

                    <td className="pub-td-acciones">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() =>
                          setMenuAbiertoId((prev) =>
                            prev === aviso.id ? null : aviso.id
                          )
                        }
                      >
                        Acciones ▾
                      </button>

                      {menuAbiertoId === aviso.id && (
                        <div className="card-surface pub-menu-acciones">
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => navigate(`/editar-aviso/${aviso.id}`)}
                          >
                            Editar aviso
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() =>
                              navigate(`/aviso/${aviso.id}/fotografias`)
                            }
                          >
                            Gestionar fotografías
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => handleAbrirModal(aviso, 'estado')}
                          >
                            Cambiar estado…
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => handleDuplicar(aviso)}
                          >
                            Duplicar como borrador
                          </button>
                          <button
                            type="button"
                            className="dropdown-item dropdown-logout"
                            onClick={() => handleAbrirModal(aviso, 'eliminar')}
                          >
                            Eliminar aviso…
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pub-paginacion">
            <span>
              Mostrando {avisosFiltrados.length} de {misAvisos.length} avisos
            </span>
            <div className="pub-paginacion-botones">
              <button type="button" className="btn btn-outline btn-sm" disabled>
                ‹
              </button>
              <button type="button" className="btn btn-primary btn-sm">
                1
              </button>
              <button type="button" className="btn btn-outline btn-sm" disabled>
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalEstadoAviso
        abierto={modalConfig.abierto}
        modo={modalConfig.modo}
        aviso={modalConfig.aviso}
        onClose={() =>
          setModalConfig({ abierto: false, modo: 'estado', aviso: null })
        }
        onConfirmarEstado={handleConfirmarCambioEstado}
        onConfirmarEliminar={handleConfirmarEliminar}
      />
    </div>
  );
}
