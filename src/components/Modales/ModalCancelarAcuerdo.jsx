import { useState } from 'react';
import './Modales.css';

const MOTIVOS_CANCELACION = [
  'Ya no puedo asistir al encuentro',
  'La contraparte no responde',
  'El producto ya no está disponible',
  'No llegamos a un acuerdo de horario',
  'Otro motivo'
];

export default function ModalCancelarAcuerdo({
  abierto,
  onClose,
  acuerdo,
  onConfirmar
}) {
  const [motivo, setMotivo] = useState('');
  const [comentario, setComentario] = useState('');

  if (!abierto) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="modal-warn-icon">!</span>
            Cancelar el acuerdo {acuerdo?.id || 'A-2314'}
          </h3>
        </div>
        <p className="text-aux modal-desc-mb">
          Cancelar un acuerdo afecta tu reputación y se registra en el historial de ambas partes.
        </p>

        <div className="notificacion-banner notif-advertencia">
          <span>
            <strong>El aviso volverá al estado publicado</strong> y podrá recibir ofertas nuevamente.
          </span>
        </div>

        <span className="label-upper">Motivo de la cancelación *</span>
        <div className="modal-radio-list">
          {MOTIVOS_CANCELACION.map((m) => (
            <label
              key={m}
              className={`modal-radio-option ${motivo === m ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="motivo-cancelacion"
                checked={motivo === m}
                onChange={() => setMotivo(m)}
              />
              <span>{m}</span>
            </label>
          ))}
        </div>

        <div className="form-group">
          <label className="label-upper">Comentario para la contraparte (Opcional)</label>
          <textarea
            rows={2}
            className="form-textarea"
            placeholder="Cuéntale brevemente qué pasó…"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-tertiary" onClick={onClose}>
            Volver
          </button>
          <button
            type="button"
            className="btn btn-destructive"
            disabled={!motivo}
            onClick={() => onConfirmar && onConfirmar({ motivo, comentario })}
          >
            Cancelar el acuerdo
          </button>
        </div>
      </div>
    </div>
  );
}
