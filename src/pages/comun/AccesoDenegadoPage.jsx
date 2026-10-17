import { Link } from 'react-router-dom';

export default function AccesoDenegadoPage() {
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
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-warning-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            width: '28px',
            height: '24px',
            border: '3px solid var(--color-warning)',
            borderRadius: '4px'
          }}
        />
      </div>

      <h1 className="title-screen" style={{ fontSize: '32px', marginBottom: '12px' }}>
        Acceso denegado
      </h1>

      <p
        className="text-aux"
        style={{
          maxWidth: '540px',
          fontSize: '15px',
          lineHeight: '23px',
          marginBottom: '28px'
        }}
      >
        Tu cuenta de usuario no tiene permisos sobre la bandeja de reportes, que es
        exclusiva del administrador del tablón. Si crees que se trata de un error,
        escribe a tablon@ulima.edu.pe.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
        <a href="mailto:tablon@ulima.edu.pe" className="btn btn-secondary">
          Escribir a la mesa de ayuda
        </a>
      </div>
    </div>
  );
}
