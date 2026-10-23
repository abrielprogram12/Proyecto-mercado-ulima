import { useState, useEffect } from 'react';
import { formatearPrecio } from '../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../data/imagenesDatos';
import './Modales.css';

export default function ModalOferta({
  abierto,
  onClose,
  modo = 'oferta', // 'oferta' | 'contraoferta' | 'propuesta-comprador'
  aviso,
  ofertaRecibida = null,
  onConfirmar
}) {
  const precioPedido = Number(aviso?.precio || 95);
  const montoMinimo = Number(aviso?.montoMinimo || 70);
  const esContraoferta = modo === 'contraoferta';
  const esPropuestaComprador = modo === 'propuesta-comprador';

  const sugerencias = [
    Math.round(precioPedido * 0.8),
    Math.round(precioPedido * 0.85),
    Math.round(precioPedido * 0.9)
  ];

  const [monto, setMonto] = useState(
    esContraoferta
      ? '84.00'
      : esPropuestaComprador
      ? String(Math.round((Number(ofertaRecibida?.monto || 80) + Number(ofertaRecibida?.montoContraoferta || 84)) / 2))
      : String(sugerencias[1] || 80)
  );
  const [mensaje, setMensaje] = useState(
    esContraoferta
      ? 'Cerramos en S/ 84 en la Biblioteca a las 10:00.'
      : esPropuestaComprador
      ? '¿Podemos cerrar en este monto y recogerlo hoy en la Biblioteca?'
      : 'Hola, ¿lo podrías entregar mañana en la Biblioteca entre las 11 y la 1?'
  );
  const [errorMonto, setErrorMonto] = useState('');

  useEffect(() => {
    if (abierto) {
      setErrorMonto('');
      if (esContraoferta) {
        setMonto('84.00');
      } else if (esPropuestaComprador) {
        const prom = Math.round(
          (Number(ofertaRecibida?.monto || 80) +
            Number(ofertaRecibida?.montoContraoferta || 84)) /
            2
        );
        setMonto(String(prom));
      } else {
        setMonto(String(Math.round(precioPedido * 0.84)));
      }
    }
  }, [abierto, esContraoferta, esPropuestaComprador, precioPedido]);

  if (!abierto) return null;

  const validarYEnviar = (e) => {
    e.preventDefault();
    const valorNum = Number(monto);

    if (!valorNum || valorNum <= 0) {
      setErrorMonto('Ingresa un monto válido mayor a S/ 0.');
      return;
    }

    if (!esContraoferta && aviso?.aceptaOfertas && valorNum < montoMinimo) {
      setErrorMonto(
        `El vendedor no acepta ofertas por debajo de ${formatearPrecio(montoMinimo)}.`
      );
      return;
    }

    if (valorNum >= precioPedido && !esContraoferta) {
      setErrorMonto(
        `Tu oferta debe ser menor o igual al precio pedido (${formatearPrecio(precioPedido)}).`
      );
      return;
    }

    setErrorMonto('');
    onConfirmar &&
      onConfirmar({
        monto: valorNum,
        mensaje: mensaje.trim()
      });
  };

  const portada = obtenerPortadaAviso(aviso);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {esContraoferta
              ? 'Enviar contraoferta'
              : esPropuestaComprador
              ? 'Enviar nueva propuesta'
              : 'Enviar una oferta'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-item-preview">
          {!esContraoferta && (
            <div className="modal-preview-thumb striped-placeholder">
              <img
                src={portada}
                alt={aviso?.titulo || 'Aviso'}
                className="media-img-cover"
              />
            </div>
          )}
          <div>
            {esContraoferta && ofertaRecibida ? (
              <>
                <span className="label-upper">
                  Oferta recibida de {ofertaRecibida.compradorNombre || 'Lucía Ramírez'}
                </span>
                <div className="price-text">
                  {formatearPrecio(ofertaRecibida.monto || 80)}{' '}
                  <span className="text-aux">
                    sobre {formatearPrecio(precioPedido)} pedidos
                  </span>
                </div>
                {ofertaRecibida.mensaje && (
                  <div className="text-aux">«{ofertaRecibida.mensaje}»</div>
                )}
              </>
            ) : (
              <>
                <strong>
                  {aviso?.titulo || 'Cálculo de una variable — Stewart, 8.ª ed.'}
                </strong>
                <div className="text-aux">
                  Precio pedido{' '}
                  <strong>{formatearPrecio(precioPedido)}</strong> · mínimo
                  aceptado <strong>{formatearPrecio(montoMinimo)}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        <form onSubmit={validarYEnviar}>
          <div className="form-group">
            <label className="label-upper">
              {esContraoferta ? 'Tu contraoferta (S/) *' : 'Tu oferta (S/) *'}
            </label>
            <input
              type="number"
              step="0.50"
              className={`form-input ${errorMonto ? 'input-error' : ''}`}
              value={monto}
              onChange={(e) => {
                setMonto(e.target.value);
                if (errorMonto) setErrorMonto('');
              }}
            />
            {errorMonto ? (
              <span className="field-error">{errorMonto}</span>
            ) : (
              <span className="field-hint">
                {esContraoferta
                  ? `Punto medio entre su oferta (${formatearPrecio(
                      ofertaRecibida?.monto || 80
                    )}) y tu precio pedido (${formatearPrecio(precioPedido)}).`
                  : `El vendedor acepta ofertas desde ${formatearPrecio(
                      montoMinimo
                    )}.`}
              </span>
            )}
          </div>

          {!esContraoferta && (
            <div className="form-group">
              <span className="label-upper">Sugerencias rápidas</span>
              <div className="cue-chips">
                {sugerencias.map((sug, i) => {
                  const pct = [20, 15, 10][i];
                  return (
                    <button
                      key={sug}
                      type="button"
                      className={`chip chip-selectable ${
                        Number(monto) === sug ? 'active' : ''
                      }`}
                      onClick={() => {
                        setMonto(String(sug));
                        setErrorMonto('');
                      }}
                    >
                      S/ {sug} (−{pct} %)
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Barra visual de comparación de precios (Vista 4.5) */}
          {esContraoferta && (
            <div className="modal-scale-box">
              <div className="modal-scale-labels">
                <span>mín. {formatearPrecio(montoMinimo)}</span>
                <span>oferta {formatearPrecio(ofertaRecibida?.monto || 80)}</span>
                <span className="modal-scale-highlight">
                  tú {formatearPrecio(Number(monto || 84))}
                </span>
                <span>pedido {formatearPrecio(precioPedido)}</span>
              </div>
              <div className="modal-scale-track">
                <div className="modal-scale-fill" />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="label-upper">
              {esContraoferta
                ? 'Mensaje para el comprador (Opcional)'
                : 'Mensaje para el vendedor (Opcional)'}
            </label>
            <textarea
              rows={2}
              maxLength={200}
              className="form-textarea"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
            {!esContraoferta && (
              <span className="field-hint">
                Máximo 200 caracteres ({mensaje.length}/200). Solo puedes tener
                1 oferta activa por aviso.
              </span>
            )}
          </div>

          {esContraoferta && (
            <div className="modal-soft-callout">
              El comprador tendrá 7 días para aceptar tu contraoferta, enviar
              otra propuesta o rechazarla.
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-tertiary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {esContraoferta
                ? 'Enviar contraoferta'
                : esPropuestaComprador
                ? 'Enviar propuesta'
                : 'Enviar oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
