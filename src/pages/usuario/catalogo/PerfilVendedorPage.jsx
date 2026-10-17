import { Link } from 'react-router-dom';

/**
 * MÓDULO: Catálogo y búsqueda (Asignado al Integrante 3)
 * Vista 3.8 — Perfil público del vendedor
 */
export default function PerfilVendedorPage() {
  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/catalogo">Catálogo</Link>
        <span>›</span>
        <span>Perfil del vendedor</span>
      </div>
      <div className="card-surface" style={{ padding: '32px' }}>
        <h1 className="title-screen" style={{ marginBottom: '8px' }}>
          Perfil público del vendedor
        </h1>
        <p className="text-aux">
          Plantilla base lista para el Integrante 3 (`src/pages/usuario/catalogo/PerfilVendedorPage.jsx`).
        </p>
      </div>
    </div>
  );
}
