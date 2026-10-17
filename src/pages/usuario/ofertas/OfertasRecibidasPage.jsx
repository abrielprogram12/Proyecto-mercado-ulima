import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Ofertas (Asignado al Integrante 4)
 * Vista 4.1 — Ofertas recibidas
 */
export default function OfertasRecibidasPage() {
  return (
    <div className="page-container">
      <h1 className="title-screen" style={{ marginBottom: '8px' }}>
        Ofertas recibidas
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Plantilla base lista para el Integrante 4 (`src/pages/usuario/ofertas/OfertasRecibidasPage.jsx`).
      </p>
      <EstadoVacio
        titulo="Todavía no recibes ofertas"
        descripcion="Cuando algún estudiante envíe una oferta sobre tus avisos publicados, aparecerá aquí."
        textoBoton="Ver mis publicaciones"
        rutaBoton="/mis-publicaciones"
      />
    </div>
  );
}
