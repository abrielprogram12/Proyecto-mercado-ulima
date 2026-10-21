import { Link } from 'react-router-dom';
import './comun.css';

/**
 * MÓDULO: Páginas comunes (Integrante 1 · HU-1)
 * Vista 1.6 — Acceso denegado
 */
export default function AccesoDenegadoPage() {
  return (
    <div className="page-container com-centrado">
      <div className="com-circulo-alerta" aria-hidden="true">
        <div className="com-candado" />
      </div>

      <h1 className="title-screen com-titulo-denegado">Acceso denegado</h1>

      <p className="text-aux com-descripcion-ancha">
        Tu cuenta de usuario no tiene permisos sobre la bandeja de reportes, que es
        exclusiva del administrador del tablón. Si crees que se trata de un error,
        escribe a tablon@ulima.edu.pe.
      </p>

      <div className="com-acciones">
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
        <a href="mailto:tablon@ulima.edu.pe" className="btn btn-secondary">
          Escribir a la mesa de ayuda
        </a>
      </div>
    </div>
  );
}
