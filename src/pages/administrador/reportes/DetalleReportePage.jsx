import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReporte } from '../../../context/ReporteContext';
import { useAuth } from '../../../context/AuthContext';
import { useAviso } from '../../../context/AvisoContext';
import { formatearPrecio, obtenerIniciales } from '../../../data/contratoDatos';
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
    guardarNotaBitacora,
    resolverReporte,
    descartarReporte
  } = useReporte();
  const { usuarios, setUsuarios } = useAuth();
  const { avisos, setAvisos } = useAviso();

  const reporte = obtenerReportePorId(id) || reportes[0];

  const [notaBitacora, setNotaBitacora] = useState(reporte?.notaBitacora || '');
  const [feedback, setFeedback] = useState(null);
  const [modalBloqueoAbierto, setModalBloqueoAbierto] = useState(false);

  useEffect(() => {
    if (reporte) {
      setNotaBitacora(reporte.notaBitacora || '');
    }
  }, [reporte?.id]);

  if (!reporte) {
    return (
      <div className="container">
        <div className="card">
          <h2>Reporte no encontrado</h2>
          <p className="text-aux mt-8">No existe un reporte con el código solicitado.</p>
          <button
            type="button"
            className="btn btn-primary mt-16"
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

  const otrosReportesUsuario = obtenerReportesDeUsuario(
    reporte.usuarioReportadoId
  ).filter((r) => r.id !== reporte.id);

  const totalReportesUsuario =
    otrosReportesUsuario.length + 1 ||
    usuarioReportado.reportesAcumulados ||
    1;

  const yaCerrado =
    reporte.estado === 'Resuelto' || reporte.estado === 'Descartado';

  const handleGuardarNota = () => {
    if (!notaBitacora.trim()) {
      setFeedback({
        tipo: 'advertencia',
        titulo: 'Nota vacía.',
        mensaje: 'Escribe una observación en la bitácora antes de guardar.'
      });
      return;
    }
    const res = guardarNotaBitacora(reporte.id, notaBitacora);
    setFeedback({
      tipo: 'exito',
      titulo: 'Bitácora actualizada.',
      mensaje: res.mensaje
    });
  };

  const handleRetirarAviso = () => {
    const nota =
      notaBitacora.trim() ||
      'Aviso retirado por moderación tras confirmar infracción a las normas del tablón.';
    setNotaBitacora(nota);

    if (reporte.elementoId && setAvisos) {
      setAvisos((prev) =>
        prev.map((a) =>
          a.id === reporte.elementoId ? { ...a, estado: 'Retirado' } : a
        )
      );
    }

    const res = resolverReporte(reporte.id, {
      accion: 'retirar_aviso',
      notaBitacora: nota
    });

    setFeedback({
      tipo: 'exito',
      titulo: 'Aviso retirado y reporte resuelto.',
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
        titulo: 'Falta justificación en la bitácora.',
        mensaje:
          'Indica brevemente en la bitácora por qué se descarta este reporte antes de continuar.'
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

  return (
    <div className="container">
      {/* Migas de pan */}
      <nav className="breadcrumbs">
        <Link to="/admin/reportes">Bandeja de reportes</Link>
        <span className="breadcrumbs-sep">/</span>
        <span>Reporte {reporte.id}</span>
      </nav>

      {feedback && (
        <Notificacion
          tipo={feedback.tipo}
          titulo={feedback.titulo}
          mensaje={feedback.mensaje}
        />
      )}

      {/* Cabecera del reporte */}
      <div className="card adm-report-hero">
        <div>
          <div className="flex-row gap-12">
            <span className="text-mono adm-code-md">{reporte.id}</span>
            <BadgeEstado estado={reporte.estado} />
            <span className="adm-type-pill">Tipo: {reporte.tipo}</span>
          </div>
          <h1 className="adm-report-title">{reporte.elementoTitulo}</h1>
          <p className="text-aux mt-4">
            Recibido el {reporte.fecha} a las {reporte.hora} h · Motivo principal:{' '}
            <strong>{reporte.motivo}</strong>
          </p>
        </div>

        <div className="flex-row gap-8">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/admin/reportes')}
          >
            ← Volver a la bandeja
          </button>
        </div>
      </div>

      {/* Rejilla de 2 columnas: Evidencia e historial vs. Panel de resolución */}
      <div className="grid-12 adm-detail-grid">
        {/* Columna izquierda (7 cols) */}
        <div className="flex-col gap-16 adm-col-left-7">
          {/* Tarjeta 1: Elemento reportado */}
          <div className="card">
            <span className="label-upper">ELEMENTO REPORTADO</span>
            <div className="adm-reported-box">
              <div>
                <div className="adm-reported-item-title">
                  {reporte.elementoTitulo}
                </div>
                <div className="text-aux mt-4">
                  {reporte.elementoCategoria || reporte.elementoSubtitulo}
                </div>
                {reporte.elementoPrecio !== undefined && (
                  <div className="precio-tag adm-reported-price">
                    {formatearPrecio(reporte.elementoPrecio)}
                  </div>
                )}
                {avisoAsociado && (
                  <div className="mt-8">
                    <BadgeEstado estado={avisoAsociado.estado} />
                  </div>
                )}
              </div>

              <div className="flex-row gap-8">
                {avisoAsociado && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/aviso/${avisoAsociado.id}`)}
                  >
                    Ver aviso
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-tertiary btn-sm"
                  onClick={() => navigate('/admin/usuarios')}
                >
                  Ver cuenta en padrón
                </button>
              </div>
            </div>

            {/* Resumen del usuario reportado */}
            <div className="adm-reported-user-row">
              <div className="flex-row gap-12">
                <div className="avatar-circle">
                  {obtenerIniciales(
                    usuarioReportado.nombres,
                    usuarioReportado.apellidos
                  )}
                </div>
                <div>
                  <div className="adm-user-name-bold">
                    {usuarioReportado.nombres} {usuarioReportado.apellidos}
                  </div>
                  <div className="text-aux">
                    {usuarioReportado.carrera || 'Estudiante ULima'} ·{' '}
                    {usuarioReportado.reputacion} ★ ·{' '}
                    <strong>{totalReportesUsuario} reportes acumulados</strong> ·{' '}
                    {usuarioReportado.acuerdosCerrados ?? 1} acuerdos cerrados
                  </div>
                </div>
              </div>
              <BadgeEstado
                estado={
                  usuarioReportado.estadoCuenta === 'Bloqueado' ||
                  usuarioReportado.estadoCuenta === 'Bloqueada'
                    ? 'Bloqueado'
                    : `${totalReportesUsuario} reportes`
                }
              />
            </div>
          </div>

          {/* Tarjeta 2: Evidencia y datos del reportante */}
          <div className="card">
            <span className="label-upper">EVIDENCIA ENVIADA POR EL REPORTANTE</span>
            <div className="mt-12">
              <div className="text-aux">Motivo declarado:</div>
              <div className="adm-motivo-declared">{reporte.motivo}</div>
            </div>

            <div className="adm-evidence-quote">
              “{reporte.descripcion}”
            </div>

            <div className="adm-reporter-footer">
              <div>
                <span className="text-aux">Reportado por: </span>
                <strong>{reporte.reportanteNombre}</strong>
                {reporte.reportanteCarrera && (
                  <span className="text-aux">
                    {' '}
                    · {reporte.reportanteCarrera} ·{' '}
                    {reporte.reportanteReputacion || 4.6} ★
                  </span>
                )}
              </div>

              <span className="adm-trusted-reporter-badge">
                ✓ Reportante confiable
              </span>
            </div>
          </div>

          {/* Tarjeta 3: Historial y antecedentes */}
          <div className="card">
            <span className="label-upper">HISTORIAL Y OTROS REPORTES VINCULADOS</span>

            {totalReportesUsuario >= 2 && (
              <div className="notificacion-banner notif-advertencia mt-12 mb-16">
                <span>!</span>
                <div>
                  <strong>Reincidencia detectada:</strong>{' '}
                  {reporte.usuarioReportadoNombre} acumula{' '}
                  <strong>{totalReportesUsuario} reportes</strong> independientes en los
                  últimos 30 días. Se recomienda evaluar el bloqueo preventivo de la
                  cuenta.
                </div>
              </div>
            )}

            <div className="flex-col gap-12 mt-12">
              <div className="adm-history-entry">
                <strong>02/09/2026 · 14:20 h</strong> — Publicación del elemento (
                <span className="text-mono">{reporte.elementoId}</span>) por{' '}
                {reporte.usuarioReportadoNombre}.
              </div>

              {otrosReportesUsuario.map((otro) => (
                <div key={otro.id} className="adm-history-linked-row">
                  <div>
                    <span className="text-mono adm-code-bold">{otro.id}</span> ·{' '}
                    <strong>{otro.motivo}</strong>
                    <div className="text-aux">
                      Reportado por {otro.reportanteNombre} el {otro.fecha} ({otro.hora} h)
                    </div>
                  </div>
                  <div className="flex-row gap-8">
                    <BadgeEstado estado={otro.estado} />
                    <button
                      type="button"
                      className="btn btn-tertiary btn-sm"
                      onClick={() => navigate(`/admin/reportes/${otro.id}`)}
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              ))}

              <div className="adm-history-current-row">
                <strong>
                  {reporte.fecha} · {reporte.hora} h
                </strong>{' '}
                — Recepción de este reporte (<span className="text-mono">{reporte.id}</span>
                ). Estado actual: <strong>{reporte.estado}</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha (5 cols): Bitácora y acciones de resolución */}
        <div className="card adm-col-right-5">
          <span className="label-upper">DECISIÓN DE MODERACIÓN · BITÁCORA</span>
          <h3 className="mt-4">Resolver reporte {reporte.id}</h3>
          <p className="text-aux mt-4 mb-16">
            Toda acción queda registrada en la bitácora interna de moderación junto con la
            nota del administrador.
          </p>

          <div className="form-group">
            <label className="form-label">Nota interna para la bitácora *</label>
            <textarea
              rows={4}
              className="form-textarea"
              placeholder="Ej. Se verificó que el vendedor solicita adelantos por Yape fuera del campus. Se procede a retirar el aviso y bloquear preventivamente la cuenta."
              value={notaBitacora}
              onChange={(e) => setNotaBitacora(e.target.value)}
            />
            <div className="flex-between mt-8">
              <span className="form-help">
                Obligatoria para descartar o documentar sanciones.
              </span>
              <button
                type="button"
                className="btn btn-tertiary btn-sm"
                onClick={handleGuardarNota}
              >
                Guardar nota
              </button>
            </div>
          </div>

          <hr className="divider" />

          <span className="label-upper">ACCIONES DISPONIBLES</span>
          <div className="flex-col gap-12 mt-12">
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={yaCerrado}
              onClick={handleRetirarAviso}
            >
              Retirar aviso reportado
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
                : 'Bloquear cuenta del usuario'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-block"
              disabled={yaCerrado}
              onClick={handleDescartar}
            >
              Descartar reporte por improcedente
            </button>
          </div>

          {yaCerrado && (
            <div className="adm-closed-summary">
              <strong>Reporte cerrado ({reporte.estado}):</strong>
              <p className="text-aux mt-4">
                {reporte.notaBitacora || 'Resuelto por el administrador del tablón.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de bloqueo de cuenta */}
      <ModalBloquearCuenta
        abierto={modalBloqueoAbierto}
        onClose={() => setModalBloqueoAbierto(false)}
        usuario={usuarioReportado}
        onConfirmar={handleConfirmarBloqueo}
      />
    </div>
  );
}
