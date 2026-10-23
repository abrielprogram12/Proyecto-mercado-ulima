import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './comun.css';

/**
 * MÓDULO: Cuenta y Acceso (Integrante 1 · HU-1)
 * Vista 1.6 — Acceso denegado por rol
 */
export default function AccesoDenegadoPage() {
  const { usuarioActual } = useAuth();
  const [modalAyudaAbierto, setModalAyudaAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setMensaje('');
      setModalAyudaAbierto(false);
    }, 1800);
  };

  const handleCopiarCorreo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('tablon@ulima.edu.pe');
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="page-container com-centrado">
      <div className="com-circulo-alerta">
        <div className="com-candado" />
      </div>

      <span className="label-upper">Acceso restringido</span>
      <h1 className="title-screen com-titulo-denegado">
        No tienes permisos para ver esta sección
      </h1>

      <p className="text-aux com-descripcion-ancha">
        Esta vista corresponde al panel de administración del tablón. Si crees que
        es un error o necesitas gestionar un reporte, comunícate con la mesa de
        ayuda.
      </p>

      <div className="com-acciones">
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setEnviado(false);
            setModalAyudaAbierto(true);
          }}
        >
          Escribir a la mesa de ayuda
        </button>
      </div>

      {modalAyudaAbierto && (
        <div
          className="modal-backdrop com-modal-left"
          onClick={() => setModalAyudaAbierto(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Escribir a la mesa de ayuda</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalAyudaAbierto(false)}
              >
                ✕
              </button>
            </div>

            <div className="com-help-banner">
              <div>
                <span className="label-upper">Canal oficial de soporte</span>
                <strong className="com-help-email">tablon@ulima.edu.pe</strong>
                <span className="text-aux">
                  Mesa de ayuda del Tablón Estudiantil · Universidad de Lima
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopiarCorreo}
              >
                {copiado ? '✓ Correo copiado' : 'Copiar correo'}
              </button>
            </div>

            {enviado ? (
              <div className="notificacion-banner notif-exito">
                <span>
                  <strong>Solicitud enviada a tablon@ulima.edu.pe.</strong> Un
                  administrador revisará tu caso y te responderá al correo
                  institucional.
                </span>
              </div>
            ) : (
              <form onSubmit={handleEnviar}>
                <div className="form-group">
                  <label className="label-upper">Cuenta actual</label>
                  <input
                    type="text"
                    className="form-input"
                    disabled
                    value={
                      usuarioActual
                        ? `${usuarioActual.nombres} ${usuarioActual.apellidos} (${usuarioActual.correo})`
                        : 'Sin sesión activa'
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="label-upper">
                    Describe tu solicitud o consulta *
                  </label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Indica qué sección intentabas abrir o el código de reporte que necesitas consultar..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-tertiary"
                    onClick={() => setModalAyudaAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enviar mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
