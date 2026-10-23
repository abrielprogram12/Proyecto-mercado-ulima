import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import {
  CATEGORIAS,
  CURSOS_DESTACADOS,
  CONDICIONES_ARTICULO
} from '../../../data/contratoDatos';
import {
  leerArchivoImagen,
  obtenerFotosEnriquecidasAviso
} from '../../../data/imagenesDatos';
import Notificacion from '../../../components/Notificacion/Notificacion';
import {
  FOTOS_INICIALES_FORMULARIO,
  validarFormularioAviso
} from './publicacionesUtils';
import './publicaciones.css';

export default function NuevoAvisoPage() {
  const { id } = useParams();
  const esModoEdicion = Boolean(id);
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();
  const { obtenerAvisoPorId, crearAviso, editarAviso } = useAviso();
  const inputFotosRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    descripcion:
      'Usado un ciclo en Cálculo I con el profesor Mendoza. Tapa firme, sin hojas sueltas, algunas anotaciones a lápiz en los capítulos 3 y 4. Incluye el separador original y la tabla de derivadas que reparten en clase.',
    precio: '95.00',
    aceptaOfertas: true,
    montoMinimo: '70.00',
    fotos: FOTOS_INICIALES_FORMULARIO.map((f) => ({
      ...f,
      url: null
    }))
  });

  const [errores, setErrores] = useState({});
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    if (esModoEdicion) {
      const encontrado = obtenerAvisoPorId(id);
      if (encontrado) {
        const enriquecidas = obtenerFotosEnriquecidasAviso(encontrado);
        setFormData({
          titulo: encontrado.titulo || '',
          categoria: encontrado.categoria || 'Libros de texto',
          curso: encontrado.curso || 'Cálculo I',
          condicion: encontrado.condicion || 'Muy buen estado',
          descripcion: encontrado.descripcion || '',
          precio: String(encontrado.precio || ''),
          aceptaOfertas: Boolean(encontrado.aceptaOfertas),
          montoMinimo: String(
            encontrado.montoMinimo || encontrado.precio || ''
          ),
          fotos: Array.isArray(encontrado.fotos) && encontrado.fotos.length > 0
            ? enriquecidas
            : []
        });
      }
    }
  }, [id, esModoEdicion]);

  const handleChange = (campo, valor) => {
    const actualizado = { ...formData, [campo]: valor };
    setFormData(actualizado);
    if (Object.keys(errores).length > 0) {
      setErrores(validarFormularioAviso(actualizado));
    }
  };

  const handleSeleccionarArchivos = async (e) => {
    const archivos = Array.from(e.target.files || []);
    e.target.value = '';
    if (archivos.length === 0) return;

    const cupoRestante = 6 - formData.fotos.length;
    if (cupoRestante <= 0) return;

    const aProcesar = archivos.slice(0, cupoRestante);
    const nuevas = [];
    let errorDetectado = null;

    for (const file of aProcesar) {
      const res = await leerArchivoImagen(file);
      if (!res.ok) {
        errorDetectado = res.error;
      } else {
        nuevas.push({
          id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          etiqueta: res.nombre.replace(/\.[^.]+$/, ''),
          url: res.url,
          principal: false
        });
      }
    }

    if (errorDetectado) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Archivo no válido.',
        mensaje: errorDetectado
      });
    }

    if (nuevas.length > 0) {
      // Si solo había casillas de ejemplo sin imagen subida, las reemplazamos por las fotos reales subidas
      const fotosConImagenReal = formData.fotos.filter((f) => Boolean(f.url));
      const base =
        fotosConImagenReal.length > 0 ? formData.fotos : [];
      const combinadas = [...base, ...nuevas].slice(0, 6).map((f, idx) => ({
        ...f,
        principal: idx === 0
      }));
      handleChange('fotos', combinadas);
    }
  };

  const handleMarcarPortada = (idFoto) => {
    const objetivo = formData.fotos.find((f) => f.id === idFoto);
    if (!objetivo) return;
    const resto = formData.fotos.filter((f) => f.id !== idFoto);
    const reordenadas = [objetivo, ...resto].map((f, idx) => ({
      ...f,
      principal: idx === 0
    }));
    handleChange('fotos', reordenadas);
  };

  const handleEliminarFoto = (idFoto) => {
    const restantes = formData.fotos
      .filter((f) => f.id !== idFoto)
      .map((f, idx) => ({ ...f, principal: idx === 0 }));
    handleChange('fotos', restantes);
  };

  const handleGuardarBorrador = () => {
    const res = esModoEdicion
      ? editarAviso(id, { ...formData, estado: 'Borrador' })
      : crearAviso(
          {
            ...formData,
            vendedorId: usuarioActual?.id || 'u-1',
            vendedorNombre: usuarioActual
              ? `${usuarioActual.nombres} ${usuarioActual.apellidos}`
              : 'Rosa María Quispe Ríos'
          },
          'Borrador'
        );

    if (res.ok) {
      setNotificacion({
        tipo: 'info',
        mensaje:
          'Borrador guardado. Puedes completarlo y publicarlo cuando quieras.'
      });
      setTimeout(() => navigate('/mis-publicaciones'), 1200);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validarFormularioAviso(formData);
    setErrores(errs);

    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const res = esModoEdicion
      ? editarAviso(id, { ...formData, estado: 'Publicado' })
      : crearAviso(
          {
            ...formData,
            vendedorId: usuarioActual?.id || 'u-1',
            vendedorNombre: usuarioActual
              ? `${usuarioActual.nombres} ${usuarioActual.apellidos}`
              : 'Rosa María Quispe Ríos'
          },
          'Publicado'
        );

    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
      setTimeout(() => navigate('/mis-publicaciones'), 1100);
    }
  };

  const totalErrores = Object.keys(errores).length;

  return (
    <div className="page-container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/mis-publicaciones">Mis publicaciones</Link>
        <span>›</span>
        <span>{esModoEdicion ? 'Editar aviso' : 'Publicar nuevo aviso'}</span>
      </div>

      <div className="pub-form-header">
        <div>
          <h1 className="title-screen">
            {esModoEdicion ? 'Editar aviso' : 'Publicar nuevo aviso'}
          </h1>
          <p className="text-aux pub-form-subtitle">
            Completa los datos del artículo. Puedes guardarlo como borrador y
            terminarlo después.
          </p>
        </div>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {totalErrores > 0 && (
        <Notificacion
          tipo="error"
          titulo={`No se pudo publicar el aviso.`}
          mensaje={`Corrige los ${totalErrores} campos marcados en rojo antes de continuar.`}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Grilla de 2 columnas — Vista 2.3 */}
        <div className="pub-form-grid">
          {/* Columna izquierda: Datos del artículo */}
          <div className="card-surface pub-card-datos">
            <h2 className="title-section pub-section-title">
              Datos del artículo
            </h2>

            {/* Título del aviso */}
            <div className="form-group">
              <label className="label-upper">Título del aviso *</label>
              <input
                type="text"
                className={`form-input ${errores.titulo ? 'input-error' : ''}`}
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                placeholder="Ej. Cálculo de una variable — Stewart, 8.ª ed."
              />
              {errores.titulo ? (
                <span className="field-error">{errores.titulo}</span>
              ) : (
                <span className="field-hint">
                  Incluye autor y edición si es un libro ({formData.titulo.length}
                  /80 caracteres).
                </span>
              )}
            </div>

            {/* Categoría y Curso asociado */}
            <div className="pub-two-cols">
              <div className="form-group">
                <label className="label-upper">Categoría *</label>
                <select
                  className={`form-select ${
                    errores.categoria ? 'input-error' : ''
                  }`}
                  value={formData.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
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

              <div className="form-group">
                <label className="label-upper">Curso asociado (Opcional)</label>
                <select
                  className="form-select"
                  value={formData.curso}
                  onChange={(e) => handleChange('curso', e.target.value)}
                >
                  {CURSOS_DESTACADOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estado del artículo */}
            <div className="form-group">
              <label className="label-upper">Estado del artículo *</label>
              <div className="pub-condicion-chips">
                {CONDICIONES_ARTICULO.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    className={`chip chip-selectable ${
                      formData.condicion === cond ? 'active' : ''
                    }`}
                    onClick={() => handleChange('condicion', cond)}
                  >
                    {cond}
                  </button>
                ))}
              </div>
              {errores.condicion && (
                <span className="field-error">{errores.condicion}</span>
              )}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="label-upper">Descripción *</label>
              <textarea
                rows={4}
                className={`form-textarea ${
                  errores.descripcion ? 'input-error' : ''
                }`}
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Describe el estado real del artículo, si tiene anotaciones o accesorios incluidos..."
              />
              <div className="pub-desc-meta">
                {errores.descripcion ? (
                  <span className="field-error">{errores.descripcion}</span>
                ) : (
                  <span className="field-hint">
                    Mínimo 40 caracteres. Sé honesto sobre el estado real del
                    artículo.
                  </span>
                )}
                <span className="field-hint">
                  {formData.descripcion.length}/600
                </span>
              </div>
            </div>
          </div>

          {/* Columna derecha: Fotografías + Precio y condiciones */}
          <div className="pub-side-stack">
            {/* Tarjeta de Fotografías */}
            <div className="card-surface pub-card-side">
              <div className="pub-side-header">
                <h2 className="title-section pub-side-title">Fotografías *</h2>
                {esModoEdicion && (
                  <Link
                    to={`/aviso/${id}/fotografias`}
                    className="pub-link-ordenar"
                  >
                    Ordenar en pantalla completa →
                  </Link>
                )}
              </div>

              <p className="text-aux pub-side-note">
                Sube entre 1 y 6 fotos desde tu dispositivo (JPG, PNG o WEBP ·
                máx. 5 MB). La primera será la portada.
              </p>

              <input
                ref={inputFotosRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="pub-input-oculto"
                onChange={handleSeleccionarArchivos}
              />

              <div className="pub-slots-grid">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const foto = formData.fotos[idx];
                  if (foto) {
                    return (
                      <div
                        key={foto.id}
                        className={`striped-placeholder pub-slot-card ${
                          idx === 0 ? 'pub-slot-card--principal' : ''
                        }`}
                      >
                        {foto.url && (
                          <img
                            src={foto.url}
                            alt={foto.etiqueta}
                            className="pub-slot-img"
                          />
                        )}
                        {idx === 0 ? (
                          <span className="pub-slot-badge">PORTADA</span>
                        ) : (
                          <button
                            type="button"
                            className="pub-slot-btn-portada"
                            onClick={() => handleMarcarPortada(foto.id)}
                          >
                            Hacer portada
                          </button>
                        )}
                        <span className="pub-slot-label">{foto.etiqueta}</span>
                        <button
                          type="button"
                          onClick={() => handleEliminarFoto(foto.id)}
                          className="pub-slot-remove"
                          title="Eliminar fotografía"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={`empty-${idx}`}
                      type="button"
                      onClick={() => inputFotosRef.current?.click()}
                      className="pub-slot-empty"
                    >
                      + Agregar foto
                    </button>
                  );
                })}
              </div>

              {errores.fotos && (
                <span className="field-error">{errores.fotos}</span>
              )}
            </div>

            {/* Tarjeta de Precio y condiciones */}
            <div className="card-surface pub-card-side">
              <h2 className="title-section pub-section-title">
                Precio y condiciones
              </h2>

              <div className="form-group">
                <label className="label-upper">Precio de venta (S/) *</label>
                <input
                  type="number"
                  step="0.50"
                  className={`form-input ${
                    errores.precio ? 'input-error' : ''
                  }`}
                  value={formData.precio}
                  onChange={(e) => handleChange('precio', e.target.value)}
                />
                {errores.precio && (
                  <span className="field-error">{errores.precio}</span>
                )}
              </div>

              <div className="pub-ofertas-box">
                <label className="pub-ofertas-check-label">
                  <input
                    type="checkbox"
                    checked={formData.aceptaOfertas}
                    onChange={(e) =>
                      handleChange('aceptaOfertas', e.target.checked)
                    }
                    className="pub-ofertas-checkbox"
                  />
                  <div>
                    <strong className="pub-ofertas-check-title">
                      Acepto ofertas de otros estudiantes
                    </strong>
                    <span className="text-aux">
                      Los interesados podrán proponerte un monto menor.
                    </span>
                  </div>
                </label>
              </div>

              {formData.aceptaOfertas && (
                <div className="form-group pub-minimo-group">
                  <label className="label-upper">
                    Monto mínimo que aceptarías (S/)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    className={`form-input ${
                      errores.montoMinimo ? 'input-error' : ''
                    }`}
                    value={formData.montoMinimo}
                    onChange={(e) =>
                      handleChange('montoMinimo', e.target.value)
                    }
                  />
                  {errores.montoMinimo ? (
                    <span className="field-error">{errores.montoMinimo}</span>
                  ) : (
                    <span className="field-hint">
                      Las ofertas por debajo de S/{' '}
                      {Number(formData.montoMinimo || 0).toFixed(2)} se
                      rechazarán solas.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra inferior de acciones */}
        <div className="pub-form-footer">
          <Link to="/mis-publicaciones" className="btn btn-tertiary">
            Cancelar
          </Link>

          <div className="pub-form-footer-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleGuardarBorrador}
            >
              Guardar como borrador
            </button>
            <button type="submit" className="btn btn-primary">
              Publicar aviso
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
