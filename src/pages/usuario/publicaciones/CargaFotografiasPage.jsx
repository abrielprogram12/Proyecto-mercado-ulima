import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import Notificacion from '../../../components/Notificacion/Notificacion';
import { FOTOS_INICIALES_CARGA } from './publicacionesUtils';
import './publicaciones.css';

/**
 * MÓDULO: Publicaciones (Integrante 2 · HU-2)
 * Vista 2.5 — Carga y gestión de fotografías del aviso
 */
export default function CargaFotografiasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerAvisoPorId, avisos, actualizarFotosAviso } = useAviso();

  const aviso = obtenerAvisoPorId(id) || avisos[0];

  const [fotos, setFotos] = useState(
    aviso?.fotos?.length > 0 ? aviso.fotos : FOTOS_INICIALES_CARGA
  );

  const [subiendoSimulado] = useState(true);
  const [errorTamanoSimulado, setErrorTamanoSimulado] = useState(true);
  const [notificacion, setNotificacion] = useState({
    tipo: 'exito',
    mensaje:
      'Éxito. Se guardaron 4 fotografías. La primera será la portada del aviso.'
  });

  const handleHacerPrincipal = (idFoto) => {
    const elegida = fotos.find((f) => f.id === idFoto);
    if (!elegida) return;
    const resto = fotos.filter((f) => f.id !== idFoto);
    const nuevoOrden = [elegida, ...resto].map((f, idx) => ({
      ...f,
      principal: idx === 0
    }));
    setFotos(nuevoOrden);
    setNotificacion({
      tipo: 'exito',
      mensaje: `«${elegida.etiqueta}» es ahora la fotografía principal de portada.`
    });
  };

  const handleEliminarFoto = (idFoto) => {
    const nuevo = fotos
      .filter((f) => f.id !== idFoto)
      .map((f, idx) => ({ ...f, principal: idx === 0 }));
    setFotos(nuevo);
  };

  const handleAgregarFoto = () => {
    if (fotos.length >= 6) {
      setNotificacion({
        tipo: 'advertencia',
        mensaje:
          'Límite alcanzado. Ya tienes 6 de 6 fotografías; elimina una para agregar otra.'
      });
      return;
    }
    const nueva = {
      id: `f-${Date.now()}`,
      etiqueta: `detalle ${fotos.length + 1}`,
      principal: fotos.length === 0
    };
    setFotos([...fotos, nueva]);
  };

  const handleGuardar = () => {
    if (aviso) {
      const res = actualizarFotosAviso(aviso.id, fotos);
      setNotificacion({
        tipo: 'exito',
        mensaje: res.mensaje
      });
    }
    setTimeout(() => navigate('/mis-publicaciones'), 900);
  };

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/mis-publicaciones">Mis publicaciones</Link>
        <span>›</span>
        <Link to={`/editar-aviso/${aviso?.id || 'av-101'}`}>Editar aviso</Link>
        <span>›</span>
        <span>Fotografías</span>
      </div>

      <h1 className="title-screen">Fotografías del aviso</h1>
      <p className="text-aux pub-subtitulo-pagina">
        Máximo 6 imágenes, JPG o PNG de hasta 5 MB cada una. La primera será la
        portada.
      </p>

      <div className="pub-fotos-columnas">
        {/* Panel izquierdo — Zona de carga y grilla de 6 espacios (Vista 2.5) */}
        <div className="card-surface pub-tarjeta">
          <div onClick={handleAgregarFoto} className="pub-dropzone-grande">
            <div className="pub-icono-subir">↑</div>
            <strong className="pub-consejo-titulo">
              Arrastra tus fotografías aquí
            </strong>
            <span className="pub-dropzone-sub">
              o búscalas en tu dispositivo
            </span>
          </div>

          <div className="pub-fotos-cabecera">
            <span className="label-upper">{fotos.length} DE 6 FOTOGRAFÍAS</span>
            <span className="text-aux">
              Arrastra las miniaturas para reordenar
            </span>
          </div>

          <div className="pub-fotos-grid-seis">
            {fotos.map((foto, idx) => (
              <div
                key={foto.id}
                className={`striped-placeholder pub-foto-celda ${
                  idx === 0 ? 'es-principal' : ''
                }`}
              >
                <span>{foto.etiqueta}</span>

                {idx === 0 ? (
                  <span className="pub-badge-principal-arriba">Principal</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm pub-btn-hacer-principal"
                    onClick={() => handleHacerPrincipal(foto.id)}
                  >
                    Hacer principal
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleEliminarFoto(foto.id)}
                  className="pub-btn-quitar-celda"
                >
                  ✕
                </button>
              </div>
            ))}

            {subiendoSimulado && fotos.length < 6 && (
              <div className="pub-celda-subiendo">
                <div className="pub-progreso-pista">
                  <div className="pub-progreso-relleno" />
                </div>
                <span className="text-aux">Subiendo 62 %</span>
              </div>
            )}

            {fotos.length < 6 && (
              <button
                type="button"
                onClick={handleAgregarFoto}
                className="pub-btn-agregar-celda"
              >
                + Agregar
              </button>
            )}

            {errorTamanoSimulado && (
              <div className="pub-celda-error">
                <strong className="pub-celda-error-titulo">
                  No se pudo subir
                </strong>
                <span className="text-aux pub-celda-error-sub">
                  La imagen supera 5 MB
                </span>
                <button
                  type="button"
                  className="btn btn-tertiary btn-sm"
                  onClick={() => setErrorTamanoSimulado(false)}
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>

          <div className="pub-acciones-derecha">
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={() => navigate('/mis-publicaciones')}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGuardar}
            >
              Guardar fotografías
            </button>
          </div>
        </div>

        {/* Panel derecho — Reordenamiento y notificaciones (Vista 2.5) */}
        <div className="pub-pila">
          <div className="card-surface pub-tarjeta-compacta">
            <span className="label-upper">Reordenamiento en curso</span>
            <div className="pub-reordenamiento-demo">
              <div className="striped-placeholder pub-demo-mini-activa" />
              <div className="pub-demo-barra" />
              <div className="striped-placeholder pub-demo-mini-inactiva" />
            </div>
            <p className="text-aux">
              La barra terracota marca la posición donde se soltará la miniatura.
            </p>
          </div>

          <div className="card-surface pub-tarjeta-compacta">
            <span className="label-upper pub-label-notif">
              Notificaciones de resultado
            </span>
            {notificacion && (
              <Notificacion
                tipo={notificacion.tipo}
                mensaje={notificacion.mensaje}
              />
            )}
            <Notificacion
              tipo="error"
              titulo="Error."
              mensaje="Una imagen no se pudo subir. Revísala e inténtalo otra vez."
            />
            <Notificacion
              tipo="advertencia"
              titulo="Límite alcanzado."
              mensaje="Ya tienes 6 de 6 fotografías; elimina una para agregar otra."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
