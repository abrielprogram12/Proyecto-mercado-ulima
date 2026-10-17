import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAviso } from '../../context/AvisoContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIAS, formatearPrecio, ROLES_USUARIO } from '../../data/contratoDatos';

export default function LandingPage() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navigate = useNavigate();
  const { avisos } = useAviso();
  const { rolActual } = useAuth();

  const avisosRecientes = avisos.slice(0, 4);

  const handleBuscar = (e) => {
    e.preventDefault();
    const limpio = terminoBusqueda.trim();
    navigate(limpio ? `/catalogo?q=${encodeURIComponent(limpio)}` : '/catalogo');
  };

  return (
    <div>
      {/* Hero Section — Vista 1.1 */}
      <section
        style={{
          backgroundColor: 'var(--color-primary-soft)',
          padding: '64px 48px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '48px',
            alignItems: 'center'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '44px',
                lineHeight: '1.15',
                fontWeight: 800,
                color: 'var(--color-text)',
                marginBottom: '18px'
              }}
            >
              Lo que a un compañero le sobra,
              <br />a ti te sirve este ciclo
            </h1>

            <p
              style={{
                fontSize: '16px',
                lineHeight: '24px',
                color: 'var(--color-text-secondary)',
                maxWidth: '520px',
                marginBottom: '28px'
              }}
            >
              Libros, calculadoras e instrumentos de segunda mano publicados por
              estudiantes de la Universidad de Lima. Oferta, acuerda y recoge dentro del
              campus.
            </p>

            <form
              onSubmit={handleBuscar}
              style={{
                display: 'flex',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-btn)',
                padding: '6px',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--color-border)',
                maxWidth: '540px',
                marginBottom: '32px'
              }}
            >
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                placeholder="¿Qué estás buscando? Ej. Stewart Cálculo"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)'
                }}
              />
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </form>

            <div style={{ display: 'flex', gap: '42px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ fontSize: '26px', fontWeight: 700, display: 'block' }}>
                  1,248
                </strong>
                <span className="text-aux">avisos activos</span>
              </div>
              <div>
                <strong style={{ fontSize: '26px', fontWeight: 700, display: 'block' }}>
                  S/ 62
                </strong>
                <span className="text-aux">precio mediano</span>
              </div>
              <div>
                <strong style={{ fontSize: '26px', fontWeight: 700, display: 'block' }}>
                  4.8
                </strong>
                <span className="text-aux">reputación media</span>
              </div>
            </div>
          </div>

          <div
            className="striped-placeholder"
            style={{
              height: '320px',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)'
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(253, 250, 247, 0.85)',
                padding: '6px 14px',
                borderRadius: '6px'
              }}
            >
              fotografía · estudiantes intercambiando libros
            </span>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Categorías destacadas */}
        <section style={{ marginBottom: '44px' }}>
          <span className="label-upper" style={{ marginBottom: '14px' }}>
            Categorías destacadas
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
              gap: '14px'
            }}
          >
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat}
                to={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                className="card-surface"
                style={{
                  padding: '20px 14px',
                  textAlign: 'center',
                  color: 'var(--color-text)',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-primary-soft)',
                    margin: '0 auto 10px'
                  }}
                />
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Avisos recientes */}
        <section style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <h2 className="title-section">Avisos recientes</h2>
            <Link to="/catalogo" style={{ fontWeight: 600, fontSize: '14px' }}>
              Ver todo el catálogo →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {avisosRecientes.map((aviso) => {
              const ruta =
                rolActual === ROLES_USUARIO.VISITANTE
                  ? `/aviso-publico/${aviso.id}`
                  : `/aviso/${aviso.id}`;
              return (
                <Link
                  key={aviso.id}
                  to={ruta}
                  className="card-surface"
                  style={{
                    display: 'flex',
                    overflow: 'hidden',
                    color: 'var(--color-text)',
                    textDecoration: 'none'
                  }}
                >
                  <div
                    className="striped-placeholder"
                    style={{ width: '110px', flexShrink: 0 }}
                  />
                  <div style={{ padding: '14px 16px', flex: 1 }}>
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        marginBottom: '6px',
                        color: 'var(--color-text)'
                      }}
                    >
                      {aviso.titulo}
                    </h4>
                    <div
                      className="price-text"
                      style={{ fontSize: '17px', marginBottom: '4px' }}
                    >
                      {formatearPrecio(aviso.precio)}
                    </div>
                    <span className="text-aux">
                      {aviso.condicion}
                      {aviso.curso ? ` · ${aviso.curso}` : ''}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Pasos de uso */}
        <section
          id="como-funciona"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            paddingTop: '12px'
          }}
        >
          {[
            {
              num: 1,
              titulo: 'Publica tu aviso',
              desc: 'Sube fotografías, indica el estado del producto y tu precio pedido.'
            },
            {
              num: 2,
              titulo: 'Recibe y negocia ofertas',
              desc: 'Acepta, rechaza o contraoferta desde el hilo de negociación.'
            },
            {
              num: 3,
              titulo: 'Coordinen la entrega',
              desc: 'Elijan punto y horario en el campus y confirmen la entrega.'
            }
          ].map((paso) => (
            <div key={paso.num} style={{ display: 'flex', gap: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {paso.num}
              </div>
              <div>
                <h3 className="subtitle" style={{ marginBottom: '4px' }}>
                  {paso.titulo}
                </h3>
                <p className="text-aux">{paso.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
