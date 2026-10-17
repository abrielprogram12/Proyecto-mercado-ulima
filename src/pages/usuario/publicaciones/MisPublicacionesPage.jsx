import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Publicaciones (Asignado al Integrante 2)
 * Vista 2.1 / 2.2 — Mis publicaciones
 */
export default function MisPublicacionesPage() {
  return (
    <div className="page-container">
      <h1 className="title-screen" style={{ marginBottom: '8px' }}>
        Mis publicaciones
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Módulo base listo para implementar por el Integrante 2 (`src/pages/usuario/publicaciones/MisPublicacionesPage.jsx`).
      </p>
      <EstadoVacio
        icono="📚"
        titulo="Todavía no publicas nada"
        descripcion="Ese libro del ciclo pasado le puede servir a alguien esta semana. Publicar un aviso toma menos de tres minutos."
        textoBoton="Crear mi primer aviso"
        rutaBoton="/nuevo-aviso"
      />
    </div>
  );
}
