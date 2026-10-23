import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { useCalificacion } from '../../../context/CalificacionContext';
import { useReporte } from '../../../context/ReporteContext';
import { obtenerIniciales } from '../../../data/contratoDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import Estrellas from '../../../components/Estrellas/Estrellas';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalReporte from '../../../components/Modales/ModalReporte';
import './catalogo.css';

/**
 * MÓDULO: Catálogo y Búsqueda (Integrante 3 · HU-3)
 * Vista 3.8 — Perfil público del vendedor con avisos publicados y calificaciones
 */
export default function PerfilVendedorPage() {
  const { id } = useParams();
  const { obtenerUsuarioPorId, usuarioActual } = useAuth();
  const { avisos } = useAviso();
  const { calificaciones, esVendedorConfiable } = useCalificacion();
  const { crearReporte } = useReporte();

  const [filtroAvisos, setFiltroAvisos] = useState('Todos');
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const vendedor =
    obtenerUsuarioPorId(id || 'u-1') || obtenerUsuarioPorId('u-1');

  const avisosDelVendedor = useMemo(() => {
    return avisos.filter(
      (a) => a.vendedorId === (vendedor?.id || 'u-1') && a.estado !== 'Borrador'
    );
  }, [avisos, vendedor]);

  const avisosMostrados = useMemo(() => {
    if (filtroAvisos === 'Activos') {
      return avisosDelVendedor.filter((a) => a.estado !== 'Vendido');
    }
    if (filtroAvisos === 'Vendidos') {
      return avisosDelVendedor.filter((a) => a.estado === 'Vendido');
    }
    return avisosDelVendedor;
  }, [avisosDelVendedor, filtroAvisos]);

  const calificacionesRecibidas = useMemo(() => {
    return calificaciones.filter(
      (c) => c.receptorId === (vendedor?.id || 'u-1')
    );
  }, [calificaciones, vendedor]);

  const confiable = esVendedorConfiable(
    vendedor?.acuerdosCerrados || 12,
    vendedor?.reputacion || 4.8
  );

  const handleEnviarReporte = ({ motivo, descripcion }) => {
    const res = crearReporte({
      tipo: 'Usuario',
      elementoId: vendedor.id,
      elementoTitulo: `${vendedor.nombres} ${vendedor.apellidos}`,
      elementoSubtitulo: 'Perfil de usuario',
      usuarioReportadoId: vendedor.id,
      usuarioReportadoNombre: `${vendedor.nombres} ${vendedor.apellidos}`,
      motivo,
      descripcion,
      reportante: usuarioActual
    });

    if (res.ok) {
      setModalReporteAbierto(false);
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
  };

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/catalogo">Catálogo</Link>
        <span>›</span>
        <span>
          Perfil de {vendedor?.nombres} {vendedor?.apellidos}
        </span>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Cabecera del vendedor — Vista 3.8 */}
      <div className="card-surface cat-perfil-cabecera">
        <div className="cat-perfil-identidad">
          <div className="striped-placeholder cat-avatar-grande">
            {vendedor?.fotoPerfil ? (
              <img
                src={vendedor.fotoPerfil}
                alt={`${vendedor.nombres} ${vendedor.apellidos}`}
                className="media-img-cover"
              />
            ) : (
              obtenerIniciales(vendedor?.nombres, vendedor?.apellidos)
            )}
          </div>

          <div>
            <div className="cat-perfil-nombre-fila">
              <h1 className="title-screen">
                {vendedor?.nombres} {vendedor?.apellidos}
              </h1>
              {confiable && <BadgeEstado estado="Vendedora confiable" />}
            </div>

            <p className="text-aux cat-perfil-carrera">
              {vendedor?.carrera} · {(vendedor?.ciclo || 'Cuarto').toLowerCase()}{' '}
              ciclo · {vendedor?.antiguedadTexto}
            </p>

            <div className="cat-perfil-reputacion-fila">
              <strong className="cat-reputacion-num">
                {vendedor?.reputacion || 4.8}
              </strong>
              <Estrellas valor={vendedor?.reputacion || 5} tamano="sm" />
              <Link
                to={`/reputacion/${vendedor?.id}`}
                className="text-aux cat-link-subrayado"
              >
                ({vendedor?.totalCalificaciones || 11} calificaciones recibidas)
              </Link>
            </div>
          </div>
        </div>

        <div className="cat-perfil-metricas">
          <div className="cat-metrica-caja">
            <strong className="cat-metrica-valor">
              {vendedor?.acuerdosCerrados || 12}
            </strong>
            <span className="text-aux">acuerdos cerrados</span>
          </div>
          <div className="cat-metrica-caja">
            <strong className="cat-metrica-valor">
              {avisosDelVendedor.filter((a) => a.estado !== 'Vendido').length}
            </strong>
            <span className="text-aux">avisos activos</span>
          </div>
          <div className="cat-metrica-caja">
            <strong className="cat-metrica-valor">
              {vendedor?.tiempoRespuesta || '1 d'}
            </strong>
            <span className="text-aux">responde en</span>
          </div>

          <button
            type="button"
            className="btn btn-tertiary btn-sm cat-btn-peligro-texto"
            onClick={() => setModalReporteAbierto(true)}
          >
            Reportar usuario
          </button>
        </div>
      </div>

      {/* Avisos publicados del vendedor */}
      <div className="cat-seccion-vendedor">
        <div className="cat-seccion-header">
          <h2 className="title-section cat-titulo-sin-margen">
            Avisos publicados
          </h2>

          <div className="cat-demos-fila">
            {[
              { clave: 'Todos', count: avisosDelVendedor.length },
              {
                clave: 'Activos',
                count: avisosDelVendedor.filter((a) => a.estado !== 'Vendido')
                  .length
              },
              {
                clave: 'Vendidos',
                count: avisosDelVendedor.filter((a) => a.estado === 'Vendido')
                  .length
              }
            ].map((tab) => (
              <button
                key={tab.clave}
                type="button"
                className={`chip chip-selectable ${
                  filtroAvisos === tab.clave ? 'active' : ''
                }`}
                onClick={() => setFiltroAvisos(tab.clave)}
              >
                {tab.clave} · {tab.count}
              </button>
            ))}
          </div>
        </div>

        <div className="cat-vendedor-avisos-grid">
          {avisosMostrados.map((av) => (
            <TarjetaAviso key={av.id} aviso={av} mostrarCorazon={false} />
          ))}
        </div>
      </div>

      {/* Últimas calificaciones recibidas */}
      <div>
        <h2 className="title-section cat-titulo-primario">
          Últimas calificaciones recibidas
        </h2>

        <div className="cat-calificaciones-grid">
          {calificacionesRecibidas.slice(0, 3).map((cal) => (
            <div key={cal.id} className="card-surface cat-calificacion-card">
              <div className="cat-calificacion-head">
                <Estrellas valor={cal.puntaje} tamano="sm" />
                <span className="text-aux">{cal.fecha}</span>
              </div>
              <p className="cat-calificacion-comentario">{cal.comentario}</p>
              <span className="text-aux">
                {cal.emisorNombre} · {cal.emisorCarrera}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ModalReporte
        abierto={modalReporteAbierto}
        onClose={() => setModalReporteAbierto(false)}
        tituloElemento={`${vendedor?.nombres} ${vendedor?.apellidos}`}
        subtituloElemento={`${vendedor?.correo} · ${vendedor?.carrera}`}
        onEnviarReporte={handleEnviarReporte}
      />
    </div>
  );
}
