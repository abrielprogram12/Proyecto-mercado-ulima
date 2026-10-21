import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalEstadoAviso from '../../../components/Modales/ModalEstadoAviso';

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

  const conteos = useMemo(() => {
    return {
      Todos: misAvisos.length,
      Publicado: misAvisos.filter((a) => a.estado === 'Publicado').length,
      Pausado: misAvisos.filter((a) => a.estado === 'Pausado').length,
      Borrador: misAvisos.filter((a) => a.estado === 'Borrador').length,
      Vendido: misAvisos.filter((a) => a.estado === 'Vendido').length
    };
  }, [misAvisos]);

  const totalOfertasPorResponder = useMemo(() => {
    return misAvisos
      .filter((a) => a.estado !== 'Vendido' && a.estado !== 'Borrador')
      .reduce((acc, a) => acc + Number(a.ofertasCount || 0), 0);
  }, [misAvisos]);

  const avisosFiltrados = useMemo(() => {
    return misAvisos.filter((a) => {
      const cumpleEstado =
        filtroEstado === 'Todos' || a.estado === filtroEstado;
      const termino = busqueda.trim().toLowerCase();
      const cumpleBusqueda =
        !termino ||
        a.titulo.toLowerCase().includes(termino) ||
        (a.curso || '').toLowerCase().includes(termino) ||
        (a.categoria || '').toLowerCase().includes(termino);
      return cumpleEstado && cumpleBusqueda;
    });
  }, [misAvisos, filtroEstado, busqueda]);

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1 className="title-screen" style={{ marginBottom: '4px' }}>
            Mis publicaciones
          </h1>
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '18px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { clave: 'Todos', etiqueta: 'Todos' },
            { clave: 'Publicado', etiqueta: 'Publicados' },
            { clave: 'Pausado', etiqueta: 'Pausados' },
            { clave: 'Borrador', etiqueta: 'Borradores' },
            { clave: 'Vendido', etiqueta: 'Vendidos' }
          ].map((tab) => (
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
            className="form-input"
            style={{ maxWidth: '280px', padding: '8px 14px' }}
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
        <div className="card-surface" style={{ overflow: 'visible' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)'
                }}
              >
                <th style={{ padding: '12px 20px' }} className="label-upper">
                  Foto
                </th>
                <th style={{ padding: '12px 16px' }} className="label-upper">
                  Aviso
                </th>
                <th style={{ padding: '12px 16px' }} className="label-upper">
                  Precio
                </th>
                <th style={{ padding: '12px 16px' }} className="label-upper">
                  Estado
                </th>
                <th style={{ padding: '12px 16px' }} className="label-upper">
                  Ofertas
                </th>
                <th style={{ padding: '12px 16px' }} className="label-upper">
                  Publicado
                </th>
                <th
                  style={{ padding: '12px 20px', textAlign: 'right' }}
                  className="label-upper"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {avisosFiltrados.map((aviso) => {
                const esPausado = aviso.estado === 'Pausado';
                const esVendido = aviso.estado === 'Vendido';
                const esBorrador = aviso.estado === 'Borrador';
                const tieneFoto =
                  Array.isArray(aviso.fotos) && aviso.fotos.length > 0;

                return (
                  <tr
                    key={aviso.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: esPausado
                        ? '#FDF2EC'
                        : 'var(--color-surface)',
                      opacity: esVendido ? 0.78 : 1
                    }}
                  >
                    <td style={{ padding: '14px 20px', width: '90px' }}>
                      <div
                        className="striped-placeholder"
                        style={{
                          width: '68px',
                          height: '52px',
                          borderRadius: '6px',
                          fontSize: '11px'
                        }}
                      >
                        {!tieneFoto ? 'sin foto' : ''}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        to={`/aviso/${aviso.id}`}
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-text)',
                          display: 'block',
                          marginBottom: '2px'
                        }}
                      >
                        {aviso.titulo}
                      </Link>
                      <span className="text-aux">
                        {aviso.categoria}
                        {aviso.curso ? ` · ${aviso.curso}` : ''} · {aviso.condicion}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="price-text" style={{ fontSize: '16px' }}>
                        {formatearPrecio(aviso.precio)}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <BadgeEstado estado={aviso.estado} />
                    </td>

                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                      {esBorrador ? (
                        <span className="text-aux">—</span>
                      ) : esVendido ? (
                        <span className="text-aux">Cerrado con 1</span>
                      ) : Number(aviso.ofertasCount || 0) > 0 ? (
                        <Link to="/ofertas" style={{ fontWeight: 600 }}>
                          {aviso.ofertasCount} ofertas
                        </Link>
                      ) : (
                        <span className="text-aux">Sin ofertas</span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="text-aux">{aviso.fechaPublicacion}</span>
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        textAlign: 'right',
                        position: 'relative'
                      }}
                    >
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
                        <div
                          className="card-surface"
                          style={{
                            position: 'absolute',
                            right: '20px',
                            top: '56px',
                            minWidth: '210px',
                            padding: '6px',
                            zIndex: 80,
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left'
                          }}
                        >
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span>
              Mostrando {avisosFiltrados.length} de {misAvisos.length} avisos
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
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
