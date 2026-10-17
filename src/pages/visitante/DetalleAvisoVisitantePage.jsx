import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAviso } from '../../context/AvisoContext';
import { useAuth } from '../../context/AuthContext';
import { useReporte } from '../../context/ReporteContext';
import { formatearPrecio, obtenerIniciales } from '../../data/contratoDatos';
import GaleriaFotos from '../../components/GaleriaFotos/GaleriaFotos';
import BadgeEstado from '../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../components/Notificacion/Notificacion';
import ModalReporte from '../../components/Modales/ModalReporte';

export default function DetalleAvisoVisitantePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerAvisoPorId, avisos } = useAviso();
  const { obtenerUsuarioPorId } = useAuth();
  const { crearReporte } = useReporte();

  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const aviso = obtenerAvisoPorId(id) || avisos[0];
  const vendedor = obtenerUsuarioPorId(aviso?.vendedorId);

  if (!aviso) {
    return null;
  }

  const inicialesVendedor = vendedor
    ? obtenerIniciales(vendedor.nombres, vendedor.apellidos)
    : 'RQ';

  const handleEnviarReporte = ({ motivo, descripcion }) => {
    const res = crearReporte({
      tipo: 'Aviso',
      elementoId: aviso.id,
      elementoTitulo: aviso.titulo,
      elementoSubtitulo: `Aviso de ${aviso.vendedorNombre}`,
      usuarioReportadoId: aviso.vendedorId,
      usuarioReportadoNombre: aviso.vendedorNombre,
      motivo,
      descripcion
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
        <span>{aviso.categoria}</span>
        {aviso.curso && (
          <>
            <span>›</span>
            <span>{aviso.curso}</span>
          </>
        )}
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '32px',
          alignItems: 'start'
        }}
      >
        {/* Columna izquierda: Galería + Descripción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GaleriaFotos
            fotos={aviso.fotos}
            vendido={aviso.estado === 'Vendido'}
          />

          <div className="card-surface" style={{ padding: '24px 28px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '12px' }}
            >
              Descripción
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--color-text)' }}>
              {aviso.descripcion}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border)'
              }}
            >
              <div>
                <span className="label-upper">Categoría</span>
                <strong>{aviso.categoria}</strong>
              </div>
              <div>
                <span className="label-upper">Curso</span>
                <strong>{aviso.curso || 'General'}</strong>
              </div>
              <div>
                <span className="label-upper">Estado</span>
                <strong>{aviso.condicion}</strong>
              </div>
              <div>
                <span className="label-upper">Publicado</span>
                <strong>{aviso.fechaPublicacion}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Ficha de precio sin sesión + Vendedor + Reportar (Vista 3.4) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card-surface" style={{ padding: '26px' }}>
            <div style={{ marginBottom: '10px' }}>
              <BadgeEstado estado={aviso.estado} />
            </div>

            <h1 className="title-screen" style={{ marginBottom: '10px' }}>
              {aviso.titulo}
            </h1>

            <div
              className="price-text"
              style={{ fontSize: '30px', lineHeight: '36px', marginBottom: '4px' }}
            >
              {formatearPrecio(aviso.precio)}
            </div>

            {aviso.aceptaOfertas && (
              <p className="text-aux" style={{ marginBottom: '12px' }}>
                Acepta ofertas desde {formatearPrecio(aviso.montoMinimo)}
              </p>
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <BadgeEstado estado={aviso.condicion} />
              {aviso.curso && <span className="chip">{aviso.curso}</span>}
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-info-bg)',
                border: '1px solid #B7D4F0',
                borderRadius: 'var(--radius-btn)',
                padding: '14px 16px',
                fontSize: '14px',
                color: 'var(--color-text)',
                marginBottom: '16px'
              }}
            >
              Inicia sesión con tu correo institucional para ofertar o guardar este
              aviso en favoritos.
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={() => navigate('/login')}
            >
              Ingresar para ofertar
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              ♥ Guardar en favoritos
            </button>
          </div>

          {/* Tarjeta del vendedor */}
          <div className="card-surface" style={{ padding: '22px 24px' }}>
            <span className="label-upper" style={{ marginBottom: '12px' }}>
              Vendedor
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {inicialesVendedor}
              </div>
              <div>
                <strong style={{ display: 'block' }}>
                  {vendedor
                    ? `${vendedor.nombres} ${vendedor.apellidos}`
                    : aviso.vendedorNombre}
                </strong>
                <span className="text-aux">
                  {vendedor?.carrera || 'Administración'} ·{' '}
                  {(vendedor?.ciclo || 'cuarto').toLowerCase()} ciclo · en el tablón
                  desde 03/2026
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                <strong>{vendedor?.reputacion || '4.8'}</strong>{' '}
                <span style={{ color: '#C97A2B' }}>★★★★★</span>{' '}
                <span className="text-aux">
                  · {vendedor?.acuerdosCerrados || 12} acuerdos cerrados
                </span>
              </span>
              <BadgeEstado estado="Vendedor confiable" />
            </div>

            <Link
              to={`/vendedor/${aviso.vendedorId}`}
              style={{ fontWeight: 600, fontSize: '14px' }}
            >
              Ver perfil y sus otros 5 avisos →
            </Link>
          </div>

          {/* Bloque de reportar aviso */}
          <div
            className="card-surface"
            style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span className="text-aux">
              ¿Este aviso incumple las normas del tablón?
            </span>
            <button
              type="button"
              className="btn btn-tertiary btn-sm"
              style={{ color: 'var(--color-error)' }}
              onClick={() => setModalReporteAbierto(true)}
            >
              Reportar aviso
            </button>
          </div>
        </div>
      </div>

      <ModalReporte
        abierto={modalReporteAbierto}
        onClose={() => setModalReporteAbierto(false)}
        tituloElemento={aviso.titulo}
        subtituloElemento={`Publicado por ${aviso.vendedorNombre} · ${aviso.fechaPublicacion}`}
        onEnviarReporte={handleEnviarReporte}
      />
    </div>
  );
}
