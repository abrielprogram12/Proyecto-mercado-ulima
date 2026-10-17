import './BadgeEstado.css';

const MAPA_CLASES = {
  // Estados de aviso
  Borrador: 'badge-neutral',
  Publicado: 'badge-info',
  Pausado: 'badge-warning',
  Vendido: 'badge-success-solid',

  // Estados de oferta
  Enviada: 'badge-info',
  'Oferta enviada': 'badge-info',
  Contraofertada: 'badge-warning',
  Aceptada: 'badge-success',
  Rechazada: 'badge-error',
  Vencida: 'badge-neutral',

  // Estados de acuerdo
  'Esperando respuesta': 'badge-info',
  'Propuesta recibida': 'badge-warning',
  Acordado: 'badge-success',
  Entregado: 'badge-success',
  Cancelado: 'badge-error',

  // Condiciones de producto
  'Como nuevo': 'badge-terracota',
  'Muy buen estado': 'badge-terracota',
  'Buen estado': 'badge-terracota',
  'Con marcas de uso': 'badge-terracota',

  // Reportes y cuentas
  Nuevo: 'badge-info',
  'En revisión': 'badge-warning',
  Resuelto: 'badge-success',
  Descartado: 'badge-neutral',
  Activa: 'badge-success',
  Activo: 'badge-success',
  Bloqueado: 'badge-error',
  Bloqueada: 'badge-error',
  'Vendedor confiable': 'badge-success',
  'Vendedora confiable': 'badge-success',
  'Reportante confiable': 'badge-success'
};

export default function BadgeEstado({ estado, variante, className = '' }) {
  if (!estado) return null;

  let claseVariante = variante ? `badge-${variante}` : MAPA_CLASES[estado];
  if (!claseVariante) {
    if (String(estado).toLowerCase().includes('reporte')) {
      claseVariante = 'badge-warning';
    } else if (String(estado).toLowerCase().includes('vendido')) {
      claseVariante = 'badge-success';
    } else {
      claseVariante = 'badge-neutral';
    }
  }

  return (
    <span className={`badge-estado ${claseVariante} ${className}`}>
      {estado}
    </span>
  );
}
