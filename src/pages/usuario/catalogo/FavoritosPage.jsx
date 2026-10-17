import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Catálogo y búsqueda (Asignado al Integrante 3)
 * Vista 3.7 — Favoritos
 */
export default function FavoritosPage() {
  return (
    <div className="page-container">
      <h1 className="title-screen" style={{ marginBottom: '8px' }}>
        Favoritos
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Plantilla base lista para el Integrante 3 (`src/pages/usuario/catalogo/FavoritosPage.jsx`).
      </p>
      <EstadoVacio
        icono="♥"
        titulo="Aún no tienes favoritos"
        descripcion="Toca el corazón en cualquier aviso para guardarlo y volver a él cuando quieras ofertar."
        textoBoton="Explorar catálogo"
        rutaBoton="/catalogo"
      />
    </div>
  );
}
