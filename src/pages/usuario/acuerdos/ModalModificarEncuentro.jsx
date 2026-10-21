import '../../../components/Modales/Modales.css';

export default function ModalModificarEncuentro({ abierto, onClose, onConfirmar }) {
  if (!abierto) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="modal-warn-icon">!</span>
            Modificar punto y horario
          </h3>
        </div>
        <p className="text-aux">
          Se anulará el código de entrega actual y ambos deberán acordar un nuevo punto y horario antes de
          poder confirmar la entrega.
        </p>
        <div className="modal-footer">
          <button type="button" className="btn btn-tertiary" onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn btn-destructive" onClick={onConfirmar}>
            Sí, modificar
          </button>
        </div>
      </div>
    </div>
  );
}
