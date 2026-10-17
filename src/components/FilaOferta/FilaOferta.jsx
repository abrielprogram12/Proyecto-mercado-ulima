import { formatearPrecio, obtenerIniciales } from '../../data/contratoDatos';
import BadgeEstado from '../BadgeEstado/BadgeEstado';
import './FilaOferta.css';

export default function FilaOferta({
  oferta,
  onAceptar,
  onContraofertar,
  onRechazar,
  onVerHilo,
  onRetirar,
  onIrAcuerdo
}) {
  if (!oferta) return null;

  const nombresPartes = (oferta.compradorNombre || 'Estudiante ULima').split(' ');
  const iniciales = obtenerIniciales(nombresPartes[0], nombresPartes[1] || '');

  return (
    <div className={`fila-oferta ${oferta.esMejorOferta ? 'mejor-oferta' : ''}`}>
      <div className="fila-oferta-left">
        <div className="fila-oferta-avatar">{iniciales}</div>
        <div className="fila-oferta-info">
          <div className="fila-oferta-header">
            <strong className="fila-oferta-nombre">{oferta.compradorNombre}</strong>
            {oferta.compradorCarrera && (
              <span className="fila-oferta-meta">· {oferta.compradorCarrera}</span>
            )}
            {oferta.compradorReputacion && (
              <span className="fila-oferta-rep">· {oferta.compradorReputacion} ★</span>
            )}
          </div>
          <div className="fila-oferta-sub">
            <span>{oferta.fecha}</span>
            {oferta.mensaje && <span> · {oferta.mensaje}</span>}
          </div>
        </div>
      </div>

      <div className="fila-oferta-right">
        <div className="fila-oferta-monto-box">
          <span className="fila-oferta-monto price-text">
            {formatearPrecio(oferta.monto)}
          </span>
          {oferta.esMejorOferta && (
            <span className="fila-oferta-mejor-tag">Mejor oferta</span>
          )}
        </div>

        <BadgeEstado estado={oferta.estado} />

        <div className="fila-oferta-acciones">
          {oferta.estado === 'Enviada' && onAceptar && (
            <button type="button" className="btn btn-success btn-sm" onClick={() => onAceptar(oferta)}>
              Aceptar
            </button>
          )}
          {oferta.estado === 'Enviada' && onContraofertar && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onContraofertar(oferta)}>
              Contraofertar
            </button>
          )}
          {(oferta.estado === 'Enviada' || oferta.estado === 'Contraofertada') && onRechazar && (
            <button type="button" className="btn btn-outline btn-sm btn-rechazar-inline" onClick={() => onRechazar(oferta)}>
              Rechazar
            </button>
          )}
          {onVerHilo && oferta.estado !== 'Enviada' && oferta.estado !== 'Aceptada' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onVerHilo(oferta)}>
              Ver hilo
            </button>
          )}
          {onRetirar && oferta.estado === 'Enviada' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onRetirar(oferta)}>
              Retirar
            </button>
          )}
          {oferta.estado === 'Aceptada' && onIrAcuerdo && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onIrAcuerdo(oferta)}>
              Ir al acuerdo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
