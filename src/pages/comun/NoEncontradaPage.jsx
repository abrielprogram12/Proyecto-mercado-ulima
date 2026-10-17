import { Link, useNavigate } from 'react-router-dom';

export default function NoEncontradaPage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 'calc(100vh - 220px)'
      }}
    >
      <div
        style={{
          fontSize: '96px',
          lineHeight: '1',
          fontWeight: 800,
          color: 'var(--color-primary)',
          marginBottom: '12px'
        }}
      >
        404
      </div>

      <h1 className="title-screen" style={{ fontSize: '28px', marginBottom: '10px' }}>
        Este aviso ya no está en el tablón
      </h1>

      <p
        className="text-aux"
        style={{
          maxWidth: '480px',
          fontSize: '15px',
          lineHeight: '22px',
          marginBottom: '26px'
        }}
      >
        Puede que el vendedor lo haya retirado o que el enlace esté mal escrito.
        Busca algo parecido en el catálogo.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <Link to="/catalogo" className="btn btn-primary">
          Ir al catálogo
        </Link>
        <button
          type="button"
          className="btn btn-tertiary"
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
}
