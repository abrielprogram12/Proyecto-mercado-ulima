import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAviso } from '../../context/AvisoContext';
import { useAuth } from '../../context/AuthContext';
import { useReporte } from '../../context/ReporteContext';
import { formatearPrecio, obtenerIniciales } from '../../data/contratoDatos';
import { obtenerFotosEnriquecidasAviso } from '../../data/imagenesDatos';
import GaleriaFotos from '../../components/GaleriaFotos/GaleriaFotos';
import BadgeEstado from '../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../components/Notificacion/Notificacion';
import ModalReporte from '../../components/Modales/ModalReporte';
import './visitante.css';

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

  const fotosGaleria = obtenerFotosEnriquecidasAviso(aviso);

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

      <div className="vis-detalle-columnas">
        <div className="vis-pila">
          <GaleriaFotos
            fotos={fotosGaleria}
            vendido={aviso.estado === 'Vendido'}
          />

          <div className="card-surface vis-tarjeta">
            <h2 className="title-section vis-titulo-primario">Descripción</h2>
            <p className="vis-descripcion">{aviso.descripcion}</p>

            <div className="vis-ficha-meta">
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

        <div className="vis-pila">
          <div className="card-surface vis-tarjeta">
            <div className="vis-espacio-abajo">
              <BadgeEstado estado={aviso.estado} />
            </div>

            <h1 className="title-screen vis-espacio-abajo">{aviso.titulo}</h1>

            <div className="price-text vis-precio-destacado">
              {formatearPrecio(aviso.precio)}
            </div>

            {aviso.aceptaOfertas && (
              <p className="text-aux">
                Acepta ofertas desde {formatearPrecio(aviso.montoMinimo)}
              </p>
            )}

            <div className="vis-chips-fila">
              <BadgeEstado estado={aviso.condicion} />
              {aviso.curso && <span className="chip">{aviso.curso}</span>}
            </div>

            <div className="vis-aviso-sesion">
              Inicia sesión con tu correo institucional para ofertar o guardar este
              aviso en favoritos.
            </div>

            <button
              type="button"
              className="btn btn-primary vis-btn-bloque"
              onClick={() => navigate('/login')}
            >
              Ingresar para ofertar
            </button>

            <button
              type="button"
              className="btn btn-secondary vis-btn-bloque"
              onClick={() => navigate('/login')}
            >
              ♥ Guardar en favoritos
            </button>
          </div>

          <div className="card-surface vis-tarjeta">
            <span className="label-upper">Vendedor</span>

            <div className="vis-vendedor-encabezado">
              <div className="vis-avatar">
                {vendedor?.fotoPerfil ? (
                  <img
                    src={vendedor.fotoPerfil}
                    alt={vendedor.nombres}
                    className="media-img-cover"
                  />
                ) : (
                  inicialesVendedor
                )}
              </div>
              <div>
                <strong className="vis-vendedor-nombre">
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

            <div className="vis-vendedor-reputacion">
              <span>
                <strong>{vendedor?.reputacion || '4.8'}</strong>{' '}
                <span className="vis-estrellas">★★★★★</span>{' '}
                <span className="text-aux">
                  · {vendedor?.acuerdosCerrados || 12} acuerdos cerrados
                </span>
              </span>
              <BadgeEstado estado="Vendedor confiable" />
            </div>

            <Link to={`/vendedor/${aviso.vendedorId}`} className="vis-link-fuerte">
              Ver perfil y sus otros avisos →
            </Link>
          </div>

          <div className="card-surface vis-reportar-fila">
            <span className="text-aux">
              ¿Este aviso incumple las normas del tablón?
            </span>
            <button
              type="button"
              className="btn btn-tertiary btn-sm vis-btn-peligro-texto"
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
