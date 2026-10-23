import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAviso } from '../../context/AvisoContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIAS, formatearPrecio, ROLES_USUARIO } from '../../data/contratoDatos';
import { ILUSTRACION_HERO_CAMPUS, obtenerPortadaAviso } from '../../data/imagenesDatos';
import { PASOS_COMO_FUNCIONA } from './visitanteUtils';
import './visitante.css';

/**
 * MÓDULO: Visitante y Acceso (Integrante 1 · HU-1)
 * Vista 1.1 — Portada pública (Landing)
 */
export default function LandingPage() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navigate = useNavigate();
  const { avisos } = useAviso();
  const { rolActual } = useAuth();

  const avisosRecientes = avisos.filter((a) => a.estado === 'Publicado').slice(0, 4);

  const handleBuscar = (e) => {
    e.preventDefault();
    const limpio = terminoBusqueda.trim();
    navigate(limpio ? `/catalogo?q=${encodeURIComponent(limpio)}` : '/catalogo');
  };

  return (
    <div>
      {/* Hero Section — Vista 1.1 */}
      <section className="vis-hero">
        <div className="vis-hero-inner">
          <div>
            <h1 className="vis-hero-title">
              Lo que a un compañero le sobra,
              <br />a ti te sirve este ciclo
            </h1>

            <p className="vis-hero-lead">
              Libros, calculadoras e instrumentos de segunda mano publicados por
              estudiantes de la Universidad de Lima. Oferta, acuerda y recoge dentro del
              campus.
            </p>

            <form onSubmit={handleBuscar} className="vis-buscador">
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                placeholder="¿Qué estás buscando? Ej. Stewart Cálculo"
                className="vis-buscador-input"
              />
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </form>

            <div className="vis-kpis">
              <div>
                <strong className="vis-kpi-num">1,248</strong>
                <span className="text-aux">avisos activos</span>
              </div>
              <div>
                <strong className="vis-kpi-num">S/ 62</strong>
                <span className="text-aux">precio mediano</span>
              </div>
              <div>
                <strong className="vis-kpi-num">4.8</strong>
                <span className="text-aux">reputación media</span>
              </div>
            </div>
          </div>

          <div className="striped-placeholder vis-hero-foto">
            <img
              src={ILUSTRACION_HERO_CAMPUS}
              alt="Intercambio estudiantil en el campus ULima"
              className="media-img-cover"
            />
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Categorías destacadas */}
        <section className="vis-seccion">
          <span className="label-upper">Categorías destacadas</span>
          <div className="vis-categorias-grid">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat}
                to={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                className="card-surface vis-categoria-card"
              >
                <div className="vis-categoria-icono" />
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Avisos recientes */}
        <section className="vis-seccion">
          <div className="vis-seccion-encabezado">
            <h2 className="title-section">Avisos recientes</h2>
            <Link to="/catalogo" className="vis-link-catalogo">
              Ver todo el catálogo →
            </Link>
          </div>

          <div className="vis-recientes-grid">
            {avisosRecientes.map((aviso) => {
              const ruta =
                rolActual === ROLES_USUARIO.VISITANTE
                  ? `/aviso-publico/${aviso.id}`
                  : `/aviso/${aviso.id}`;
              return (
                <Link
                  key={aviso.id}
                  to={ruta}
                  className="card-surface vis-reciente-card"
                >
                  <div className="striped-placeholder vis-reciente-miniatura">
                    <img
                      src={obtenerPortadaAviso(aviso)}
                      alt={aviso.titulo}
                      className="media-img-cover"
                    />
                  </div>
                  <div className="vis-reciente-info">
                    <h4 className="vis-reciente-titulo">{aviso.titulo}</h4>
                    <div className="price-text vis-reciente-precio">
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
        <section id="como-funciona" className="vis-pasos-grid">
          {PASOS_COMO_FUNCIONA.map((paso) => (
            <div key={paso.num} className="vis-paso">
              <div className="vis-paso-num">{paso.num}</div>
              <div>
                <h3 className="subtitle vis-paso-titulo">{paso.titulo}</h3>
                <p className="text-aux">{paso.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
