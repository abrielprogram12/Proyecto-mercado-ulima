import {
  CATEGORIAS,
  CURSOS_ASOCIADOS,
  CONDICIONES_PRODUCTO
} from '../../data/contratoDatos';
import './FiltrosCatalogo.css';

const CONTEO_CATEGORIAS_MOCK = {
  'Libros de texto': 48,
  Calculadoras: 22,
  'Instrumentos de dibujo': 17,
  'Apuntes y guías': 31,
  'Laptops y accesorios': 9,
  'Uniformes y mandiles': 14,
  'Material de laboratorio': 6
};

export default function FiltrosCatalogo({
  filtros,
  onChangeFiltros,
  onLimpiarTodo
}) {
  const {
    categoria = '',
    curso = '',
    precioMin = '',
    precioMax = '',
    condicion = ''
  } = filtros || {};

  const actualizar = (campo, valor) => {
    if (!onChangeFiltros) return;
    onChangeFiltros({
      ...filtros,
      [campo]: valor
    });
  };

  return (
    <aside className="filtros-catalogo card-surface">
      <div className="filtros-header">
        <h3 className="filtros-titulo">Filtros</h3>
        <button
          type="button"
          className="filtros-limpiar-btn"
          onClick={onLimpiarTodo}
        >
          Limpiar
        </button>
      </div>

      {/* Categoría */}
      <div className="filtro-bloque">
        <span className="label-upper">Categoría</span>
        <div className="filtro-lista-checks">
          {CATEGORIAS.map((cat) => {
            const activo = categoria === cat;
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
                  {CONTEO_CATEGORIAS_MOCK[cat] || 5}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Curso asociado */}
      <div className="filtro-bloque">
        <label className="label-upper" htmlFor="filtro-curso-select">
          Curso asociado
        </label>
        <select
          id="filtro-curso-select"
          className="form-select"
          value={curso}
          onChange={(e) => actualizar('curso', e.target.value)}
        >
          <option value="">Todos los cursos</option>
          {CURSOS_ASOCIADOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de precio */}
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

      {/* Estado del producto */}
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
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
