import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAviso } from '../../../context/AvisoContext';
import Notificacion from '../../../components/Notificacion/Notificacion';

export default function CargaFotografiasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerAvisoPorId, avisos, actualizarFotosAviso } = useAviso();

  const aviso = obtenerAvisoPorId(id) || avisos[0];

  const [fotos, setFotos] = useState(
    aviso?.fotos?.length > 0
      ? aviso.fotos
      : [
          { id: 'f-1', etiqueta: 'portada', principal: true },
          { id: 'f-2', etiqueta: 'lomo', principal: false },
          { id: 'f-3', etiqueta: 'hojas interiores', principal: false },
          { id: 'f-4', etiqueta: 'contraportada', principal: false }
        ]
  );

  const [subiendoSimulado, setSubiendoSimulado] = useState(true);
  const [errorTamanoSimulado, setErrorTamanoSimulado] = useState(true);
  const [notificacion, setNotificacion] = useState({
    tipo: 'exito',
    mensaje: 'Éxito. Se guardaron 4 fotografías. La primera será la portada del aviso.'
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

      <h1 className="title-screen" style={{ marginBottom: '4px' }}>
        Fotografías del aviso
      </h1>
      <p className="text-aux" style={{ marginBottom: '24px' }}>
        Máximo 6 imágenes, JPG o PNG de hasta 5 MB cada una. La primera será la
        portada.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.85fr 1fr',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* Panel izquierdo — Zona de carga y grilla de 6 espacios (Vista 2.5) */}
        <div className="card-surface" style={{ padding: '26px' }}>
          <div
            onClick={handleAgregarFoto}
            style={{
              backgroundColor: 'var(--color-primary-soft)',
              border: '1px dashed var(--color-primary)',
              borderRadius: 'var(--radius-card)',
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '22px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontWeight: 700
              }}
            >
              ↑
            </div>
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              Arrastra tus fotografías aquí
            </strong>
            <span style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}>
              o búscalas en tu dispositivo
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}
          >
            <span className="label-upper">{fotos.length} DE 6 FOTOGRAFÍAS</span>
            <span className="text-aux">
              Arrastra las miniaturas para reordenar
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px'
            }}
          >
            {fotos.map((foto, idx) => (
              <div
                key={foto.id}
                className="striped-placeholder"
                style={{
                  position: 'relative',
                  height: '135px',
                  borderRadius: 'var(--radius-btn)',
                  border:
                    idx === 0
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border)'
                }}
              >
                <span>{foto.etiqueta}</span>

                {idx === 0 ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px'
                    }}
                  >
                    Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      padding: '3px 10px',
                      fontSize: '11px'
                    }}
                    onClick={() => handleHacerPrincipal(foto.id)}
                  >
                    Hacer principal
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleEliminarFoto(foto.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            {subiendoSimulado && fotos.length < 6 && (
              <div
                style={{
                  height: '135px',
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-primary-soft)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px'
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: '6px',
                    backgroundColor: '#E8DFD8',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}
                >
                  <div
                    style={{
                      width: '62%',
                      height: '100%',
                      backgroundColor: 'var(--color-primary)'
                    }}
                  />
                </div>
                <span className="text-aux">Subiendo 62 %</span>
              </div>
            )}

            {fotos.length < 6 && (
              <button
                type="button"
                onClick={handleAgregarFoto}
                style={{
                  height: '135px',
                  borderRadius: 'var(--radius-btn)',
                  border: '1px dashed var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Agregar
              </button>
            )}

            {errorTamanoSimulado && (
              <div
                style={{
                  height: '135px',
                  borderRadius: 'var(--radius-btn)',
                  border: '1px solid var(--color-error)',
                  backgroundColor: 'var(--color-error-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '12px'
                }}
              >
                <strong
                  style={{
                    color: 'var(--color-error)',
                    fontSize: '13px'
                  }}
                >
                  No se pudo subir
                </strong>
                <span className="text-aux" style={{ fontSize: '12px' }}>
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '14px',
              marginTop: '24px'
            }}
          >
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-surface" style={{ padding: '20px 22px' }}>
            <span className="label-upper">Reordenamiento en curso</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '12px 0'
              }}
            >
              <div
                className="striped-placeholder"
                style={{
                  width: '100px',
                  height: '74px',
                  borderRadius: '8px',
                  border: '2px solid var(--color-primary)'
                }}
              />
              <div
                style={{
                  width: '4px',
                  height: '74px',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '2px'
                }}
              />
              <div
                className="striped-placeholder"
                style={{
                  width: '100px',
                  height: '74px',
                  borderRadius: '8px',
                  opacity: 0.65
                }}
              />
            </div>
            <p className="text-aux">
              La barra terracota marca la posición donde se soltará la miniatura.
            </p>
          </div>

          <div className="card-surface" style={{ padding: '20px 22px' }}>
            <span className="label-upper" style={{ marginBottom: '12px' }}>
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
