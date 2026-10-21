import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import FiltrosCatalogo from '../../../components/FiltrosCatalogo/FiltrosCatalogo';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import Notificacion from '../../../components/Notificacion/Notificacion';
import {
  ITEMS_POR_PAGINA_CATALOGO,
  FILTROS_INICIALES_CATALOGO,
  filtrarYOrdenarCatalogo,
  construirChipsActivos
} from './catalogoUtils';
import './catalogo.css';

/**
 * MÓDULO: Catálogo y Búsqueda (Integrante 3 · HU-3)
 * Vistas 3.1, 3.2 y 3.3 — Catálogo con filtros laterales, sin resultados y esqueletos de carga
 */
export default function CatalogoPage() {
  const { avisos } = useAviso();
  const [searchParams, setSearchParams] = useSearchParams();

  const [busquedaTexto, setBusquedaTexto] = useState(
    searchParams.get('q') || ''
  );
  const [filtros, setFiltros] = useState({
    ...FILTROS_INICIALES_CATALOGO,
    categoria: searchParams.get('categoria') || '',
    curso: searchParams.get('curso') || ''
  });

  const [orden, setOrden] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoEsqueletos, setCargandoEsqueletos] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('categoria') || '';
    setBusquedaTexto(q);
    if (cat) {
      setFiltros((prev) => ({ ...prev, categoria: cat }));
    }
  }, [searchParams]);

  const avisosPublicados = useMemo(() => {
    return avisos.filter((a) => a.estado === 'Publicado');
  }, [avisos]);

  const avisosFiltradosYOrdenados = useMemo(
    () =>
      filtrarYOrdenarCatalogo(avisosPublicados, filtros, busquedaTexto, orden),
    [avisosPublicados, filtros, busquedaTexto, orden]
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(avisosFiltradosYOrdenados.length / ITEMS_POR_PAGINA_CATALOGO)
  );
  const avisosPaginados = avisosFiltradosYOrdenados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA_CATALOGO,
    paginaActual * ITEMS_POR_PAGINA_CATALOGO
  );

  const chipsActivos = useMemo(
    () => construirChipsActivos(filtros, busquedaTexto),
    [filtros, busquedaTexto]
  );

  const quitarChip = (clave) => {
    if (clave === 'rangoPrecio') {
      setFiltros((prev) => ({ ...prev, precioMin: '', precioMax: '' }));
    } else if (clave === 'busqueda') {
      setBusquedaTexto('');
      setSearchParams({});
    } else {
      setFiltros((prev) => ({ ...prev, [clave]: '' }));
    }
    setPaginaActual(1);
  };

  const limpiarTodo = () => {
    setFiltros(FILTROS_INICIALES_CATALOGO);
    setBusquedaTexto('');
    setSearchParams({});
    setPaginaActual(1);
  };

  const simularCargaEsqueletos = () => {
    setCargandoEsqueletos(true);
    setTimeout(() => setCargandoEsqueletos(false), 1600);
  };

  const sugerenciasQuizaTeInterese = avisosPublicados.slice(0, 4);

  return (
    <div className="page-container">
      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="cat-layout">
        {/* Sidebar de Filtros (Vista 3.1) */}
        <FiltrosCatalogo
          filtros={filtros}
          onChangeFiltros={(nuevos) => {
            setFiltros(nuevos);
            setPaginaActual(1);
          }}
          onLimpiarTodo={limpiarTodo}
        />

        {/* Contenido principal */}
        <div className="cat-contenido">
          {/* Barra superior de chips de filtros activos (Vista 3.1 y 3.2) */}
          <div className="cat-barra-chips">
            <div className="cat-chips-activos">
              {chipsActivos.length > 0 && (
                <>
                  <span className="text-aux">Filtros activos:</span>
                  {chipsActivos.map((chip) => (
                    <span key={chip.clave} className="chip chip-terracota">
                      {chip.etiqueta}
                      <button
                        type="button"
                        onClick={() => quitarChip(chip.clave)}
                        className="cat-btn-quitar-chip"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    className="btn btn-tertiary btn-sm"
                    onClick={limpiarTodo}
                  >
                    Limpiar todo
                  </button>
                </>
              )}
            </div>

            <div className="cat-demos-fila">
              <button
                type="button"
                className="chip chip-selectable"
                onClick={simularCargaEsqueletos}
              >
                Ver esqueletos (3.3)
              </button>
              <button
                type="button"
                className="chip chip-selectable"
                onClick={() => {
                  setBusquedaTexto('microscopio binocular');
                  setFiltros({
                    categoria: 'Material de laboratorio',
                    curso: 'Química General',
                    precioMin: '15',
                    precioMax: '60',
                    condicion: ''
                  });
                }}
              >
                Simular sin resultados (3.2)
              </button>
            </div>
          </div>

          {/* Encabezado de conteo y ordenamiento */}
          <div className="cat-barra-orden">
            <div>
              <strong className="cat-conteo-num">
                {avisosFiltradosYOrdenados.length}
              </strong>{' '}
              <span className="text-aux cat-conteo-texto">
                avisos encontrados
                {busquedaTexto.trim()
                  ? ` para «${busquedaTexto.trim()}»`
                  : ''}
              </span>
            </div>

            <div className="cat-orden-grupo">
              <span className="text-aux">Ordenar por</span>
              <select
                className="form-select cat-select-orden"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Vista 3.3 — Esqueletos de carga */}
          {cargandoEsqueletos ? (
            <div>
              <div className="cat-esqueletos-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="card-surface cat-esqueleto-card">
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
                Buscando avisos… los esqueletos mantienen la altura de la
                tarjeta real para evitar saltos de maquetación.
              </p>
            </div>
          ) : avisosPaginados.length === 0 ? (
            /* Vista 3.2 — Catálogo sin resultados + Quizá te interese */
            <div>
              <div className="card-surface cat-vacio-card">
                <div className="cat-vacio-icono" />
                <h2 className="title-section cat-vacio-titulo">
                  Ningún aviso coincide con tu búsqueda
                </h2>
                <p className="text-aux cat-vacio-desc">
                  Prueba con menos filtros o amplía el rango de precio. También
                  puedes crear una alerta y te avisamos cuando alguien publique
                  algo parecido.
                </p>
                <div className="cat-vacio-acciones">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={limpiarTodo}
                  >
                    Limpiar filtros
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setNotificacion({
                        tipo: 'exito',
                        mensaje:
                          'Éxito. Creamos una alerta de búsqueda para avisarte cuando se publique un material similar.'
                      })
                    }
                  >
                    Crear alerta de búsqueda
                  </button>
                </div>
              </div>

              <span className="label-upper cat-label-sugerencias">
                Quizá te interese
              </span>
              <div className="cat-sugerencias-grid">
                {sugerenciasQuizaTeInterese.map((av) => (
                  <TarjetaAviso key={av.id} aviso={av} />
                ))}
              </div>
            </div>
          ) : (
            /* Vista 3.1 — Grilla de resultados con paginación */
            <>
              <div className="cat-resultados-grid">
                {avisosPaginados.map((aviso) => (
                  <TarjetaAviso key={aviso.id} aviso={aviso} />
                ))}
              </div>

              <div className="cat-paginacion">
                <span>
                  Mostrando 1–{avisosPaginados.length} de{' '}
                  {avisosFiltradosYOrdenados.length} resultados
                </span>

                <div className="cat-paginacion-botones">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        type="button"
                        className={`btn btn-sm ${
                          paginaActual === num ? 'btn-primary' : 'btn-outline'
                        }`}
                        onClick={() => setPaginaActual(num)}
                      >
                        {num}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={paginaActual === totalPaginas}
                    onClick={() =>
                      setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                    }
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
