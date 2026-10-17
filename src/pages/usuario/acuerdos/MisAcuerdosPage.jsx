import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Acuerdos de entrega (Asignado al Integrante 5)
 * Vista 5.3 — Mis acuerdos
 */
export default function MisAcuerdosPage() {
  return (
    <div className="page-container">
      <h1 className="title-screen" style={{ marginBottom: '8px' }}>
        Mis acuerdos
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Plantilla base lista para el Integrante 5 (`src/pages/usuario/acuerdos/MisAcuerdosPage.jsx`).
      </p>
      <EstadoVacio
        titulo="Aún no tienes acuerdos de entrega"
        descripcion="Cuando aceptes o te acepten una oferta, se generará un acuerdo para coordinar el encuentro en el campus."
        textoBoton="Explorar catálogo"
        rutaBoton="/catalogo"
      />
    </div>
  );
}
