import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import './catalogo.css';

export default function FavoritosPage() {
  const { usuarioActual } = useAuth();
  const { avisos, favoritosPorUsuario, toggleFavorito } = useAviso();

  const [orden, setOrden] = useState('recientes');
  const usuarioId = usuarioActual?.id || 'u-2';

  const avisosFavoritos = useMemo(() => {
    const ids = favoritosPorUsuario[usuarioId] || [];
    const lista = ids
      .map((id) => avisos.find((a) => a.id === id))
      .filter(Boolean);

    if (orden === 'precio_asc') {
      return [...lista].sort((a, b) => Number(a.precio) - Number(b.precio));
    }
    if (orden === 'precio_desc') {
      return [...lista].sort((a, b) => Number(b.precio) - Number(a.precio));
    }
    return lista;
  }, [avisos, favoritosPorUsuario, usuarioId, orden]);

  const vendidosCount = avisosFavoritos.filter(
    (a) => a.estado === 'Vendido'
  ).length;

  return (
    <div className="page-container">
      <div className="cat-favoritos-encabezado">
        <div>
          <h1 className="title-screen">Favoritos</h1>
          <p className="text-aux">
            {avisosFavoritos.length} avisos guardados
            {vendidosCount > 0 ? ` · ${vendidosCount} ya se vendió` : ''}
          </p>
        </div>

        <div className="cat-orden-grupo">
          <span className="text-aux">Ordenar por</span>
          <select
            className="form-select cat-select-orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="recientes">Guardados recientemente</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {avisosFavoritos.length === 0 ? (
        <EstadoVacio
          icono="♥"
          titulo="Aún no tienes favoritos"
          descripcion="Toca el corazón en cualquier aviso para guardarlo y volver a él cuando quieras ofertar."
          textoBoton="Explorar catálogo"
          rutaBoton="/catalogo"
        />
      ) : (
        <div className="cat-favoritos-grid">
          {avisosFavoritos.map((aviso) => {
            const vendido = aviso.estado === 'Vendido';
            return (
              <TarjetaAviso
                key={aviso.id}
                aviso={aviso}
                accionInferior={
                  vendido ? (
                    <div>
                      <span className="cat-fav-vendido-tag">
                        Ya se vendió · {aviso.fechaVenta || '21/08/2026'}
                      </span>
                      <Link
                        to={`/catalogo?curso=${encodeURIComponent(
                          aviso.curso || ''
                        )}`}
                        className="cat-fav-link-similares"
                      >
                        Ver avisos similares
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorito(usuarioId, aviso.id);
                      }}
                      className="cat-btn-quitar-fav"
                    >
                      Quitar de favoritos
                    </button>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
