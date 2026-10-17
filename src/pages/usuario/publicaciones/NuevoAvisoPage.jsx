import { Link } from 'react-router-dom';

/**
 * MÓDULO: Publicaciones (Asignado al Integrante 2)
 * Vista 2.3 / 2.4 — Nuevo aviso y edición
 */
export default function NuevoAvisoPage() {
  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/mis-publicaciones">Mis publicaciones</Link>
        <span>›</span>
        <span>Nuevo aviso</span>
      </div>
      <div className="card-surface" style={{ padding: '32px' }}>
        <h1 className="title-screen" style={{ marginBottom: '8px' }}>
          Nuevo aviso
        </h1>
        <p className="text-aux">
          Plantilla base lista para el Integrante 2 (`src/pages/usuario/publicaciones/NuevoAvisoPage.jsx`).
        </p>
      </div>
    </div>
  );
}
