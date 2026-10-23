import { useMemo } from 'react';
import { useAviso } from '../../context/AvisoContext';
import {
  CATEGORIAS,
  CURSOS_ASOCIADOS,
  CONDICIONES_PRODUCTO
} from '../../data/contratoDatos';
import './FiltrosCatalogo.css';

export default function FiltrosCatalogo({
  filtros,
  onChangeFiltros,
  onLimpiarTodo,
  onLimpiar
}) {
  const { avisos } = useAviso();

  const {
    categoria = '',
    curso = '',
    precioMin = '',
    precioMax = '',
    condicion = ''
  } = filtros || {};

  const avisosVisibles = useMemo(() => {
    return (avisos || []).filter(
      (a) => !a.estado || a.estado === 'Publicado' || a.estado === 'Vendido'
    );
  }, [avisos]);

  const conteoPorCategoria = useMemo(() => {
    const mapa = {};
    CATEGORIAS.forEach((c) => {
      mapa[c] = 0;
    });
    avisosVisibles.forEach((a) => {
      if (a.categoria) {
        mapa[a.categoria] = (mapa[a.categoria] || 0) + 1;
      }
    });
    return mapa;
  }, [avisosVisibles]);

  const conteoPorCondicion = useMemo(() => {
    const mapa = {};
    CONDICIONES_PRODUCTO.forEach((c) => {
      mapa[c] = 0;
    });
    avisosVisibles.forEach((a) => {
      if (a.condicion) {
        mapa[a.condicion] = (mapa[a.condicion] || 0) + 1;
      }
    });
    return mapa;
  }, [avisosVisibles]);

  const cursosDisponibles = useMemo(() => {
    const conjunto = new Set(CURSOS_ASOCIADOS);
    avisosVisibles.forEach((a) => {
      if (a.curso && a.curso.trim()) {
        conjunto.add(a.curso.trim());
      }
    });
    return Array.from(conjunto);
  }, [avisosVisibles]);

  const actualizar = (campo, valor) => {
    if (!onChangeFiltros) return;
    onChangeFiltros({
      ...filtros,
      [campo]: valor
    });
  };

  const handleLimpiar = () => {
    if (onLimpiarTodo) onLimpiarTodo();
    else if (onLimpiar) onLimpiar();
  };

  const categoriaNormalizada =
    categoria === 'Todas' ? '' : categoria;
  const cursoNormalizado =
    curso === 'Todos los cursos' ? '' : curso;

  return (
    <aside className="filtros-catalogo card-surface">
      <div className="filtros-header">
        <h3 className="filtros-titulo">Filtros</h3>
        <button
          type="button"
          className="filtros-limpiar-btn"
          onClick={handleLimpiar}
        >
          Limpiar
        </button>
      </div>

      <div className="filtro-bloque">
        <span className="label-upper">Categoría</span>
        <div className="filtro-lista-checks">
          {CATEGORIAS.map((cat) => {
            const activo = categoriaNormalizada === cat;
            return (
              <label key={cat} className="filtro-check-item">
                <span className="filtro-check-left">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => actualizar('categoria', activo ? '' : cat)}
                  />
                  <span>{cat}</span>
                </span>
                <span className="filtro-check-count">
                  {conteoPorCategoria[cat] ?? 0}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="filtro-bloque">
        <label className="label-upper" htmlFor="filtro-curso-select">
          Curso asociado
        </label>
        <select
          id="filtro-curso-select"
          className="form-select"
          value={cursoNormalizado}
          onChange={(e) => actualizar('curso', e.target.value)}
        >
          <option value="">Todos los cursos</option>
          {cursosDisponibles.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-bloque">
        <span className="label-upper">Rango de precio</span>
        <div className="filtro-rango-inputs">
          <input
            type="number"
            min="0"
            className="form-input"
            placeholder="S/ mín"
            value={precioMin}
            onChange={(e) => actualizar('precioMin', e.target.value)}
          />
          <input
            type="number"
            min="0"
            className="form-input"
            placeholder="S/ máx"
            value={precioMax}
            onChange={(e) => actualizar('precioMax', e.target.value)}
          />
        </div>
      </div>

      <div className="filtro-bloque">
        <span className="label-upper">Estado del producto</span>
        <div className="filtro-lista-checks">
          {CONDICIONES_PRODUCTO.map((cond) => {
            const activo = condicion === cond;
            return (
              <label key={cond} className="filtro-check-item">
                <span className="filtro-check-left">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => actualizar('condicion', activo ? '' : cond)}
                  />
                  <span>{cond}</span>
                </span>
                <span className="filtro-check-count">
                  {conteoPorCondicion[cond] ?? 0}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
