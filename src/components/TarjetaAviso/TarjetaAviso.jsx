import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAviso } from '../../context/AvisoContext';
import { ROLES_USUARIO, formatearPrecio } from '../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../data/imagenesDatos';
import BadgeEstado from '../BadgeEstado/BadgeEstado';
import './TarjetaAviso.css';

export default function TarjetaAviso({
  aviso,
  mostrarCorazon = true,
  piePersonalizado = null
}) {
  const { usuarioActual, rolActual } = useAuth();
  const { toggleFavorito, esFavorito } = useAviso();
  const navigate = useNavigate();

  if (!aviso) return null;

  const rutaDetalle =
    rolActual === ROLES_USUARIO.VISITANTE
      ? `/aviso-publico/${aviso.id}`
      : `/aviso/${aviso.id}`;

  const marcadoFavorito = usuarioActual
    ? esFavorito(usuarioActual.id, aviso.id)
    : false;

  const handleClickCorazon = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!usuarioActual) {
      navigate('/login');
      return;
    }
    toggleFavorito(usuarioActual.id, aviso.id);
  };

  const vendido = aviso.estado === 'Vendido';
  const portadaUrl = obtenerPortadaAviso(aviso);

  return (
    <div className={`tarjeta-aviso card-surface ${vendido ? 'es-vendido' : ''}`}>
      <Link to={rutaDetalle} className="tarjeta-aviso-media">
        <div className="tarjeta-aviso-imagen striped-placeholder">
          {portadaUrl ? (
            <img
              src={portadaUrl}
              alt={aviso.titulo}
              className="media-img-cover"
            />
          ) : (
            <span>Sin fotografía</span>
          )}
        </div>

        {vendido && (
          <div className="tarjeta-vendido-overlay">
            <span className="tarjeta-vendido-ribbon">VENDIDO</span>
          </div>
        )}

        {mostrarCorazon && (
          <button
            type="button"
            className={`tarjeta-fav-btn ${marcadoFavorito ? 'activo' : ''}`}
            onClick={handleClickCorazon}
            title={marcadoFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            {marcadoFavorito ? '♥' : '♡'}
          </button>
        )}
      </Link>

      <div className="tarjeta-aviso-body">
        <Link to={rutaDetalle} className="tarjeta-aviso-titulo">
          {aviso.titulo}
        </Link>

        <div className="tarjeta-aviso-precio price-text">
          {formatearPrecio(aviso.precio)}
        </div>

        <div className="tarjeta-aviso-chips">
          <BadgeEstado estado={aviso.condicion} />
          {aviso.curso && <span className="chip">{aviso.curso}</span>}
        </div>

        {piePersonalizado ? (
          <div className="tarjeta-aviso-footer">{piePersonalizado}</div>
        ) : (
          <div className="tarjeta-aviso-footer text-aux">
            <span>{aviso.vendedorNombre?.split(' ').slice(0, 2).join(' ')}</span>
            <span>· 4.8 ★</span>
          </div>
        )}
      </div>
    </div>
  );
}
