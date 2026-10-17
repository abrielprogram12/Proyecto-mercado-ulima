import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAviso } from '../../context/AvisoContext';
import { formatearPrecio, ROLES_USUARIO } from '../../data/contratoDatos';
import BadgeEstado from '../BadgeEstado/BadgeEstado';
import './TarjetaAviso.css';

export default function TarjetaAviso({
  aviso,
  mostrarCorazon = true,
  modoVistaPrevia = false,
  accionInferior
}) {
  const { usuarioActual, rolActual } = useAuth();
  const { toggleFavorito, esFavorito } = useAviso();
  const navigate = useNavigate();

  if (!aviso) return null;

  const rutaDetalle =
    rolActual === ROLES_USUARIO.VISITANTE
      ? `/aviso-publico/${aviso.id}`
      : `/aviso/${aviso.id}`;

  const activoFavorito = usuarioActual ? esFavorito(usuarioActual.id, aviso.id) : false;
  const estaVendido = aviso.estado === 'Vendido';
  const fotoPortada =
    Array.isArray(aviso.fotos) && aviso.fotos.length > 0
      ? aviso.fotos.find((f) => f.principal) || aviso.fotos[0]
      : null;

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!usuarioActual) {
      navigate('/login');
      return;
    }
    toggleFavorito(usuarioActual.id, aviso.id);
  };

  const Contenido = (
    <>
      <div className="tarjeta-aviso-media striped-placeholder">
        <span>{fotoPortada?.etiqueta || 'fotografía 4:3'}</span>

        {estaVendido && (
          <div className="tarjeta-vendido-overlay">
            <BadgeEstado estado="Vendido" />
          </div>
        )}

        {mostrarCorazon && !modoVistaPrevia && (
          <button
            type="button"
            className={`tarjeta-fav-btn ${activoFavorito ? 'activo' : ''}`}
            onClick={handleToggleFav}
            aria-label={activoFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            ♥
          </button>
        )}
      </div>

      <div className="tarjeta-aviso-body">
        <h4 className="tarjeta-aviso-titulo">
          {aviso.titulo || 'Título del aviso'}
        </h4>
        <div className="tarjeta-aviso-precio price-text">
          {formatearPrecio(aviso.precio || 0)}
        </div>
        <div className="tarjeta-aviso-chips">
          {aviso.condicion && <BadgeEstado estado={aviso.condicion} />}
          {aviso.curso && <span className="chip">{aviso.curso}</span>}
        </div>
        {accionInferior && <div className="tarjeta-aviso-extra">{accionInferior}</div>}
      </div>
    </>
  );

  if (modoVistaPrevia) {
    return <div className="tarjeta-aviso card-surface">{Contenido}</div>;
  }

  return (
    <Link to={rutaDetalle} className="tarjeta-aviso card-surface">
      {Contenido}
    </Link>
  );
}
