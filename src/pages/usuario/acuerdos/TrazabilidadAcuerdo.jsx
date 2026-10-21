import './acuerdos.css';

export default function TrazabilidadAcuerdo({ eventos = [] }) {
  if (eventos.length === 0) {
    return <p className="text-aux">Todavía no hay movimientos registrados.</p>;
  }
  return (
    <ol className="acu-traza">
      {eventos.map((evento) => (
        <li key={evento.id} className={`acu-traza-item acu-traza-${evento.color || 'gray'}`}>
          <strong>{evento.titulo}</strong>
          <span className="text-aux">{evento.detalle}</span>
        </li>
      ))}
    </ol>
  );
}
