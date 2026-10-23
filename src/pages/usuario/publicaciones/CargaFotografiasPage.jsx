import { useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import {
  leerArchivoImagen,
  obtenerFotosEnriquecidasAviso
} from '../../../data/imagenesDatos';
import Notificacion from '../../../components/Notificacion/Notificacion';
import './publicaciones.css';

export default function CargaFotografiasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerAvisoPorId, actualizarFotosAviso } = useAviso();
  const inputFotosRef = useRef(null);

  const aviso = obtenerAvisoPorId(id);

  const [fotos, setFotos] = useState(() => {
    if (aviso) {
      return obtenerFotosEnriquecidasAviso(aviso);
    }
    return [];
  });

  const [arrastrando, setArrastrando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const procesarListaArchivos = async (fileList) => {
    const archivos = Array.from(fileList || []);
    if (archivos.length === 0) return;

    const cupo = 6 - fotos.length;
    if (cupo <= 0) {
      setNotificacion({
        tipo: 'advertencia',
        titulo: 'Límite alcanzado.',
        mensaje: 'Cada aviso puede tener hasta un máximo de 6 fotografías.'
      });
      return;
    }

    const seleccionados = archivos.slice(0, cupo);
    const nuevas = [];
    let errorUltimo = null;

    for (const file of seleccionados) {
      const res = await leerArchivoImagen(file);
      if (!res.ok) {
        errorUltimo = res.error;
      } else {
        nuevas.push({
          id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          etiqueta: res.nombre.replace(/\.[^.]+$/, ''),
          url: res.url,
          principal: false
        });
      }
    }

    if (errorUltimo) {
      setNotificacion({
        tipo: 'error',
        titulo: 'No se pudo cargar un archivo.',
        mensaje: errorUltimo
      });
    }

    if (nuevas.length > 0) {
      setFotos((prev) =>
        [...prev, ...nuevas].map((f, idx) => ({
          ...f,
          principal: idx === 0
        }))
      );
      if (!errorUltimo) {
        setNotificacion({
          tipo: 'exito',
          titulo: 'Fotografía cargada.',
          mensaje: `Se agregaron ${nuevas.length} ${
            nuevas.length === 1 ? 'fotografía' : 'fotografías'
          } a la galería.`
        });
      }
    }
  };

  const handleSeleccionarArchivos = (e) => {
    const files = e.target.files;
    e.target.value = '';
    procesarListaArchivos(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    procesarListaArchivos(e.dataTransfer?.files);
  };

  const moverFoto = (index, direccion) => {
    const destino = index + direccion;
    if (destino < 0 || destino >= fotos.length) return;
    const copia = [...fotos];
    const [extraida] = copia.splice(index, 1);
    copia.splice(destino, 0, extraida);
    setFotos(copia.map((f, idx) => ({ ...f, principal: idx === 0 })));
  };

  const hacerPrincipal = (index) => {
    if (index === 0) return;
    const copia = [...fotos];
    const [extraida] = copia.splice(index, 1);
    copia.unshift(extraida);
    setFotos(copia.map((f, idx) => ({ ...f, principal: idx === 0 })));
  };

  const eliminarFoto = (idFoto) => {
    setFotos((prev) =>
      prev
        .filter((f) => f.id !== idFoto)
        .map((f, idx) => ({ ...f, principal: idx === 0 }))
    );
  };

  const handleGuardarFotos = () => {
    if (fotos.length === 0) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Falta al menos una fotografía.',
        mensaje: 'Agrega por lo menos 1 imagen para la portada del aviso.'
      });
      return;
    }

    const res = actualizarFotosAviso(id || 'av-101', fotos);
    if (res.ok) {
      setNotificacion({
        tipo: 'exito',
        titulo: 'Éxito.',
        mensaje: res.mensaje
      });
      setTimeout(() => navigate('/mis-publicaciones'), 1200);
    }
  };

  return (
    <div className="page-container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/mis-publicaciones">Mis publicaciones</Link>
        <span>›</span>
        <Link to={`/editar-aviso/${id || 'av-101'}`}>
          {aviso?.titulo || 'Cálculo de una variable — Stewart'}
        </Link>
        <span>›</span>
        <span>Fotografías</span>
      </div>

      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {/* Grilla de 2 columnas — Vista 2.5 */}
      <div className="pub-photos-grid">
        {/* Columna izquierda: Zona de arrastre y casillas reordenables */}
        <div className="card-surface pub-photos-card">
          <h1 className="title-screen pub-photos-title">
            Fotografías del aviso
          </h1>
          <p className="text-aux pub-photos-subtitle">
            Arrastra tus imágenes o selecciónalas desde tu dispositivo. Puedes
            subir de 1 a 6 fotos en JPG, PNG o WEBP (máximo 5 MB cada una).
          </p>

          <input
            ref={inputFotosRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="pub-input-oculto"
            onChange={handleSeleccionarArchivos}
          />

          {/* Dropzone */}
          <div
            onClick={() => inputFotosRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={handleDrop}
            className={`pub-dropzone ${
              arrastrando ? 'pub-dropzone--dragging' : ''
            }`}
          >
            <div className="pub-dropzone-icon">+</div>
            <strong className="pub-dropzone-title">
              Suelta tus fotos aquí o haz clic para buscarlas en tu equipo
            </strong>
            <span className="text-aux">
              Formatos permitidos: JPG, PNG, WEBP · Peso máximo por foto: 5 MB
            </span>
          </div>

          {/* Encabezado de reordenamiento */}
          <div className="pub-reorder-header">
            <span className="label-upper">
              Orden de aparición · {fotos.length} de 6 cargadas
            </span>
            <span className="text-aux">
              Usa las flechas o «Hacer principal» para reordenar
            </span>
          </div>

          {/* 6 casillas */}
          <div className="pub-reorder-slots">
            {Array.from({ length: 6 }).map((_, idx) => {
              const foto = fotos[idx];
              if (foto) {
                return (
                  <div
                    key={foto.id}
                    className={`pub-reorder-item ${
                      idx === 0 ? 'pub-reorder-item--principal' : ''
                    }`}
                  >
                    <div className="striped-placeholder pub-reorder-preview">
                      {foto.url ? (
                        <img
                          src={foto.url}
                          alt={foto.etiqueta}
                          className="media-img-cover"
                        />
                      ) : (
                        <span>{foto.etiqueta || 'sin foto'}</span>
                      )}
                      {idx === 0 && (
                        <span className="pub-reorder-badge">
                          1 · PRINCIPAL
                        </span>
                      )}
                    </div>

                    <div className="pub-reorder-controls">
                      <div className="pub-reorder-arrows">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moverFoto(idx, -1)}
                          className="pub-arrow-btn"
                          title="Mover a la izquierda"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={idx === fotos.length - 1}
                          onClick={() => moverFoto(idx, 1)}
                          className="pub-arrow-btn"
                          title="Mover a la derecha"
                        >
                          →
                        </button>
                      </div>

                      <div className="pub-reorder-right">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => hacerPrincipal(idx)}
                            className="pub-btn-hacer-principal"
                          >
                            Principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => eliminarFoto(foto.id)}
                          className="pub-btn-eliminar-foto"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={`slot-${idx}`}
                  type="button"
                  onClick={() => inputFotosRef.current?.click()}
                  className="pub-reorder-empty"
                >
                  {idx + 1} · Vacío (+ Agregar)
                </button>
              );
            })}
          </div>

          <div className="pub-photos-footer">
            <Link
              to={`/editar-aviso/${id || 'av-101'}`}
              className="btn btn-tertiary"
            >
              ← Volver al formulario
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGuardarFotos}
            >
              Guardar fotografías
            </button>
          </div>
        </div>

        {/* Columna derecha: Recomendaciones para fotografías claras */}
        <div className="pub-side-stack">
          <div className="card-surface pub-card-side">
            <h2 className="title-section pub-section-title">
              Recomendaciones para tus fotos
            </h2>
            <div className="pub-tips-list">
              <p className="text-body">
                <strong>1. Portada nítida:</strong> Coloca como primera foto la
                portada completa del libro, calculadora o instrumento con luz
                natural.
              </p>
              <p className="text-body">
                <strong>2. Muestra el estado real:</strong> Incluye fotos del
                lomo, páginas interiores o cualquier detalle de uso mencionado
                en la descripción.
              </p>
              <p className="text-body">
                <strong>3. Accesorios incluidos:</strong> Si entregas estuche,
                manual, separador o tablas impresas, súbelos en las casillas
                adicionales.
              </p>
            </div>
          </div>

          <div className="card-surface pub-card-side">
            <span className="label-upper">Requisitos técnicos</span>
            <p className="text-aux">
              • Mínimo 1 fotografía y máximo 6 por publicación.
              <br />• Formatos admitidos: <strong>JPG, PNG y WEBP</strong>.
              <br />• Tamaño máximo por archivo: <strong>5 MB</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
