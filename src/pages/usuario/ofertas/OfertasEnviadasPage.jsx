import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Ofertas (Asignado al Integrante 4)
 * Vista 4.2 / 4.3 — Ofertas enviadas
 */
export default function OfertasEnviadasPage() {
  return (
    <div className="page-container">
      <h1 className="title-screen" style={{ marginBottom: '8px' }}>
        Ofertas enviadas
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Plantilla base lista para el Integrante 4 (`src/pages/usuario/ofertas/OfertasEnviadasPage.jsx`).
      </p>
      <EstadoVacio
        titulo="No has enviado ofertas"
        descripcion="Cuando encuentres algo que te sirva, envía tu monto y el vendedor podrá aceptarlo, rechazarlo o proponerte otro precio."
        textoBoton="Explorar catálogo"
        rutaBoton="/catalogo"
      />
    </div>
  );
}
