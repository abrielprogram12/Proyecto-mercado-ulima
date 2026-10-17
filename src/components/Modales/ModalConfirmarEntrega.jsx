import { formatearPrecio } from '../../data/contratoDatos';
import './Modales.css';

export default function ModalConfirmarEntrega({
  abierto,
  onClose,
  acuerdo,
  onConfirmar
}) {
  if (!abierto) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">¿Confirmas que la entrega se realizó?</h3>
        </div>
        <p className="text-aux" style={{ marginBottom: '20px' }}>
          Acuerdo {acuerdo?.id || 'A-2201'} · {acuerdo?.puntoEncuentro || 'Patio del pabellón H'} ·{' '}
          {acuerdo?.fechaEncuentro || '01/09/2026'} · {formatearPrecio(acuerdo?.montoAcordado || 34)}.
          Al confirmar, el aviso pasa a vendido.
        </p>
        <div className="modal-footer">
          <button type="button" className="btn btn-tertiary" onClick={onClose}>
            Todavía no
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => onConfirmar && onConfirmar(acuerdo)}
          >
            Sí, se entregó
          </button>
        </div>
      </div>
    </div>
  );
}
