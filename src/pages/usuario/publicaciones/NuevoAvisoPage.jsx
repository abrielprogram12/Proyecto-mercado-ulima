import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import {
  CATEGORIAS,
  CURSOS_ASOCIADOS,
  CONDICIONES_PRODUCTO
} from '../../../data/contratoDatos';
import TarjetaAviso from '../../../components/TarjetaAviso/TarjetaAviso';
import Notificacion from '../../../components/Notificacion/Notificacion';

export default function NuevoAvisoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();
  const { obtenerAvisoPorId, crearAviso, editarAviso } = useAviso();

  const modoEdicion = Boolean(id);
  const avisoExistente = modoEdicion ? obtenerAvisoPorId(id) : null;

  const [titulo, setTitulo] = useState(
    avisoExistente?.titulo || 'Cálculo de una variable — Stewart, 8.ª ed.'
  );
  const [descripcion, setDescripcion] = useState(
    avisoExistente?.descripcion ||
      'Usado un ciclo en Cálculo I. Tapa firme, sin hojas sueltas, algunas anotaciones a lápiz en los capítulos 3 y 4. Incluye el separador original.'
  );
  const [categoria, setCategoria] = useState(
    avisoExistente?.categoria || 'Libros de texto'
  );
  const [curso, setCurso] = useState(avisoExistente?.curso || 'Cálculo I');
  const [condicion, setCondicion] = useState(
    avisoExistente?.condicion || 'Muy buen estado'
  );
  const [precio, setPrecio] = useState(avisoExistente?.precio ?? 95.0);
  const [aceptaOfertas, setAceptaOfertas] = useState(
    avisoExistente?.aceptaOfertas ?? true
  );
  const [montoMinimo, setMontoMinimo] = useState(
    avisoExistente?.montoMinimo ?? 70.0
  );
  const [fotos, setFotos] = useState(
    avisoExistente?.fotos || [
      { id: 'f-new-1', etiqueta: 'fotografía principal', principal: true },
      { id: 'f-new-2', etiqueta: 'lomo del libro', principal: false },
      { id: 'f-new-3', etiqueta: 'hojas interiores', principal: false }
    ]
  );

  const [errores, setErrores] = useState({});
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    if (avisoExistente) {
      setTitulo(avisoExistente.titulo);
      setDescripcion(avisoExistente.descripcion);
      setCategoria(avisoExistente.categoria);
      setCurso(avisoExistente.curso);
      setCondicion(avisoExistente.condicion);
      setPrecio(avisoExistente.precio);
      setAceptaOfertas(avisoExistente.aceptaOfertas);
      setMontoMinimo(avisoExistente.montoMinimo);
      setFotos(avisoExistente.fotos || []);
    }
  }, [avisoExistente]);

  const validarParaPublicar = () => {
    const errs = {};

    if (!titulo || titulo.trim().length < 15) {
      errs.titulo =
        'El título debe tener al menos 15 caracteres e incluir autor o modelo.';
    }
    if (!categoria) {
      errs.categoria = 'Este campo es obligatorio.';
    }
    if (!precio || Number(precio) <= 0) {
      errs.precio = 'Ingresa un precio válido mayor a S/ 0.00.';
    }
    if (aceptaOfertas && Number(montoMinimo) > Number(precio)) {
      errs.montoMinimo = 'El mínimo no puede ser mayor que el precio pedido.';
    }
    if (!fotos || fotos.length === 0) {
      errs.fotos = 'Necesitas al menos una fotografía para publicar.';
    }

    setErrores(errs);
    return errs;
  };

  const handleAgregarFoto = () => {
    if (fotos.length >= 6) return;
    const nueva = {
      id: `f-${Date.now()}`,
      etiqueta: `fotografía ${fotos.length + 1}`,
      principal: fotos.length === 0
    };
    const actualizadas = [...fotos, nueva];
    setFotos(actualizadas);
    if (errores.fotos) {
      setErrores((prev) => {
        const copia = { ...prev };
        delete copia.fotos;
        return copia;
      });
    }
  };

  const handleQuitarFoto = (idFoto) => {
    const restantes = fotos
      .filter((f) => f.id !== idFoto)
      .map((f, idx) => ({ ...f, principal: idx === 0 }));
    setFotos(restantes);
  };

  const handlePublicar = (e) => {
    e.preventDefault();
    const errs = validarParaPublicar();
    if (Object.keys(errs).length > 0) {
      return;
    }

    const payload = {
      titulo,
      descripcion,
      categoria,
      curso,
      condicion,
      precio: Number(precio),
      aceptaOfertas,
      montoMinimo: aceptaOfertas ? Number(montoMinimo) : Number(precio),
      fotos,
      vendedorId: usuarioActual?.id || 'u-1',
      vendedorNombre: usuarioActual
        ? `${usuarioActual.nombres} ${usuarioActual.apellidos}`
        : 'Rosa María Quispe Ríos'
    };

    const res = modoEdicion
      ? editarAviso(id, { ...payload, estado: 'Publicado' })
      : crearAviso(payload, 'Publicado');

    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
      setTimeout(() => navigate('/mis-publicaciones'), 1100);
    }
  };

  const handleGuardarBorrador = () => {
    setErrores({});
    const payload = {
      titulo: titulo || 'Borrador sin título',
      descripcion,
      categoria: categoria || 'Libros de texto',
      curso,
      condicion,
      precio: Number(precio || 0),
      aceptaOfertas,
      montoMinimo: Number(montoMinimo || 0),
      fotos,
      vendedorId: usuarioActual?.id || 'u-1',
      vendedorNombre: usuarioActual
        ? `${usuarioActual.nombres} ${usuarioActual.apellidos}`
        : 'Rosa María Quispe Ríos'
    };

    const res = modoEdicion
      ? editarAviso(id, { ...payload, estado: 'Borrador' })
      : crearAviso(payload, 'Borrador');

    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: 'Borrador guardado correctamente en Mis publicaciones.'
      });
      setTimeout(() => navigate('/mis-publicaciones'), 1100);
    }
  };

  // Botón de demostración rápida para activar la Vista 2.4 (Errores de validación)
  const simularErroresVista24 = () => {
    setTitulo('Libro');
    setCategoria('');
    setCurso('Estadística Aplicada');
    setCondicion('Buen estado');
    setPrecio(60);
    setAceptaOfertas(true);
    setMontoMinimo(85);
    setFotos([]);
    setErrores({
      titulo:
        'El título debe tener al menos 15 caracteres e incluir autor o modelo.',
      categoria: 'Este campo es obligatorio.',
      montoMinimo: 'El mínimo no puede ser mayor que el precio pedido.',
      fotos: 'Necesitas al menos una fotografía para publicar.'
    });
  };

  const listaErrores = Object.keys(errores);

  return (
    <div className="page-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}
      >
        <div className="breadcrumbs" style={{ marginBottom: 0 }}>
          <Link to="/mis-publicaciones">Mis publicaciones</Link>
          <span>›</span>
          <span>{modoEdicion ? 'Editar aviso' : 'Nuevo aviso'}</span>
        </div>

        <button
          type="button"
          className="chip chip-selectable"
          onClick={simularErroresVista24}
        >
          Probar errores de validación (Vista 2.4)
        </button>
      </div>

      <h1 className="title-screen" style={{ marginBottom: '20px' }}>
        {modoEdicion ? 'Editar aviso' : 'Nuevo aviso'}
      </h1>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {listaErrores.length > 0 && (
        <Notificacion
          tipo="error"
          titulo="No pudimos publicar el aviso."
          mensaje={`Revisa ${listaErrores.length} campos: título, categoría, monto mínimo y fotografías.`}
        />
      )}

      {/* Grilla de 3 columnas — Vistas 2.3 y 2.4 */}
      <form
        onSubmit={handlePublicar}
        noValidate
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.1fr 0.9fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Columna 1: 1 · Producto + 2 · Condición */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-surface" style={{ padding: '24px 26px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '16px' }}
            >
              1 · Producto
            </h2>

            <div className="form-group">
              <label className="label-upper">Título del aviso</label>
              <input
                type="text"
                maxLength={80}
                className={`form-input ${errores.titulo ? 'input-error' : ''}`}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              {errores.titulo ? (
                <span className="field-error">{errores.titulo}</span>
              ) : (
                <span className="field-hint">
                  Incluye autor y edición: así lo buscan tus compañeros.{' '}
                  {titulo.length}/80 caracteres.
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="label-upper">Descripción</label>
              <textarea
                rows={4}
                className="form-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px'
              }}
            >
              <div>
                <label className="label-upper">Categoría</label>
                <select
                  className={`form-select ${
                    errores.categoria ? 'input-error' : ''
                  }`}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecciona</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errores.categoria && (
                  <span className="field-error">{errores.categoria}</span>
                )}
              </div>

              <div>
                <label className="label-upper">Curso asociado</label>
                <select
                  className="form-select"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                >
                  <option value="">Sin curso asociado</option>
                  {CURSOS_ASOCIADOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card-surface" style={{ padding: '24px 26px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '12px' }}
            >
              2 · Condición
            </h2>
            <span className="label-upper">Estado del producto</span>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '8px',
                marginBottom: '10px'
              }}
            >
              {CONDICIONES_PRODUCTO.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip chip-selectable ${
                    condicion === c ? 'active' : ''
                  }`}
                  onClick={() => setCondicion(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="field-hint">
              Sé honesto: la calificación después del acuerdo depende de esto.
            </span>
          </div>
        </div>

        {/* Columna 2: 3 · Precio + 4 · Fotografías */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-surface" style={{ padding: '24px 26px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '16px' }}
            >
              3 · Precio
            </h2>

            <div className="form-group">
              <label className="label-upper">Precio pedido (S/)</label>
              <input
                type="number"
                step="0.50"
                min="1"
                className={`form-input ${errores.precio ? 'input-error' : ''}`}
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
              <span className="field-hint">
                Rango sugerido para este título: S/ 80 – S/ 110.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={aceptaOfertas}
                  onChange={(e) => setAceptaOfertas(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--color-primary)'
                  }}
                />
                <span>Acepto ofertas por un monto menor</span>
              </label>
            </div>

            {aceptaOfertas && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-upper">
                  Monto mínimo que aceptarás (S/)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  className={`form-input ${
                    errores.montoMinimo ? 'input-error' : ''
                  }`}
                  value={montoMinimo}
                  onChange={(e) => setMontoMinimo(e.target.value)}
                />
                {errores.montoMinimo && (
                  <span className="field-error">{errores.montoMinimo}</span>
                )}
              </div>
            )}
          </div>

          <div className="card-surface" style={{ padding: '24px 26px' }}>
            <h2
              className="title-section"
              style={{ color: 'var(--color-primary)', marginBottom: '16px' }}
            >
              4 · Fotografías
            </h2>

            {fotos.length === 0 ? (
              <div
                style={{
                  border: `1px dashed ${
                    errores.fotos ? 'var(--color-error)' : 'var(--color-primary)'
                  }`,
                  backgroundColor: 'var(--color-primary-soft)',
                  borderRadius: 'var(--radius-btn)',
                  padding: '32px 20px',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '6px' }}>
                  Arrastra tus fotografías aquí o selecciónalas
                </p>
                {errores.fotos && (
                  <span className="field-error" style={{ marginBottom: '10px' }}>
                    {errores.fotos}
                  </span>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAgregarFoto}
                >
                  + Agregar fotografía
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px'
                  }}
                >
                  {fotos.map((f, idx) => (
                    <div
                      key={f.id}
                      className="striped-placeholder"
                      style={{
                        position: 'relative',
                        height: '100px',
                        borderRadius: 'var(--radius-btn)',
                        border:
                          idx === 0
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)'
                      }}
                    >
                      {idx === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px'
                          }}
                        >
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleQuitarFoto(f.id)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {fotos.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAgregarFoto}
                      style={{
                        height: '100px',
                        borderRadius: 'var(--radius-btn)',
                        border: '1px dashed var(--color-primary)',
                        backgroundColor: 'var(--color-primary-soft)',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + Agregar foto
                    </button>
                  )}
                </div>
                <span className="field-hint">
                  {fotos.length} de 6 fotografías. Arrastra las miniaturas para
                  reordenarlas.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Columna 3: Resumen de errores (2.4) + Vista previa en vivo + Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {listaErrores.length > 0 && (
            <div className="card-surface" style={{ padding: '18px 22px' }}>
              <span className="label-upper">Campos por corregir</span>
              <ul
                style={{
                  paddingLeft: '18px',
                  color: 'var(--color-error)',
                  fontSize: '14px',
                  marginTop: '6px'
                }}
              >
                {errores.titulo && <li>Título del aviso</li>}
                {errores.categoria && <li>Categoría</li>}
                {errores.montoMinimo && <li>Monto mínimo</li>}
                {errores.fotos && <li>Fotografías</li>}
              </ul>
            </div>
          )}

          <div>
            <span className="label-upper" style={{ marginBottom: '8px' }}>
              Vista previa de la tarjeta
            </span>
            <TarjetaAviso
              modoVistaPrevia
              aviso={{
                id: 'preview',
                titulo: titulo || 'Sin título',
                precio: Number(precio || 0),
                condicion,
                curso,
                fotos
              }}
            />
          </div>

          <div
            className="card-surface"
            style={{
              padding: '16px 18px',
              backgroundColor: 'var(--color-bg)'
            }}
          >
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              Antes de publicar
            </strong>
            <p className="text-aux">
              Toma las fotos con luz natural, muestra la portada y el estado real
              de las hojas. Un aviso con 3 fotografías recibe el doble de ofertas.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Publicar
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={handleGuardarBorrador}
          >
            Guardar borrador
          </button>

          {listaErrores.length > 0 && (
            <span className="field-hint" style={{ textAlign: 'center' }}>
              El borrador sí se guarda con errores.
            </span>
          )}

          <button
            type="button"
            className="btn btn-tertiary"
            style={{ width: '100%' }}
            onClick={() => navigate('/mis-publicaciones')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
