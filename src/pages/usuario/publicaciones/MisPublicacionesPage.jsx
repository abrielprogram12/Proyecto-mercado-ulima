import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../../data/imagenesDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalEstadoAviso from '../../../components/Modales/ModalEstadoAviso';
import {
  PESTAÑAS_ESTADO_PUBLICACION,
  calcularConteosPorEstado,
  filtrarPublicaciones
} from './publicacionesUtils';
import './publicaciones.css';

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
  const [notificacion, setNotificacion] = useState(null);

  // Estados para los modales de confirmación (Vista 2.6)
  const [avisoParaEliminar, setAvisoParaEliminar] = useState(null);
  const [avisoParaEstado, setAvisoParaEstado] = useState(null);
  const [estadoSugeridoModal, setEstadoSugeridoModal] = useState('Vendido');

  const misAvisos = useMemo(() => {
    const idVendedor = usuarioActual?.id || 'u-1';
    return avisos.filter((a) => a.vendedorId === idVendedor);
  }, [avisos, usuarioActual]);

  const conteos = useMemo(() => {
    return calcularConteosPorEstado(misAvisos);
  }, [misAvisos]);

  const avisosFiltrados = useMemo(() => {
    return filtrarPublicaciones(misAvisos, filtroEstado, busqueda);
  }, [misAvisos, filtroEstado, busqueda]);

  const handleConfirmarEliminar = () => {
    if (!avisoParaEliminar) return;
    const res = eliminarAviso(avisoParaEliminar.id);
    setAvisoParaEliminar(null);
    if (res.ok) {
      setNotificacion({
        tipo: 'advertencia',
        mensaje: res.mensaje
      });
    }
  };

  const abrirModalEstado = (aviso, sugerido) => {
    setAvisoParaEstado(aviso);
    setEstadoSugeridoModal(sugerido);
  };

  const handleConfirmarEstado = (nuevoEstado) => {
    if (!avisoParaEstado) return;
    const res = cambiarEstadoAviso(avisoParaEstado.id, nuevoEstado);
    setAvisoParaEstado(null);
    if (res.ok) {
      setNotificacion({
        tipo: nuevoEstado === 'Pausado' ? 'info' : 'exito',
        mensaje: res.mensaje
      });
    }
  };

  const handleDuplicar = (id) => {
    const res = duplicarAvisoComoBorrador(id);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  return (
    <div className="page-container">
      {/* Encabezado — Vista 2.1 */}
      <div className="pub-header-row">
        <div>
          <h1 className="title-screen">Mis publicaciones</h1>
          <p className="text-aux pub-header-subtitle">
            Administra tus avisos activos, pausados, borradores y vendidos.
          </p>
        </div>

        <Link to="/nuevo-aviso" className="btn btn-primary">
          + Publicar nuevo aviso
        </Link>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Pestañas por estado y buscador */}
      <div className="pub-filters-bar">
        <div className="pub-tabs-group">
          {PESTAÑAS_ESTADO_PUBLICACION.map((tab) => {
            const activo = filtroEstado === tab.clave;
            return (
              <button
                key={tab.clave}
                type="button"
                className={`chip chip-selectable ${activo ? 'active' : ''}`}
                onClick={() => setFiltroEstado(tab.clave)}
              >
                {tab.etiqueta} · {conteos[tab.clave]}
              </button>
            );
          })}
        </div>

        <input
          type="search"
          className="form-input pub-search-input"
          placeholder="Buscar en mis avisos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Estado vacío (Vista 2.2) o Tabla de publicaciones (Vista 2.1) */}
      {avisosFiltrados.length === 0 ? (
        <EstadoVacio
          icono="📚"
          titulo="Aún no tienes avisos publicados"
          descripcion="Publica los libros, calculadoras o materiales que ya no uses para que otro estudiante de la universidad los aproveche este ciclo."
          textoBoton="+ Publicar mi primer aviso"
          rutaBoton="/nuevo-aviso"
        />
      ) : (
        <div className="card-surface pub-table-card">
          <table className="pub-table">
            <thead>
              <tr className="pub-thead-row">
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
              {avisosFiltrados.map((av) => {
                const portadaUrl = obtenerPortadaAviso(av);
                return (
                <tr key={av.id} className="pub-tr">
                  <td className="pub-td-izq">
                    <div className="striped-placeholder pub-miniatura">
                      {portadaUrl && (
                        <img
                          src={portadaUrl}
                          alt={av.titulo}
                          className="media-img-cover"
                        />
                      )}
                    </div>
                  </td>

                  <td className="pub-td">
                    <Link
                      to={`/aviso/${av.id}`}
                      className="pub-titulo-link"
                    >
                      {av.titulo}
                    </Link>
                    <div className="text-aux">
                      {av.categoria} · {av.curso} · {av.condicion}
                    </div>
                  </td>

                  <td className="pub-td">
                    <div className="price-text pub-precio-principal">
                      {formatearPrecio(av.precio)}
                    </div>
                    <span className="text-aux pub-precio-minimo">
                      {av.aceptaOfertas
                        ? `mín. ${formatearPrecio(av.montoMinimo)}`
                        : 'precio fijo'}
                    </span>
                  </td>

                  <td className="pub-td">
                    <BadgeEstado estado={av.estado} />
                  </td>

                  <td className="pub-td">
                    {av.estado === 'Vendido' ? (
                      <span className="text-aux">Cerrado por acuerdo</span>
                    ) : av.ofertasCount > 0 ? (
                      <Link to="/ofertas" className="pub-link-ofertas">
                        {av.ofertasCount}{' '}
                        {av.ofertasCount === 1 ? 'activa' : 'activas'} →
                      </Link>
                    ) : (
                      <span className="text-aux">Sin ofertas</span>
                    )}
                  </td>

                  <td className="pub-td">
                    <span className="text-aux">
                      {av.estado === 'Vendido' && av.fechaVenta
                        ? `Vendido ${av.fechaVenta}`
                        : av.fechaPublicacion}
                    </span>
                  </td>

                  <td className="pub-td-der">
                    <div className="pub-acciones-celda">
                      {av.estado === 'Borrador' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/editar-aviso/${av.id}`)}
                          >
                            Completar y publicar
                          </button>
                          <button
                            type="button"
                            className="btn btn-tertiary btn-sm pub-btn-peligro"
                            onClick={() => setAvisoParaEliminar(av)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}

                      {av.estado === 'Publicado' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/editar-aviso/${av.id}`)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                              navigate(`/aviso/${av.id}/fotografias`)
                            }
                          >
                            Fotos
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => abrirModalEstado(av, 'Pausado')}
                          >
                            Pausar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => abrirModalEstado(av, 'Vendido')}
                          >
                            Marcar vendido
                          </button>
                          <button
                            type="button"
                            className="btn btn-tertiary btn-sm pub-btn-peligro"
                            onClick={() => setAvisoParaEliminar(av)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}

                      {av.estado === 'Pausado' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/editar-aviso/${av.id}`)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => abrirModalEstado(av, 'Publicado')}
                          >
                            Reactivar
                          </button>
                          <button
                            type="button"
                            className="btn btn-tertiary btn-sm pub-btn-peligro"
                            onClick={() => setAvisoParaEliminar(av)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}

                      {av.estado === 'Vendido' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/aviso/${av.id}`)}
                          >
                            Ver detalle
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDuplicar(av.id)}
                          >
                            Duplicar como borrador
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación inferior */}
      {avisosFiltrados.length > 0 && (
        <div className="pub-table-footer">
          <span>
            Mostrando 1–{avisosFiltrados.length} de {avisosFiltrados.length}{' '}
            publicaciones
          </span>
          <div className="pub-pagination">
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
      )}

      {/* Modales de Confirmación — Vista 2.6 */}
      <ModalEstadoAviso
        abierto={Boolean(avisoParaEliminar)}
        onClose={() => setAvisoParaEliminar(null)}
        aviso={avisoParaEliminar}
        modo="eliminar"
        onConfirmarEliminar={handleConfirmarEliminar}
      />

      <ModalEstadoAviso
        abierto={Boolean(avisoParaEstado)}
        onClose={() => setAvisoParaEstado(null)}
        aviso={avisoParaEstado}
        modo="estado"
        estadoInicial={estadoSugeridoModal}
        onConfirmarEstado={handleConfirmarEstado}
      />
    </div>
  );
}
