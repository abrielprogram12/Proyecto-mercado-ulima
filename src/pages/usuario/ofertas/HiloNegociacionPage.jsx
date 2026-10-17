import { Link } from 'react-router-dom';

/**
 * MÓDULO: Ofertas (Asignado al Integrante 4)
 * Vista 4.4 — Hilo de negociación
 */
export default function HiloNegociacionPage() {
  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/ofertas">Ofertas</Link>
        <span>›</span>
        <span>Hilo de negociación</span>
      </div>
      <div className="card-surface" style={{ padding: '32px' }}>
        <h1 className="title-screen" style={{ marginBottom: '8px' }}>
          Hilo de negociación
        </h1>
        <p className="text-aux">
          Plantilla base lista para el Integrante 4 (`src/pages/usuario/ofertas/HiloNegociacionPage.jsx`).
        </p>
      </div>
    </div>
  );
}
