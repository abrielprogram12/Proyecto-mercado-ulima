import { useState } from 'react';
import { obtenerImagenPorCategoria } from '../../data/imagenesDatos';
import './Modales.css';

const MOTIVOS_REPORTE = [
  'El producto no corresponde al aviso',
  'Posible estafa o precio sospechoso',
  'Producto prohibido en el campus',
  'Contenido ofensivo o lenguaje inapropiado',
  'Publicación duplicada',
  'Otro motivo'
];

export default function ModalReporte({
  abierto,
  onClose,
  tituloElemento = 'Cálculo de una variable — Stewart, 8.ª ed.',
  subtituloElemento = 'Publicado por Rosa María Quispe Ríos · 18/08/2026',
  onEnviarReporte
}) {
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  if (!abierto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!motivo || descripcion.trim().length < 30) {
      setError('Faltan datos. Selecciona un motivo y describe el problema (mínimo 30 caracteres).');
      return;
    }
    setError('');
    onEnviarReporte && onEnviarReporte({ motivo, descripcion: descripcion.trim() });
  };

  const thumbUrl = obtenerImagenPorCategoria('Libros de texto', tituloElemento);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reportar este aviso</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-item-preview">
          <div className="modal-preview-thumb striped-placeholder">
            <img
              src={thumbUrl}
              alt={tituloElemento}
              className="media-img-cover"
            />
          </div>
          <div>
            <strong>{tituloElemento}</strong>
            <div className="text-aux">{subtituloElemento}</div>
          </div>
        </div>

        {error && (
          <div className="notificacion-banner notif-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <span className="label-upper">Motivo del reporte *</span>
          <div className="modal-radio-list">
            {MOTIVOS_REPORTE.map((m) => (
              <label
                key={m}
                className={`modal-radio-option ${motivo === m ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="motivo-reporte"
                  checked={motivo === m}
                  onChange={() => setMotivo(m)}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>

          <div className="form-group">
            <label className="label-upper">Descripción *</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Cuéntanos qué pasó con el mayor detalle posible (mínimo 30 caracteres)."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <span className="field-hint">
              Mínimo 30 caracteres ({descripcion.trim().length}/30). Cuéntanos qué pasó con el mayor detalle posible.
            </span>
          </div>

          <div className="modal-soft-callout">
            Tu reporte es anónimo para la otra parte. Un administrador lo revisará en un plazo de 48 horas.
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-tertiary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-destructive">
              Enviar reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
