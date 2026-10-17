import { Link } from 'react-router-dom';
import './EstadoVacio.css';

export default function EstadoVacio({
  icono = '📦',
  titulo = 'No hay datos para mostrar',
  descripcion = 'Explora el catálogo del tablón o realiza una nueva acción.',
  textoBoton = 'Explorar catálogo',
  rutaBoton = '/catalogo',
  onAccion,
  textoEnlaceSecundario,
  rutaEnlaceSecundario
}) {
  return (
    <div className="estado-vacio card-surface">
      <div className="estado-vacio-icono" aria-hidden="true">
        <span>{icono}</span>
      </div>
      <h3 className="estado-vacio-titulo">{titulo}</h3>
      <p className="estado-vacio-descripcion">{descripcion}</p>
      {onAccion ? (
        <button type="button" className="btn btn-primary" onClick={onAccion}>
          {textoBoton}
        </button>
      ) : (
        <Link to={rutaBoton} className="btn btn-primary">
          {textoBoton}
        </Link>
      )}
      {textoEnlaceSecundario && (
        <div className="estado-vacio-secundario">
          <Link to={rutaEnlaceSecundario || '/'}>{textoEnlaceSecundario}</Link>
        </div>
      )}
    </div>
  );
}
