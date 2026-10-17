import './Notificacion.css';

export default function Notificacion({
  tipo = 'exito',
  titulo,
  mensaje,
  onClose,
  className = ''
}) {
  if (!mensaje && !titulo) return null;

  const mapaTipo = {
    exito: 'notif-exito',
    success: 'notif-exito',
    error: 'notif-error',
    advertencia: 'notif-advertencia',
    warning: 'notif-advertencia',
    info: 'notif-info'
  };

  const claseTipo = mapaTipo[tipo] || 'notif-exito';

  return (
    <div className={`notificacion-banner ${claseTipo} ${className}`} role="status">
      <div className="notificacion-contenido">
        {titulo && <strong className="notificacion-titulo">{titulo} </strong>}
        <span>{mensaje}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="notificacion-cerrar"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      )}
    </div>
  );
}
