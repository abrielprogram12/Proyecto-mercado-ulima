import { useState } from 'react';
import { useAviso } from '../../../context/AvisoContext';
import FiltrosCatalogo from '../../../components/FiltrosCatalogo/FiltrosCatalogo';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import EstadoVacio from '../../../components/EstadoVacio/EstadoVacio';

/**
 * MÓDULO: Catálogo y búsqueda (Asignado al Integrante 3)
 * Vista 3.1 / 3.2 / 3.3 — Catálogo de avisos
 */
export default function CatalogoPage() {
  const { obtenerAvisosPublicados } = useAviso();
  const [filtros, setFiltros] = useState({
    categoria: '',
    curso: '',
    precioMin: '',
    precioMax: '',
    condicion: ''
  });

  const avisosPublicados = obtenerAvisosPublicados();

  return (
    <div className="page-container">
      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
        <FiltrosCatalogo
          filtros={filtros}
          onChangeFiltros={setFiltros}
          onLimpiarTodo={() =>
            setFiltros({
              categoria: '',
              curso: '',
              precioMin: '',
              precioMax: '',
              condicion: ''
            })
          }
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px'
            }}
          >
            <h1 className="title-section">
              {avisosPublicados.length} avisos disponibles en el catálogo
            </h1>
            <span className="text-aux">Módulo base — Integrante 3</span>
          </div>

          {avisosPublicados.length === 0 ? (
            <EstadoVacio
              titulo="Ningún aviso coincide con tu búsqueda"
              descripcion="Prueba con menos filtros o amplía el rango de precio."
              textoBoton="Limpiar filtros"
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '18px'
              }}
            >
              {avisosPublicados.map((aviso) => (
                <TarjetaAviso key={aviso.id} aviso={aviso} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
