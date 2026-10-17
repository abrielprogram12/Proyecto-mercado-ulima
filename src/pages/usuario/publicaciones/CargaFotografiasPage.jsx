import { Link } from 'react-router-dom';

/**
 * MÓDULO: Publicaciones (Asignado al Integrante 2)
 * Vista 2.5 — Carga de fotografías
 */
export default function CargaFotografiasPage() {
  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/mis-publicaciones">Mis publicaciones</Link>
        <span>›</span>
        <span>Fotografías</span>
      </div>
      <div className="card-surface" style={{ padding: '32px' }}>
        <h1 className="title-screen" style={{ marginBottom: '8px' }}>
          Fotografías del aviso
        </h1>
        <p className="text-aux">
          Plantilla base lista para el Integrante 2 (`src/pages/usuario/publicaciones/CargaFotografiasPage.jsx`).
        </p>
      </div>
    </div>
  );
}
