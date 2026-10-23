import { useState } from 'react';
import { obtenerIniciales } from '../../data/contratoDatos';
import './Modales.css';

const MOTIVOS_BLOQUEO = [
  'Reportes reiterados por estafa',
  'Conducta ofensiva',
  'Uso indebido de la plataforma',
  'Otro motivo'
];

export default function ModalBloquearCuenta({
  abierto,
  onClose,
  usuario,
  onConfirmar
}) {
  const [motivo, setMotivo] = useState('Reportes reiterados por estafa');
  const [detalle, setDetalle] = useState(
    'Tres reportes independientes por pedir pagos adelantados fuera del campus.'
  );

  if (!abierto) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="modal-warn-icon">!</span>
            Bloquear cuenta
          </h3>
        </div>

        <div className="modal-item-preview">
          <div className="striped-placeholder modal-item-thumb">
            {obtenerIniciales(usuario?.nombres, usuario?.apellidos)}
          </div>
          <div>
            <strong>
              {usuario?.nombres} {usuario?.apellidos}
            </strong>
            <div className="text-aux">
              {usuario?.correo || '20226677@aloe.ulima.edu.pe'} ·{' '}
              {usuario?.reputacion || 3.1} ★ ·{' '}
              {usuario?.reportesAcumulados || 3} reportes
            </div>
          </div>
        </div>

        <div className="notificacion-banner notif-advertencia">
          <span>
            Se retirarán sus avisos publicados y se cancelarán sus acuerdos en
            curso. No podrá iniciar sesión hasta que se levante el bloqueo.
          </span>
        </div>

        <span className="label-upper">Motivo del bloqueo *</span>
        <div className="modal-radio-list">
          {MOTIVOS_BLOQUEO.map((m) => (
            <label
              key={m}
              className={`modal-radio-option ${motivo === m ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="motivo-bloqueo"
                checked={motivo === m}
                onChange={() => setMotivo(m)}
              />
              <span>{m}</span>
            </label>
          ))}
        </div>

        <div className="form-group">
          <label className="label-upper">Detalle para la bitácora *</label>
          <textarea
            rows={2}
            className="form-textarea"
            placeholder="Tres reportes independientes por pedir pagos adelantados fuera del campus."
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-tertiary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-destructive"
            disabled={!motivo || !detalle.trim()}
            onClick={() => onConfirmar && onConfirmar({ motivo, detalle })}
          >
            Bloquear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
