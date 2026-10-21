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

export default function PerfilVendedorPage() {
  const { id } = useParams();
  const { obtenerUsuarioPorId, usuarioActual } = useAuth();
  const { avisos } = useAviso();
  const { calificaciones, esVendedorConfiable } = useCalificacion();
  const { crearReporte } = useReporte();

  const [filtroAvisos, setFiltroAvisos] = useState('Todos');
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const vendedor = obtenerUsuarioPorId(id || 'u-1') || obtenerUsuarioPorId('u-1');

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
      <div
        className="card-surface"
        style={{
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            className="striped-placeholder"
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--color-primary)'
            }}
          >
            {obtenerIniciales(vendedor?.nombres, vendedor?.apellidos)}
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '4px'
              }}
            >
              <h1 className="title-screen">
                {vendedor?.nombres} {vendedor?.apellidos}
              </h1>
              {confiable && <BadgeEstado estado="Vendedora confiable" />}
            </div>

            <p className="text-aux" style={{ marginBottom: '8px' }}>
              {vendedor?.carrera} · {(vendedor?.ciclo || 'Cuarto').toLowerCase()}{' '}
              ciclo · {vendedor?.antiguedadTexto}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '18px' }}>
                {vendedor?.reputacion || 4.8}
              </strong>
              <Estrellas valor={vendedor?.reputacion || 5} tamano="sm" />
              <Link
                to={`/reputacion/${vendedor?.id}`}
                className="text-aux"
                style={{ textDecoration: 'underline' }}
              >
                ({vendedor?.totalCalificaciones || 11} calificaciones recibidas)
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '24px', display: 'block' }}>
              {vendedor?.acuerdosCerrados || 12}
            </strong>
            <span className="text-aux">acuerdos cerrados</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '24px', display: 'block' }}>
              {avisosDelVendedor.filter((a) => a.estado !== 'Vendido').length}
            </strong>
            <span className="text-aux">avisos activos</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '24px', display: 'block' }}>
              {vendedor?.tiempoRespuesta || '1 d'}
            </strong>
            <span className="text-aux">responde en</span>
          </div>

          <button
            type="button"
            className="btn btn-tertiary btn-sm"
            style={{ color: 'var(--color-error)' }}
            onClick={() => setModalReporteAbierto(true)}
          >
            Reportar usuario
          </button>
        </div>
      </div>

      {/* Avisos publicados del vendedor */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <h2
            className="title-section"
            style={{ color: 'var(--color-primary)' }}
          >
            Avisos publicados
          </h2>

          <div style={{ display: 'flex', gap: '8px' }}>
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
            gap: '14px'
          }}
        >
          {avisosMostrados.map((av) => (
            <TarjetaAviso key={av.id} aviso={av} mostrarCorazon={false} />
          ))}
        </div>
      </div>

      {/* Últimas calificaciones recibidas */}
      <div>
        <h2
          className="title-section"
          style={{ color: 'var(--color-primary)', marginBottom: '16px' }}
        >
          Últimas calificaciones recibidas
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}
        >
          {calificacionesRecibidas.slice(0, 3).map((cal) => (
            <div
              key={cal.id}
              className="card-surface"
              style={{ padding: '18px 20px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}
              >
                <Estrellas valor={cal.puntaje} tamano="sm" />
                <span className="text-aux">{cal.fecha}</span>
              </div>
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                {cal.comentario}
              </p>
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
