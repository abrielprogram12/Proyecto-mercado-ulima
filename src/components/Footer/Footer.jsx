import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES_USUARIO } from '../../data/contratoDatos';
import './Footer.css';

export default function Footer() {
  const { rolActual, usuarioActual } = useAuth();
  const [modalContactoAbierto, setModalContactoAbierto] = useState(false);
  const [modalNormasAbierto, setModalNormasAbierto] = useState(false);
  const [asunto, setAsunto] = useState('Consulta sobre mi cuenta o aviso');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const esAdmin = rolActual === ROLES_USUARIO.ADMIN;

  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setMensaje('');
      setModalContactoAbierto(false);
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
    <>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            {esAdmin
              ? 'Universidad de Lima · Panel de administración · Campus Monterrico'
              : 'Universidad de Lima · Intercambio estudiantil · Campus Monterrico'}
          </div>
          <div className="footer-links">
            <button
              type="button"
              className="footer-link footer-link-btn"
              onClick={() => setModalNormasAbierto(true)}
            >
              {esAdmin ? 'Normas del tablón' : 'Normas de convivencia'}
            </button>
            {esAdmin && (
              <Link to="/admin/reportes" className="footer-link">
                Bitácora de moderación
              </Link>
            )}
            <button
              type="button"
              className="footer-link footer-link-btn"
              onClick={() => {
                setEnviado(false);
                setModalContactoAbierto(true);
              }}
            >
              {esAdmin ? 'tablon@ulima.edu.pe' : 'Contacto: tablon@ulima.edu.pe'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Mesa de Ayuda (reemplaza mailto: para no abrir selector de apps de Windows) */}
      {modalContactoAbierto && (
        <div
          className="modal-backdrop"
          onClick={() => setModalContactoAbierto(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Mesa de ayuda · Tablón ULima</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalContactoAbierto(false)}
              >
                ✕
              </button>
            </div>

            <div className="footer-help-box">
              <div>
                <span className="label-upper">Correo oficial de soporte</span>
                <strong className="footer-help-email">tablon@ulima.edu.pe</strong>
                <span className="text-aux">
                  Atención de lunes a viernes · 08:00 a 18:00 (Campus Monterrico)
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopiarCorreo}
              >
                {copiado ? '✓ Copiado' : 'Copiar correo'}
              </button>
            </div>

            {enviado ? (
              <div className="notificacion-banner notif-exito">
                <span>
                  <strong>Mensaje enviado a la mesa de ayuda.</strong> Te
                  responderemos a tu correo institucional en menos de 24 horas.
                </span>
              </div>
            ) : (
              <form onSubmit={handleEnviarMensaje}>
                <div className="form-group">
                  <label className="label-upper">Remitente</label>
                  <input
                    type="text"
                    className="form-input"
                    disabled
                    value={
                      usuarioActual
                        ? `${usuarioActual.nombres} ${usuarioActual.apellidos} (${usuarioActual.correo})`
                        : 'Visitante · Comunidad ULima'
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="label-upper">Motivo de consulta</label>
                  <select
                    className="form-select"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                  >
                    <option value="Consulta sobre mi cuenta o aviso">
                      Consulta sobre mi cuenta o aviso
                    </option>
                    <option value="Solicitud de permisos o acceso">
                      Solicitud de permisos o acceso
                    </option>
                    <option value="Revisión de acuerdo o bloqueo">
                      Revisión de acuerdo o bloqueo
                    </option>
                    <option value="Otro motivo">Otro motivo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label-upper">Mensaje *</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Describe cómo podemos ayudarte..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-tertiary"
                    onClick={() => setModalContactoAbierto(false)}
                  >
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enviar a mesa de ayuda
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de Normas de Convivencia */}
      {modalNormasAbierto && (
        <div
          className="modal-backdrop"
          onClick={() => setModalNormasAbierto(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Normas de convivencia del tablón</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalNormasAbierto(false)}
              >
                ✕
              </button>
            </div>
            <div className="footer-normas-list">
              <p className="text-body">
                <strong>1. Exclusivo para la comunidad ULima:</strong> Todo
                intercambio se realiza entre estudiantes verificados con correo{' '}
                <code>@aloe.ulima.edu.pe</code>.
              </p>
              <p className="text-body">
                <strong>2. Entregas seguras en el campus:</strong> Los acuerdos
                se concretan únicamente en los 5 puntos autorizados (Biblioteca,
                Puerta 1, Cafetería pab. E, Patio pab. H y Explanada central).
              </p>
              <p className="text-body">
                <strong>3. Sin pagos anticipados fuera del campus:</strong> No
                adelantes dinero por transferencia o billeteras digitales antes
                de revisar el material en persona.
              </p>
              <p className="text-body">
                <strong>4. Respeto y veracidad:</strong> Describe el estado real
                de tus libros o materiales y cumple puntualmente con los
                horarios acordados.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setModalNormasAbierto(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
