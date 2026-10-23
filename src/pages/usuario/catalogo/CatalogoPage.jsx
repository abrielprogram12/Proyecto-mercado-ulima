import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import FiltrosCatalogo from '../../../components/FiltrosCatalogo/FiltrosCatalogo';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import {
  FILTROS_INICIALES_CATALOGO,
  filtrarYOrdenarAvisos
} from './catalogoUtils';
import './catalogo.css';

/**
 * MÓDULO: Catálogo y Búsqueda (Integrante 3 · HU-3)
 * Vistas 3.1 (Catálogo con resultados), 3.2 (Sin resultados) y 3.3 (Cargando con esqueletos)
 */
export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { avisos } = useAviso();

  const qParam = searchParams.get('q') || '';
  const catParam = searchParams.get('categoria') || '';
  const cursoParam = searchParams.get('curso') || '';

  const [filtros, setFiltros] = useState({
    ...FILTROS_INICIALES_CATALOGO,
    categoria: catParam || '',
    curso: cursoParam || ''
  });

  const [ordenarPor, setOrdenarPor] = useState('recientes');
  const [mostrarEsqueletos, setMostrarEsqueletos] = useState(false);

  // Sincronizar parámetros de URL si cambian desde Header o Landing
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      categoria: catParam || prev.categoria,
      curso: cursoParam || (catParam ? '' : prev.curso)
    }));
  }, [catParam, cursoParam]);

  // Transición suave con esqueletos (Vista 3.3) al cambiar búsqueda o filtros
  useEffect(() => {
    setMostrarEsqueletos(true);
    const timer = setTimeout(() => {
      setMostrarEsqueletos(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [
    qParam,
    filtros.categoria,
    filtros.curso,
    filtros.condicion,
    ordenarPor
  ]);

  const handleLimpiarTodo = () => {
    setFiltros({
      ...FILTROS_INICIALES_CATALOGO
    });
    setSearchParams({});
  };

  const quitarFiltro = (campo) => {
    setFiltros((prev) => ({ ...prev, [campo]: '' }));
    if (campo === 'categoria' && catParam) {
      const next = new URLSearchParams(searchParams);
      next.delete('categoria');
      setSearchParams(next);
    }
    if (campo === 'curso' && cursoParam) {
      const next = new URLSearchParams(searchParams);
      next.delete('curso');
      setSearchParams(next);
    }
  };

  const avisosFiltrados = useMemo(() => {
    return filtrarYOrdenarAvisos(avisos, filtros, qParam, ordenarPor);
  }, [avisos, filtros, qParam, ordenarPor]);

  const sugerenciasAlternativas = useMemo(() => {
    return avisos.filter((a) => a.estado === 'Publicado').slice(0, 4);
  }, [avisos]);

  const sinResultados = !mostrarEsqueletos && avisosFiltrados.length === 0;
  const hayAlgunFiltroActivo = Boolean(
    (filtros.categoria && filtros.categoria !== 'Todas') ||
      (filtros.curso && filtros.curso !== 'Todos los cursos') ||
      filtros.condicion ||
      filtros.precioMin !== '' ||
      filtros.precioMax !== '' ||
      qParam
  );

  return (
    <div className="page-container">
      <div className="cat-layout">
        {/* Panel lateral izquierdo de filtros */}
        <FiltrosCatalogo
          filtros={filtros}
          onChangeFiltros={setFiltros}
          onLimpiarTodo={handleLimpiarTodo}
          onLimpiar={handleLimpiarTodo}
        />

        {/* Contenido principal */}
        <div className="cat-contenido">
          {/* Chips de filtros activos */}
          <div className="cat-barra-chips">
            <div className="cat-chips-activos">
              <span className="text-aux">Filtros activos:</span>

              {!hayAlgunFiltroActivo && (
                <span className="text-aux">Todos los avisos del catálogo</span>
              )}

              {filtros.categoria && filtros.categoria !== 'Todas' && (
                <span className="chip chip-terracota">
                  {filtros.categoria}
                  <button
                    type="button"
                    onClick={() => quitarFiltro('categoria')}
                    className="cat-btn-quitar-chip"
                  >
                    ✕
                  </button>
                </span>
              )}

              {filtros.curso && filtros.curso !== 'Todos los cursos' && (
                <span className="chip chip-terracota">
                  {filtros.curso}
                  <button
                    type="button"
                    onClick={() => quitarFiltro('curso')}
                    className="cat-btn-quitar-chip"
                  >
                    ✕
                  </button>
                </span>
              )}

              {filtros.condicion && (
                <span className="chip chip-terracota">
                  {filtros.condicion}
                  <button
                    type="button"
                    onClick={() => quitarFiltro('condicion')}
                    className="cat-btn-quitar-chip"
                  >
                    ✕
                  </button>
                </span>
              )}

              {(filtros.precioMin !== '' || filtros.precioMax !== '') && (
                <span className="chip chip-terracota">
                  S/ {filtros.precioMin || 0} – S/ {filtros.precioMax || '∞'}
                  <button
                    type="button"
                    onClick={() =>
                      setFiltros((prev) => ({
                        ...prev,
                        precioMin: '',
                        precioMax: ''
                      }))
                    }
                    className="cat-btn-quitar-chip"
                  >
                    ✕
                  </button>
                </span>
              )}

              {qParam && (
                <span className="chip chip-terracota">
                  «{qParam}»
                  <button
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('q');
                      setSearchParams(next);
                    }}
                    className="cat-btn-quitar-chip"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Barra de conteo y ordenamiento */}
          <div className="cat-barra-orden">
            <div>
              {mostrarEsqueletos ? (
                <span className="text-aux">
                  Buscando avisos que coincidan con tus filtros…
                </span>
              ) : sinResultados ? (
                <span>
                  <strong>0 avisos</strong> para «
                  {qParam || filtros.curso || 'tu búsqueda'}»
                </span>
              ) : (
                <span>
                  <strong className="cat-conteo-num">
                    {avisosFiltrados.length} avisos
                  </strong>{' '}
                  {filtros.curso && filtros.curso !== 'Todos los cursos' && (
                    <span className="cat-conteo-texto">
                      para «{filtros.curso}»
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className="cat-orden-grupo">
              <span className="text-aux">Ordenar por</span>
              <select
                className="form-select cat-select-orden"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Menor precio</option>
                <option value="precio_desc">Mayor precio</option>
              </select>
            </div>
          </div>

          {/* VISTA 3.3 — CARGANDO RESULTADOS (ESQUELETOS) */}
          {mostrarEsqueletos && (
            <div>
              <div className="cat-esqueletos-grid">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="card-surface cat-esqueleto-card"
                  >
                    <div className="cat-esqueleto-foto" />
                    <div className="cat-esqueleto-cuerpo">
                      <div className="cat-esqueleto-linea-1" />
                      <div className="cat-esqueleto-linea-2" />
                      <div className="cat-esqueleto-linea-3" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-aux cat-texto-centrado">
                Cargando resultados…
              </p>
            </div>
          )}

          {/* VISTA 3.2 — SIN RESULTADOS + SUGERENCIAS */}
          {!mostrarEsqueletos && sinResultados && (
            <div>
              <div className="card-surface cat-vacio-card">
                <div className="cat-vacio-icono" />
                <h2 className="title-section cat-vacio-titulo">
                  No encontramos avisos para «{qParam || filtros.curso || 'esta combinación'}»
                </h2>
                <p className="text-aux cat-vacio-desc">
                  Prueba quitando algún filtro, ampliando el rango de precio o
                  buscando por el nombre del curso en lugar del autor.
                </p>

                <div className="cat-vacio-acciones">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleLimpiarTodo}
                  >
                    Quitar todos los filtros
                  </button>
                  <Link to="/nuevo-aviso" className="btn btn-secondary">
                    Publicar lo que tengo de este curso
                  </Link>
                </div>
              </div>

              <div>
                <span className="label-upper cat-label-sugerencias">
                  Quizás te sirva · Avisos destacados en el campus
                </span>
                <div className="cat-sugerencias-grid">
                  {sugerenciasAlternativas.map((av) => (
                    <TarjetaAviso key={av.id} aviso={av} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3.1 — GRILLA DE RESULTADOS CON PAGINACIÓN */}
          {!mostrarEsqueletos && !sinResultados && (
            <>
              <div className="cat-resultados-grid">
                {avisosFiltrados.map((av) => (
                  <TarjetaAviso key={av.id} aviso={av} />
                ))}
              </div>

              <div className="cat-paginacion">
                <span>
                  Mostrando 1–{avisosFiltrados.length} de{' '}
                  {avisosFiltrados.length} avisos
                </span>
                <div className="cat-paginacion-botones">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled
                  >
                    ‹
                  </button>
                  <button type="button" className="btn btn-primary btn-sm">
                    1
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
