import { useState, useEffect } from 'react';
import './Modales.css';

export default function ModalEstadoAviso({
  abierto,
  onClose,
  aviso,
  modo = 'estado',
  estadoInicial,
  onConfirmarEstado,
  onConfirmarEliminar
}) {
  const [nuevoEstado, setNuevoEstado] = useState(
    estadoInicial || aviso?.estado || 'Vendido'
  );
  const [textoConfirmacion, setTextoConfirmacion] = useState('');

  useEffect(() => {
    if (abierto) {
      setNuevoEstado(estadoInicial || aviso?.estado || 'Vendido');
      setTextoConfirmacion('');
    }
  }, [abierto, estadoInicial, aviso]);

  if (!abierto) return null;

  const ofertasActivas = Number(aviso?.ofertasCount || 0);

  if (modo === 'eliminar') {
    const puedeEliminar =
      textoConfirmacion.trim().toUpperCase() === 'ELIMINAR';
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">
              <span className="modal-warn-icon">!</span>
              Eliminar aviso
            </h3>
          </div>
          <p className="text-aux modal-desc-mb">
            Vas a eliminar «{aviso?.titulo}». Esta acción no se puede deshacer.
          </p>
          {ofertasActivas > 0 && (
            <div className="notificacion-banner notif-error">
              <span>
                <strong>El aviso tiene {ofertasActivas} ofertas activas.</strong>{' '}
                Se rechazarán automáticamente al eliminarlo.
              </span>
            </div>
          )}
          <div className="form-group">
            <label className="label-upper">
              Escribe ELIMINAR para confirmar
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="ELIMINAR"
              value={textoConfirmacion}
              onChange={(e) => setTextoConfirmacion(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-destructive"
              disabled={!puedeEliminar}
              onClick={() => onConfirmarEliminar && onConfirmarEliminar(aviso)}
            >
              Eliminar aviso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Cambiar el estado del aviso</h3>
        </div>
        <p className="text-aux modal-desc-mb">
          «{aviso?.titulo}» dejará de aparecer en el catálogo si lo marcas como
          vendido.
        </p>

        <div className="modal-radio-list">
          {[
            { valor: 'Pausado', etiqueta: 'Pausar temporalmente' },
            { valor: 'Publicado', etiqueta: 'Reactivar y volver a publicar' },
            { valor: 'Vendido', etiqueta: 'Marcar como vendido' }
          ].map((op) => (
            <label
              key={op.valor}
              className={`modal-radio-option ${
                nuevoEstado === op.valor ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name="estado-aviso"
                checked={nuevoEstado === op.valor}
                onChange={() => setNuevoEstado(op.valor)}
              />
              <span>{op.etiqueta}</span>
            </label>
          ))}
        </div>

        {ofertasActivas > 0 && (
          <div className="notificacion-banner notif-advertencia">
            <span>
              <strong>Atención.</strong> Las {ofertasActivas} ofertas activas de
              este aviso quedarán sin efecto y se avisará a los compradores.
            </span>
          </div>
        )}

        <div className="modal-footer">
          <button type="button" className="btn btn-tertiary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onConfirmarEstado && onConfirmarEstado(nuevoEstado)
            }
          >
            Confirmar cambio
          </button>
        </div>
      </div>
    </div>
  );
}
