import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAcuerdo } from '../../../context/AcuerdoContext';
import { formatearPrecio } from '../../../data/contratoDatos';
import AcuerdoNoDisponible from './AcuerdoNoDisponible';
import { datosContraparte, textoReputacion } from './acuerdosUtils';
import './acuerdos.css';

/**
 * MÓDULO: Acuerdos de entrega (Integrante 5 · HU-5)
 * Vista 5.1 — Acuerdo generado (ruta /acuerdo-generado/:id, a la que llega HU-4 al aceptar una oferta)
 */
export default function AcuerdoGeneradoPage() {
  const { id } = useParams();
  const { usuarioActual, obtenerUsuarioPorId } = useAuth();
  const { obtenerAcuerdoPorId, rolEnAcuerdo } = useAcuerdo();

  const acuerdo = obtenerAcuerdoPorId(id);
  const rol = rolEnAcuerdo(acuerdo, usuarioActual?.id);
  if (!acuerdo || !rol) return <AcuerdoNoDisponible />;

  const contraparte = datosContraparte(acuerdo, rol, obtenerUsuarioPorId);
  const otras = acuerdo.otrasOfertasRechazadas;

  return (
    <div className="page-container">
      <div className="acu-centrado">
        <section className="acu-exito card-surface" aria-labelledby="acu-titulo-generado">
          <div className="acu-check" aria-hidden="true">
            ✓
          </div>
          <h1 id="acu-titulo-generado" className="title-screen">
            ¡Trato cerrado!
          </h1>
          <p className="text-aux">
            {rol === 'vendedor'
              ? `Aceptaste la oferta de ${contraparte.nombre}.`
              : `${contraparte.nombre} aceptó tu oferta.`}{' '}
            Ahora propongan un punto y un horario de encuentro dentro del campus.
          </p>

          <div className="acu-resumen-aviso">
            <div className="acu-miniatura striped-placeholder" aria-hidden="true" />
            <div className="acu-resumen-texto">
              <h2 className="subtitle">{acuerdo.avisoTitulo}</h2>
              <p className="text-aux">{acuerdo.avisoSubtitulo}</p>
            </div>
            <div className="acu-resumen-monto">
              <strong className="price-text">{formatearPrecio(acuerdo.montoAcordado)}</strong>
              <span className="text-aux">
                monto acordado (precio pedido {formatearPrecio(acuerdo.precioPedido)})
              </span>
            </div>
          </div>

          <div className="acu-trio">
            <div className="acu-dato">
              <span className="label-upper">{contraparte.rolTexto}</span>
              <p className="acu-fuerte">{contraparte.nombre}</p>
              <p className="text-aux">
                {[contraparte.carrera, textoReputacion(contraparte.reputacion)].filter(Boolean).join(' · ')}
              </p>
              {contraparte.telefono && <p className="text-aux">{contraparte.telefono}</p>}
            </div>
            <div className="acu-dato">
              <span className="label-upper">Código del acuerdo</span>
              <p className="acu-codigo-acuerdo">{acuerdo.id}</p>
              <p className="text-aux">Generado el {acuerdo.fechaGeneracion}</p>
            </div>
            <div className="acu-dato">
              <span className="label-upper">Siguiente paso</span>
              <p className="acu-fuerte">Coordinar el encuentro</p>
              <p className="text-aux">Tienen 48 horas para acordarlo</p>
            </div>
          </div>

          <p className="text-aux">
            {typeof otras === 'number' && otras > 0
              ? otras === 1
                ? 'La otra oferta de este aviso se rechazó automáticamente '
                : `Las otras ${otras} ofertas de este aviso se rechazaron automáticamente `
              : 'Las demás ofertas de este aviso se rechazaron automáticamente '}
            y el aviso quedó reservado hasta la entrega.
          </p>

          <div className="acu-acciones">
            <Link to={`/acuerdos/${acuerdo.id}/coordinar`} className="btn btn-primary">
              Proponer punto y horario
            </Link>
            <Link to="/acuerdos" className="btn btn-secondary">
              Ver mis acuerdos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
