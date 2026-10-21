import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import FiltrosCatalogo from '../../../components/FiltrosCatalogo/FiltrosCatalogo';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';
import Notificacion from '../../../components/Notificacion/Notificacion';

export default function CatalogoPage() {
  const { avisos } = useAviso();
  const [searchParams, setSearchParams] = useSearchParams();

  const [busquedaTexto, setBusquedaTexto] = useState(
    searchParams.get('q') || ''
  );
  const [filtros, setFiltros] = useState({
    categoria: searchParams.get('categoria') || '',
    curso: searchParams.get('curso') || '',
    precioMin: '',
    precioMax: '',
    condicion: ''
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

  const avisosFiltradosYOrdenados = useMemo(() => {
    const resultado = avisosPublicados.filter((a) => {
      if (filtros.categoria && a.categoria !== filtros.categoria) return false;
      if (filtros.curso && a.curso !== filtros.curso) return false;
      if (filtros.condicion && a.condicion !== filtros.condicion) return false;
      if (
        filtros.precioMin !== '' &&
        Number(a.precio) < Number(filtros.precioMin)
      ) {
        return false;
      }
      if (
        filtros.precioMax !== '' &&
        Number(a.precio) > Number(filtros.precioMax)
      ) {
        return false;
      }
      if (busquedaTexto.trim()) {
        const q = busquedaTexto.trim().toLowerCase();
        const coincideTitulo = a.titulo.toLowerCase().includes(q);
        const coincideDesc = (a.descripcion || '').toLowerCase().includes(q);
        const coincideCurso = (a.curso || '').toLowerCase().includes(q);
        if (!coincideTitulo && !coincideDesc && !coincideCurso) return false;
      }
      return true;
    });

    if (orden === 'precio_asc') {
      resultado.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (orden === 'precio_desc') {
      resultado.sort((a, b) => Number(b.precio) - Number(a.precio));
    }
    return resultado;
  }, [avisosPublicados, filtros, busquedaTexto, orden]);

  const ITEMS_POR_PAGINA = 12;
  const totalPaginas = Math.max(
    1,
    Math.ceil(avisosFiltradosYOrdenados.length / ITEMS_POR_PAGINA)
  );
  const avisosPaginados = avisosFiltradosYOrdenados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const chipsActivos = [];
  if (filtros.categoria) {
    chipsActivos.push({
      clave: 'categoria',
      etiqueta: filtros.categoria
    });
  }
  if (filtros.curso) {
    chipsActivos.push({
      clave: 'curso',
      etiqueta: filtros.curso
    });
  }
  if (filtros.precioMin || filtros.precioMax) {
    chipsActivos.push({
      clave: 'rangoPrecio',
      etiqueta: `S/ ${filtros.precioMin || 0} – S/ ${filtros.precioMax || '∞'}`
    });
  }
  if (filtros.condicion) {
    chipsActivos.push({
      clave: 'condicion',
      etiqueta: filtros.condicion
    });
  }
  if (busquedaTexto.trim()) {
    chipsActivos.push({
      clave: 'busqueda',
      etiqueta: `«${busquedaTexto.trim()}»`
    });
  }

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
    setFiltros({
      categoria: '',
      curso: '',
      precioMin: '',
      precioMax: '',
      condicion: ''
    });
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

      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
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
        <div style={{ flex: 1 }}>
          {/* Barra superior de chips de filtros activos (Vista 3.1 y 3.2) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '14px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}
            >
              {chipsActivos.length > 0 && (
                <>
                  <span className="text-aux">Filtros activos:</span>
                  {chipsActivos.map((chip) => (
                    <span key={chip.clave} className="chip chip-terracota">
                      {chip.etiqueta}
                      <button
                        type="button"
                        onClick={() => quitarChip(chip.clave)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
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

            <div style={{ display: 'flex', gap: '8px' }}>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div>
              <strong style={{ fontSize: '18px' }}>
                {avisosFiltradosYOrdenados.length}
              </strong>{' '}
              <span className="text-aux" style={{ fontSize: '15px' }}>
                avisos encontrados
                {busquedaTexto.trim()
                  ? ` para «${busquedaTexto.trim()}»`
                  : ''}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="text-aux">Ordenar por</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '7px 14px' }}
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
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '18px',
                  marginBottom: '24px'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    className="card-surface"
                    style={{ overflow: 'hidden', paddingBottom: '16px' }}
                  >
                    <div
                      style={{
                        height: '160px',
                        backgroundColor: '#EFECE6',
                        marginBottom: '14px'
                      }}
                    />
                    <div style={{ padding: '0 16px' }}>
                      <div
                        style={{
                          height: '12px',
                          width: '85%',
                          backgroundColor: '#EFECE6',
                          borderRadius: '6px',
                          marginBottom: '8px'
                        }}
                      />
                      <div
                        style={{
                          height: '18px',
                          width: '45%',
                          backgroundColor: '#E5DDD5',
                          borderRadius: '6px',
                          marginBottom: '10px'
                        }}
                      />
                      <div
                        style={{
                          height: '10px',
                          width: '65%',
                          backgroundColor: '#EFECE6',
                          borderRadius: '6px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-aux" style={{ textAlign: 'center' }}>
                Buscando avisos… los esqueletos mantienen la altura de la
                tarjeta real para evitar saltos de maquetación.
              </p>
            </div>
          ) : avisosPaginados.length === 0 ? (
            /* Vista 3.2 — Catálogo sin resultados + Quizá te interese */
            <div>
              <div
                className="card-surface"
                style={{
                  padding: '48px 32px',
                  textAlign: 'center',
                  marginBottom: '32px'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--color-primary-soft)',
                    margin: '0 auto 16px'
                  }}
                />
                <h2 className="title-section" style={{ marginBottom: '8px' }}>
                  Ningún aviso coincide con tu búsqueda
                </h2>
                <p
                  className="text-aux"
                  style={{ maxWidth: '460px', margin: '0 auto 22px' }}
                >
                  Prueba con menos filtros o amplía el rango de precio. También
                  puedes crear una alerta y te avisamos cuando alguien publique
                  algo parecido.
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
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

              <span className="label-upper" style={{ marginBottom: '14px' }}>
                Quizá te interese
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px'
                }}
              >
                {sugerenciasQuizaTeInterese.map((av) => (
                  <TarjetaAviso key={av.id} aviso={av} />
                ))}
              </div>
            </div>
          ) : (
            /* Vista 3.1 — Grilla de resultados con paginación */
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(225px, 1fr))',
                  gap: '18px',
                  marginBottom: '28px'
                }}
              >
                {avisosPaginados.map((aviso) => (
                  <TarjetaAviso key={aviso.id} aviso={aviso} />
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <span>
                  Mostrando 1–{avisosPaginados.length} de{' '}
                  {avisosFiltradosYOrdenados.length} resultados
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
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
