import { useState } from 'react';
import './GaleriaFotos.css';

export default function GaleriaFotos({ fotos = [], vendido = false }) {
  const listaFotos =
    Array.isArray(fotos) && fotos.length > 0
      ? fotos
      : [{ id: 'f-default', etiqueta: 'fotografía principal · portada del libro', principal: true }];

  const [indiceActivo, setIndiceActivo] = useState(0);
  const fotoActiva = listaFotos[indiceActivo] || listaFotos[0];

  return (
    <div className="galeria-fotos">
      <div className="galeria-principal striped-placeholder">
        {fotoActiva.url ? (
          <img
            src={fotoActiva.url}
            alt={fotoActiva.etiqueta || 'Fotografía del aviso'}
            className="media-img-cover"
          />
        ) : (
          <span className="galeria-etiqueta-central">
            {fotoActiva.etiqueta || 'fotografía principal'}
          </span>
        )}
        {vendido && <span className="galeria-vendido-badge">VENDIDO</span>}
      </div>

      <div className="galeria-miniaturas">
        {Array.from({ length: 5 }).map((_, idx) => {
          const foto = listaFotos[idx];
          const activa = idx === indiceActivo && Boolean(foto);

          if (!foto) {
            return (
              <div
                key={`vacio-${idx}`}
                className="galeria-thumb galeria-thumb-vacio"
              >
                vacío
              </div>
            );
          }

          return (
            <button
              key={foto.id || idx}
              type="button"
              className={`galeria-thumb striped-placeholder ${activa ? 'activa' : ''}`}
              onClick={() => setIndiceActivo(idx)}
            >
              {foto.url ? (
                <img
                  src={foto.url}
                  alt={foto.etiqueta || `Foto ${idx + 1}`}
                  className="media-img-cover"
                />
              ) : (
                <span>{idx + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
