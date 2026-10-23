import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReporte } from '../../../context/ReporteContext';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import { obtenerPortadaAviso } from '../../../data/imagenesDatos';
import BadgeEstado from '../../../components/BadgeEstado/BadgeEstado';
import Notificacion from '../../../components/Notificacion/Notificacion';
import ModalBloquearCuenta from '../../../components/Modales/ModalBloquearCuenta';
import '../admin.css';

export default function DetalleReportePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    reportes,
    obtenerReportePorId,
    obtenerReportesDeUsuario,
    resolverReporte,
    descartarReporte
  } = useReporte();
  const { usuarios, setUsuarios } = useAuth();
  const { avisos, setAvisos } = useAviso();

  const reporte = obtenerReportePorId(id) || reportes[0];

  const [notaBitacora, setNotaBitacora] = useState(
    reporte?.notaBitacora ||
      'Solicita adelanto por Yape antes de coordinar la entrega presencial en el campus.'
  );
  const [feedback, setFeedback] = useState(null);
  const [modalBloqueoAbierto, setModalBloqueoAbierto] = useState(false);

  useEffect(() => {
    if (reporte) {
      setNotaBitacora(
        reporte.notaBitacora ||
          'Solicita adelanto por Yape antes de coordinar la entrega presencial en el campus.'
      );
    }
  }, [reporte?.id]);

  if (!reporte) {
    return (
      <div className="page-container">
        <div className="card-surface adm-report-main-card">
          <h2 className="title-screen">Reporte no encontrado</h2>
          <p className="text-aux">
            No existe un reporte con el código solicitado.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/admin/reportes')}
          >
            Volver a la bandeja
          </button>
        </div>
      </div>
    );
  }

  const usuarioReportado =
    usuarios.find((u) => u.id === reporte.usuarioReportadoId) || {
      id: reporte.usuarioReportadoId,
      nombres: reporte.usuarioReportadoNombre,
      apellidos: '',
      correo: '20226677@aloe.ulima.edu.pe',
      carrera: 'Comunicación',
      reputacion: reporte.usuarioReportadoReputacion || 3.1,
      reportesAcumulados: reporte.usuarioReportadoReportes || 3,
      acuerdosCerrados: reporte.usuarioReportadoAcuerdos || 1,
      estadoCuenta: '3 reportes'
    };

  const avisoAsociado =
    reporte.tipo === 'Aviso'
      ? avisos.find((a) => a.id === reporte.elementoId)
      : null;

  const portadaUrl = obtenerPortadaAviso(
    avisoAsociado || {
      id: reporte.elementoId || 'av-117',
      titulo: reporte.elementoTitulo
    }
  );

  const otrosReportesUsuario = obtenerReportesDeUsuario(
    reporte.usuarioReportadoId
  ).filter((r) => r.id !== reporte.id);

  const totalReportesUsuario =
    usuarioReportado.reportesAcumulados || otrosReportesUsuario.length + 1;

  const yaCerrado =
    reporte.estado === 'Resuelto' || reporte.estado === 'Descartado';

  const handleRetirarAviso = () => {
    if (!notaBitacora.trim()) {
      setFeedback({
        tipo: 'error',
        titulo: 'Falta la nota.',
        mensaje: 'Explica la razón de la acción antes de continuar.'
      });
      return;
    }

    if (reporte.elementoId && setAvisos) {
      setAvisos((prev) =>
        prev.map((a) =>
          a.id === reporte.elementoId ? { ...a, estado: 'Retirado' } : a
        )
      );
    }

    const res = resolverReporte(reporte.id, {
      accion: 'retirar_aviso',
      notaBitacora
    });

    setFeedback({
      tipo: 'exito',
      titulo: 'Aviso retirado.',
      mensaje: res.mensaje
    });
  };

  const handleConfirmarBloqueo = ({ motivo, detalle }) => {
    const notaCombinada = `${motivo}: ${detalle}`;
    setNotaBitacora(notaCombinada);

    if (setUsuarios) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioReportado.id
            ? {
                ...u,
                estadoCuenta: 'Bloqueado',
                motivoBloqueo: motivo
              }
            : u
        )
      );
    }

    if (setAvisos) {
      setAvisos((prev) =>
        prev.map((a) =>
          a.vendedorId === usuarioReportado.id
            ? { ...a, estado: 'Retirado' }
            : a
        )
      );
    }

    const res = resolverReporte(reporte.id, {
      accion: 'bloquear_cuenta',
      notaBitacora: notaCombinada
    });

    setModalBloqueoAbierto(false);
    setFeedback({
      tipo: 'exito',
      titulo: 'Cuenta bloqueada.',
      mensaje: res.mensaje
    });
  };

  const handleDescartar = () => {
    if (!notaBitacora.trim()) {
      setFeedback({
        tipo: 'error',
        titulo: 'Falta la nota.',
        mensaje: 'Explica la razón de la acción antes de continuar.'
      });
      return;
    }

    const res = descartarReporte(reporte.id, notaBitacora);
    setFeedback({
      tipo: 'info',
      titulo: 'Reporte descartado.',
      mensaje: res.mensaje
    });
  };

  const nombreCortoReportado = (
    reporte.usuarioReportadoNombre || 'Kevin Bustamante'
  )
    .split(' ')
    .slice(0, 2)
    .join(' ');

  return (
    <div className="page-container">
      <nav className="breadcrumbs">
        <Link to="/admin/reportes">Bandeja de reportes</Link>
        <span>›</span>
        <span>{reporte.id}</span>
      </nav>

      <div className="adm-detail-layout">
        <div className="card-surface adm-report-main-card">
          <div className="adm-report-header-bar">
            <div className="adm-report-header-left">
              <h1 className="title-screen">Reporte {reporte.id}</h1>
              <BadgeEstado estado={reporte.estado} />
            </div>
            <span className="text-aux">
              Recibido el {reporte.fecha} · {reporte.hora}
            </span>
          </div>

          <div className="adm-reported-item-card">
            <span className="label-upper">
              ELEMENTO REPORTADO · {reporte.tipo.toUpperCase()}
            </span>

            <div className="adm-reported-item-row">
              <div className="adm-reported-item-left">
                <div className="striped-placeholder adm-reported-thumb">
                  {portadaUrl && (
                    <img
                      src={portadaUrl}
                      alt={reporte.elementoTitulo}
                      className="media-img-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="adm-reported-item-title">
                    {reporte.elementoTitulo}
                  </div>
                  <div className="text-aux">
                    {reporte.elementoCategoria || reporte.elementoSubtitulo}
                  </div>
                  <div className="adm-reported-price-row">
                    {reporte.elementoPrecio !== undefined && (
                      <span className="adm-reported-price">
                        {formatearPrecio(reporte.elementoPrecio)}
                      </span>
                    )}
                    <span className="text-aux">
                      Vendedor: <strong>{reporte.usuarioReportadoNombre}</strong> ·{' '}
                      {usuarioReportado.reputacion} ★ · {totalReportesUsuario}{' '}
                      reportes
                    </span>
                  </div>
                </div>
              </div>

              {reporte.tipo === 'Aviso' ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    navigate(`/aviso/${avisoAsociado?.id || 'av-117'}`)
                  }
                >
                  Ver aviso completo
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/admin/usuarios')}
                >
                  Ver en padrón
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="label-upper">MOTIVO DEL REPORTE</span>
            <div className="adm-motivo-badge-wrap">
              <BadgeEstado estado={reporte.motivo} variante="error" />
            </div>

            <div className="adm-evidence-quote">
              “{reporte.descripcion}”
            </div>

            <div className="text-aux">
              Reportado por:{' '}
              <strong>
                {reporte.reportanteNombreCompleto || reporte.reportanteNombre}
              </strong>{' '}
              · {reporte.reportanteCarrera || 'Ing. de Sistemas'} ·{' '}
              {reporte.reportanteReputacion || 4.6} ★ (comprador confiable)
            </div>
          </div>

          <div className="adm-section-block">
            <span className="label-upper">
              HISTORIAL DE ESTE ELEMENTO Y DEL VENDEDOR
            </span>

            <div className="adm-timeline-list">
              <div className="adm-timeline-item">
                <span className="adm-timeline-dot adm-timeline-dot--green" />
                <span>
                  02/09/2026 · 19:00 — {nombreCortoReportado} publicó el aviso.
                </span>
              </div>

              <div className="adm-timeline-item">
                <span className="adm-timeline-dot adm-timeline-dot--orange" />
                <span>
                  03/09/2026 · 21:14 — Recibió el reporte R-1038 por «Pide pagos
                  fuera del campus» (en revisión).
                </span>
              </div>

              {otrosReportesUsuario.slice(0, 1).map((otro) => (
                <div key={otro.id} className="adm-timeline-item">
                  <span className="adm-timeline-dot adm-timeline-dot--red" />
                  <span>
                    {otro.fecha} · {otro.hora} — Recibió el reporte {otro.id}{' '}
                    sobre su perfil ({otro.motivo.toLowerCase()}).
                  </span>
                </div>
              ))}

              <div className="adm-timeline-item">
                <span className="adm-timeline-dot adm-timeline-dot--red" />
                <span>
                  {reporte.fecha} · {reporte.hora} — Recibió este reporte{' '}
                  {reporte.id}.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="adm-right-col">
          <div className="card-surface adm-resolve-card">
            <h2 className="adm-resolve-title">Resolver reporte</h2>
            <p className="text-aux adm-resolve-subtitle">
              Toda acción queda registrada en la bitácora de moderación.
            </p>

            <div className="form-group">
              <label className="label-upper">NOTA PARA LA BITÁCORA</label>
              <textarea
                rows={4}
                className="form-textarea"
                value={notaBitacora}
                onChange={(e) => setNotaBitacora(e.target.value)}
              />
              <span className="field-hint">
                Obligatoria al retirar un aviso o bloquear una cuenta.
              </span>
            </div>

            <div className="adm-resolve-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                disabled={yaCerrado}
                onClick={handleRetirarAviso}
              >
                Retirar el aviso del catálogo
              </button>

              <button
                type="button"
                className="btn btn-destructive btn-block"
                disabled={
                  usuarioReportado.estadoCuenta === 'Bloqueado' ||
                  usuarioReportado.estadoCuenta === 'Bloqueada'
                }
                onClick={() => setModalBloqueoAbierto(true)}
              >
                {usuarioReportado.estadoCuenta === 'Bloqueado' ||
                usuarioReportado.estadoCuenta === 'Bloqueada'
                  ? 'Cuenta ya bloqueada'
                  : `Bloquear la cuenta de ${nombreCortoReportado}`}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-block"
                disabled={yaCerrado}
                onClick={handleDescartar}
              >
                Descartar el reporte
              </button>
            </div>

            {yaCerrado && (
              <div className="adm-closed-summary">
                <strong>Reporte cerrado ({reporte.estado}):</strong>
                <p className="text-aux">
                  {reporte.notaBitacora ||
                    'Resuelto por el administrador del tablón.'}
                </p>
              </div>
            )}
          </div>

          {feedback && (
            <div className="card-surface adm-resolve-card">
              <span className="label-upper">NOTIFICACIÓN DE MODERACIÓN</span>
              <Notificacion
                tipo={feedback.tipo}
                titulo={feedback.titulo}
                mensaje={feedback.mensaje}
                onClose={() => setFeedback(null)}
              />
            </div>
          )}
        </div>
      </div>

      <ModalBloquearCuenta
        abierto={modalBloqueoAbierto}
        onClose={() => setModalBloqueoAbierto(false)}
        usuario={usuarioReportado}
        onConfirmar={handleConfirmarBloqueo}
      />
    </div>
  );
}
