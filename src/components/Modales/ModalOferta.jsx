import { useState } from 'react';
import { formatearPrecio } from '../../data/contratoDatos';
import './Modales.css';

export default function ModalOferta({
  abierto,
  onClose,
  aviso,
  modo = 'oferta', // 'oferta' | 'contraoferta'
  ofertaRecibida,
  onConfirmar
}) {
  const precioPedido = Number(aviso?.precio || 95);
  const montoMinimo = Number(aviso?.montoMinimo || 70);

  const [monto, setMonto] = useState(modo === 'contraoferta' ? 84 : 82);
  const [mensaje, setMensaje] = useState('');

  if (!abierto) return null;

  const montoNum = Number(monto || 0);
  const montoInvalido =
    aviso?.aceptaOfertas !== false && (montoNum < montoMinimo || montoNum > precioPedido);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (montoInvalido) return;
    onConfirmar && onConfirmar({ monto: montoNum, mensaje });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {modo === 'contraoferta' ? 'Enviar contraoferta' : 'Enviar una oferta'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-item-preview">
          <div className="modal-preview-thumb striped-placeholder" />
          <div>
            <strong>{aviso?.titulo || 'Cálculo de una variable — Stewart, 8.ª ed.'}</strong>
            <div className="text-aux">
              {aviso?.condicion || 'Muy buen estado'} · {aviso?.curso || 'Cálculo I'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
          <span className="text-aux">Precio pedido</span>
          <strong className="price-text">{formatearPrecio(precioPedido)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px' }}>
          <span className="text-aux">Monto mínimo aceptado</span>
          <strong className="price-text">{formatearPrecio(montoMinimo)}</strong>
        </div>

        {modo === 'contraoferta' && ofertaRecibida && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <div className="card-surface" style={{ padding: '10px' }}>
              <span className="text-aux">Oferta recibida</span>
              <div className="price-text">{formatearPrecio(ofertaRecibida.monto)}</div>
            </div>
            <div className="card-surface" style={{ padding: '10px', borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-soft)' }}>
              <span className="text-aux" style={{ color: 'var(--color-primary)' }}>Tu contraoferta</span>
              <div className="price-text">{formatearPrecio(montoNum)}</div>
            </div>
            <div className="card-surface" style={{ padding: '10px' }}>
              <span className="text-aux">Precio pedido</span>
              <div className="price-text">{formatearPrecio(precioPedido)}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label-upper">
              {modo === 'contraoferta' ? 'Monto que propones' : 'Monto de tu oferta'}
            </label>
            <input
              type="number"
              step="0.50"
              className={`form-input ${montoInvalido ? 'input-error' : ''}`}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            {montoInvalido ? (
              <span className="field-error">
                El vendedor no acepta ofertas por debajo de {formatearPrecio(montoMinimo)}.
              </span>
            ) : (
              <span className="field-hint">
                Entre {formatearPrecio(montoMinimo)} y {formatearPrecio(precioPedido)}.
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="label-upper">Mensaje (Opcional)</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Hola, ¿podrías entregarlo en la Biblioteca esta semana?"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>

          {montoInvalido ? (
            <div className="notificacion-banner notif-error">
              <span>
                <strong>Corrige el monto.</strong> Sube tu oferta a {formatearPrecio(montoMinimo)} o más para poder enviarla.
              </span>
            </div>
          ) : (
            <div className="notificacion-banner notif-advertencia" style={{ backgroundColor: 'var(--color-primary-soft)', borderColor: '#F2D1C2' }}>
              <span>
                Solo puedes tener una oferta activa por aviso. Podrás retirarla mientras el vendedor no responda.
              </span>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-tertiary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={montoInvalido}>
              {modo === 'contraoferta' ? 'Enviar contraoferta' : 'Enviar oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
