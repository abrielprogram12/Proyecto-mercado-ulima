import { useState } from 'react';
import './GaleriaFotos.css';

export default function GaleriaFotos({ fotos = [], vendido = false }) {
  const listaFotos =
    Array.isArray(fotos) && fotos.length > 0
      ? fotos
      : [
          {
            id: 'f-default',
            etiqueta: 'Sin fotografía disponible',
            url: null,
            principal: true
          }
        ];

  const [indiceActivo, setIndiceActivo] = useState(0);
  const fotoActiva = listaFotos[indiceActivo] || listaFotos[0];

  return (
    <div className="galeria-fotos">
      <div className="galeria-visor-principal striped-placeholder">
        {fotoActiva.url ? (
          <img
            src={fotoActiva.url}
            alt={fotoActiva.etiqueta || 'Fotografía del aviso'}
            className="media-img-cover"
          />
        ) : (
          <span className="galeria-visor-etiqueta">
            {fotoActiva.etiqueta || 'Sin fotografía disponible'}
          </span>
        )}
        {vendido && (
          <div className="galeria-vendido-badge">
            <span className="galeria-vendido-pill">VENDIDO</span>
          </div>
        )}
      </div>

      <div className="galeria-miniaturas">
        {Array.from({ length: 5 }).map((_, idx) => {
          const foto = listaFotos[idx];
          const activa = idx === indiceActivo && Boolean(foto);

          if (!foto) {
            return (
              <div
                key={`vacio-${idx}`}
                className="galeria-miniatura galeria-miniatura-vacia"
              >
                vacío
              </div>
            );
          }

          return (
            <button
              key={foto.id || idx}
              type="button"
              className={`galeria-miniatura striped-placeholder ${
                activa ? 'activa' : ''
              }`}
              onClick={() => setIndiceActivo(idx)}
            >
              {foto.url ? (
                <img
                  src={foto.url}
                  alt={foto.etiqueta || `Foto ${idx + 1}`}
                  className="media-img-cover"
                />
              ) : (
                <span className="galeria-miniatura-etiqueta">
                  {idx + 1} · {foto.etiqueta || 'sin foto'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
