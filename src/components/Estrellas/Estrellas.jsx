import './Estrellas.css';

const ETIQUETAS_PUNTAJE = {
  1: '1 de 5 — Muy mala experiencia',
  2: '2 de 5 — Por debajo de lo esperado',
  3: '3 de 5 — Aceptable',
  4: '4 de 5 — Muy buena',
  5: '5 de 5 — Excelente'
};

export default function Estrellas({
  valor = 0,
  interactivo = false,
  onChange,
  mostrarEtiqueta = false,
  tamano = 'md'
}) {
  const redondeado = Math.round(Number(valor) || 0);

  return (
    <div className={`estrellas-wrapper estrellas-${tamano}`}>
      <div className="estrellas-iconos" role={interactivo ? 'radiogroup' : undefined}>
        {[1, 2, 3, 4, 5].map((estrella) => {
          const activa = estrella <= redondeado;
          return interactivo ? (
            <button
              key={estrella}
              type="button"
              className={`estrella-btn ${activa ? 'activa' : ''}`}
              onClick={() => onChange && onChange(estrella)}
              aria-label={`${estrella} estrellas`}
            >
              ★
            </button>
          ) : (
            <span
              key={estrella}
              className={`estrella-span ${activa ? 'activa' : ''}`}
            >
              ★
            </span>
          );
        })}
      </div>
      {mostrarEtiqueta && (
        <span className="estrellas-etiqueta">
          {ETIQUETAS_PUNTAJE[redondeado] || 'Sin puntaje (obligatorio)'}
        </span>
      )}
    </div>
  );
}
