import { Link, useParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import GaleriaFotos from '../../../components/GaleriaFotos/GaleriaFotos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';

/**
 * MÓDULO: Catálogo y búsqueda (Asignado al Integrante 3)
 * Vista 3.5 / 3.6 — Detalle del aviso (Rol Usuario)
 */
export default function DetalleAvisoUsuarioPage() {
  const { id } = useParams();
  const { obtenerAvisoPorId, avisos } = useAviso();
  const aviso = obtenerAvisoPorId(id) || avisos[0];

  if (!aviso) return null;

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/catalogo">Catálogo</Link>
        <span>›</span>
        <span>{aviso.categoria}</span>
        <span>›</span>
        <span>{aviso.curso}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
        <GaleriaFotos fotos={aviso.fotos} vendido={aviso.estado === 'Vendido'} />
        <div className="card-surface" style={{ padding: '24px' }}>
          <BadgeEstado estado={aviso.estado} />
          <h1 className="title-screen" style={{ margin: '10px 0' }}>
            {aviso.titulo}
          </h1>
          <div className="price-text" style={{ fontSize: '28px', marginBottom: '12px' }}>
            {formatearPrecio(aviso.precio)}
          </div>
          <p className="text-aux">
            Plantilla base lista para el Integrante 3 (`DetalleAvisoUsuarioPage.jsx`).
          </p>
        </div>
      </div>
    </div>
  );
}
