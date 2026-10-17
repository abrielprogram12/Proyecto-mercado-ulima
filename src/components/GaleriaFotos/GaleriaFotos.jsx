import { useState } from 'react';
import BadgeEstado from '../BadgeEstado/BadgeEstado';
import './GaleriaFotos.css';

export default function GaleriaFotos({ fotos = [], vendido = false }) {
  const listaFotos =
    Array.isArray(fotos) && fotos.length > 0
      ? fotos
      : [
          { id: 'def-1', etiqueta: 'fotografía principal · portada del libro', principal: true },
          { id: 'def-2', etiqueta: 'vista lateral', principal: false },
          { id: 'def-3', etiqueta: 'hojas interiores', principal: false },
          { id: 'def-4', etiqueta: 'contraportada', principal: false }
        ];

  const [indiceActivo, setIndiceActivo] = useState(0);
  const fotoActiva = listaFotos[indiceActivo] || listaFotos[0];

  return (
    <div className="galeria-fotos">
      <div className="galeria-visor-principal striped-placeholder">
        <span className="galeria-visor-etiqueta">
          {fotoActiva.etiqueta || 'visor ampliado'}
        </span>
        {vendido && (
          <div className="galeria-vendido-badge">
            <BadgeEstado estado="Vendido" />
          </div>
        )}
      </div>

      {listaFotos.length > 1 && (
        <div className="galeria-miniaturas">
          {listaFotos.map((foto, idx) => (
            <button
              key={foto.id || idx}
              type="button"
              className={`galeria-miniatura striped-placeholder ${
                idx === indiceActivo ? 'activa' : ''
              }`}
              onClick={() => setIndiceActivo(idx)}
              aria-label={`Ver fotografía ${idx + 1}`}
            >
              <span className="sr-only">{foto.etiqueta}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
