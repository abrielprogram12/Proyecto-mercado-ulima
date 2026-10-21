import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px'
        }}
      >
        <div>
          <h1 className="title-screen" style={{ marginBottom: '4px' }}>
            Favoritos
          </h1>
          <p className="text-aux">
            {avisosFavoritos.length} avisos guardados
            {vendidosCount > 0 ? ` · ${vendidosCount} ya se vendió` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="text-aux">Ordenar por</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '7px 14px' }}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '18px'
          }}
        >
          {avisosFavoritos.map((aviso) => {
            const vendido = aviso.estado === 'Vendido';
            return (
              <TarjetaAviso
                key={aviso.id}
                aviso={aviso}
                accionInferior={
                  vendido ? (
                    <div>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-success)',
                          marginBottom: '4px'
                        }}
                      >
                        Ya se vendió · {aviso.fechaVenta || '21/08/2026'}
                      </span>
                      <Link
                        to={`/catalogo?curso=${encodeURIComponent(
                          aviso.curso || ''
                        )}`}
                        style={{ fontSize: '13px', fontWeight: 600 }}
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
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
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
