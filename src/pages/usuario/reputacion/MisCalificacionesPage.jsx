import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Reputación (Asignado al Integrante 6)
 * Vista 6.3 — Mis calificaciones
 */
export default function MisCalificacionesPage() {
  return (
    <div className="page-container">
      <h1 className="title-screen" style={{ marginBottom: '8px' }}>
        Mis calificaciones
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Plantilla base lista para el Integrante 6 (`src/pages/usuario/reputacion/MisCalificacionesPage.jsx`).
      </p>
      <EstadoVacio
        icono="★"
        titulo="Todavía no has calificado a nadie"
        descripcion="Cuando confirmes una entrega podrás calificar a la otra parte."
        textoBoton="Ver mis acuerdos"
        rutaBoton="/acuerdos"
      />
    </div>
  );
}
