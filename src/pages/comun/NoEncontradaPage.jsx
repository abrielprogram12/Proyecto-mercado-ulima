import { Link, useNavigate } from 'react-router-dom';
import './comun.css';

/**
 * MÓDULO: Páginas comunes (Integrante 1 · HU-1)
 * Vista 1.7 — Página no encontrada (404)
 */
export default function NoEncontradaPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container com-centrado">
      <div className="com-codigo-404">404</div>

      <h1 className="title-screen com-titulo-404">
        Este aviso ya no está en el tablón
      </h1>

      <p className="text-aux com-descripcion-404">
        Puede que el vendedor lo haya retirado o que el enlace esté mal escrito.
        Busca algo parecido en el catálogo.
      </p>

      <div className="com-acciones">
        <Link to="/catalogo" className="btn btn-primary">
          Ir al catálogo
        </Link>
        <button
          type="button"
          className="btn btn-tertiary"
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
}
