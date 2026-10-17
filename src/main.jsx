import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import './index.css';
import App from './App.jsx';

// Context Providers (Estado global modular por entidad)
import { AuthProvider, useAuth } from './context/AuthContext';
import { AvisoProvider } from './context/AvisoContext';
import { OfertaProvider } from './context/OfertaContext';
import { AcuerdoProvider } from './context/AcuerdoContext';
import { CalificacionProvider } from './context/CalificacionContext';
import { ReporteProvider } from './context/ReporteContext';
import { ROLES_USUARIO } from './data/contratoDatos';

// Páginas — Integrante 1 (Cuenta y acceso: Visitante, Cuenta y Común)
import LandingPage from './pages/visitante/LandingPage';
import LoginPage from './pages/visitante/LoginPage';
import RegistroPage from './pages/visitante/RegistroPage';
import RecuperarPasswordPage from './pages/visitante/RecuperarPasswordPage';
import DetalleAvisoVisitantePage from './pages/visitante/DetalleAvisoVisitantePage';
import MiCuentaPage from './pages/usuario/cuenta/MiCuentaPage';
import AccesoDenegadoPage from './pages/comun/AccesoDenegadoPage';
import NoEncontradaPage from './pages/comun/NoEncontradaPage';

// Páginas — Integrante 2 (Publicaciones)
import MisPublicacionesPage from './pages/usuario/publicaciones/MisPublicacionesPage';
import NuevoAvisoPage from './pages/usuario/publicaciones/NuevoAvisoPage';
import CargaFotografiasPage from './pages/usuario/publicaciones/CargaFotografiasPage';

// Páginas — Integrante 3 (Catálogo y búsqueda)
import CatalogoPage from './pages/usuario/catalogo/CatalogoPage';
import DetalleAvisoUsuarioPage from './pages/usuario/catalogo/DetalleAvisoUsuarioPage';
import FavoritosPage from './pages/usuario/catalogo/FavoritosPage';
import PerfilVendedorPage from './pages/usuario/catalogo/PerfilVendedorPage';

// Páginas — Integrante 4 (Ofertas)
import OfertasRecibidasPage from './pages/usuario/ofertas/OfertasRecibidasPage';
import OfertasEnviadasPage from './pages/usuario/ofertas/OfertasEnviadasPage';
import HiloNegociacionPage from './pages/usuario/ofertas/HiloNegociacionPage';

// Páginas — Integrante 5 (Acuerdos de entrega)
import AcuerdoGeneradoPage from './pages/usuario/acuerdos/AcuerdoGeneradoPage';
import CoordinarEntregaPage from './pages/usuario/acuerdos/CoordinarEntregaPage';
import MisAcuerdosPage from './pages/usuario/acuerdos/MisAcuerdosPage';
import DetalleAcuerdoPage from './pages/usuario/acuerdos/DetalleAcuerdoPage';

// Páginas — Integrante 6 (Reputación)
import CalificarContrapartePage from './pages/usuario/reputacion/CalificarContrapartePage';
import PerfilReputacionPage from './pages/usuario/reputacion/PerfilReputacionPage';
import MisCalificacionesPage from './pages/usuario/reputacion/MisCalificacionesPage';

// Páginas — Integrante 7 (Moderación y métricas)
import BandejaReportesPage from './pages/administrador/reportes/BandejaReportesPage';
import DetalleReportePage from './pages/administrador/reportes/DetalleReportePage';
import GestionUsuariosPage from './pages/administrador/usuarios/GestionUsuariosPage';
import TableroMetricasPage from './pages/administrador/metricas/TableroMetricasPage';

/**
 * Guarda de ruta para usuarios autenticados (HU-1)
 */
function RutaUsuario({ children }) {
  const { estaAutenticado } = useAuth();
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * Guarda de ruta exclusiva para Administrador (HU-1 · Vista 1.6)
 * Si el usuario está autenticado pero no es 'admin', muestra <AccesoDenegadoPage />
 */
function RutaAdmin({ children }) {
  const { estaAutenticado, rolActual } = useAuth();
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }
  if (rolActual !== ROLES_USUARIO.ADMIN) {
    return <AccesoDenegadoPage />;
  }
  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rutas públicas / Visitante (HU-1)
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'registro', element: <RegistroPage /> },
      { path: 'recuperar-password', element: <RecuperarPasswordPage /> },
      { path: 'recuperar', element: <RecuperarPasswordPage /> },
      { path: 'aviso-publico/:id', element: <DetalleAvisoVisitantePage /> },
      { path: 'catalogo', element: <CatalogoPage /> },
      { path: 'vendedor/:id', element: <PerfilVendedorPage /> },

      // Rutas de Usuario autenticado
      {
        path: 'mi-cuenta',
        element: (
          <RutaUsuario>
            <MiCuentaPage />
          </RutaUsuario>
        )
      },
      {
        path: 'mis-publicaciones',
        element: (
          <RutaUsuario>
            <MisPublicacionesPage />
          </RutaUsuario>
        )
      },
      {
        path: 'nuevo-aviso',
        element: (
          <RutaUsuario>
            <NuevoAvisoPage />
          </RutaUsuario>
        )
      },
      {
        path: 'editar-aviso/:id',
        element: (
          <RutaUsuario>
            <NuevoAvisoPage />
          </RutaUsuario>
        )
      },
      {
        path: 'aviso/:id/fotografias',
        element: (
          <RutaUsuario>
            <CargaFotografiasPage />
          </RutaUsuario>
        )
      },
      {
        path: 'aviso/:id',
        element: (
          <RutaUsuario>
            <DetalleAvisoUsuarioPage />
          </RutaUsuario>
        )
      },
      {
        path: 'favoritos',
        element: (
          <RutaUsuario>
            <FavoritosPage />
          </RutaUsuario>
        )
      },
      {
        path: 'ofertas',
        element: (
          <RutaUsuario>
            <OfertasRecibidasPage />
          </RutaUsuario>
        )
      },
      {
        path: 'ofertas-enviadas',
        element: (
          <RutaUsuario>
            <OfertasEnviadasPage />
          </RutaUsuario>
        )
      },
      {
        path: 'ofertas/:id/hilo',
        element: (
          <RutaUsuario>
            <HiloNegociacionPage />
          </RutaUsuario>
        )
      },
      {
        path: 'acuerdo-generado/:id',
        element: (
          <RutaUsuario>
            <AcuerdoGeneradoPage />
          </RutaUsuario>
        )
      },
      {
        path: 'acuerdos/:id/coordinar',
        element: (
          <RutaUsuario>
            <CoordinarEntregaPage />
          </RutaUsuario>
        )
      },
      {
        path: 'acuerdos',
        element: (
          <RutaUsuario>
            <MisAcuerdosPage />
          </RutaUsuario>
        )
      },
      {
        path: 'acuerdos/:id',
        element: (
          <RutaUsuario>
            <DetalleAcuerdoPage />
          </RutaUsuario>
        )
      },
      {
        path: 'acuerdos/:id/calificar',
        element: (
          <RutaUsuario>
            <CalificarContrapartePage />
          </RutaUsuario>
        )
      },
      {
        path: 'reputacion/:id',
        element: (
          <RutaUsuario>
            <PerfilReputacionPage />
          </RutaUsuario>
        )
      },
      {
        path: 'calificaciones',
        element: (
          <RutaUsuario>
            <MisCalificacionesPage />
          </RutaUsuario>
        )
      },

      // Rutas de Administrador (protegidas por rol con AccesoDenegadoPage)
      {
        path: 'admin/reportes',
        element: (
          <RutaAdmin>
            <BandejaReportesPage />
          </RutaAdmin>
        )
      },
      {
        path: 'admin/reportes/:id',
        element: (
          <RutaAdmin>
            <DetalleReportePage />
          </RutaAdmin>
        )
      },
      {
        path: 'admin/usuarios',
        element: (
          <RutaAdmin>
            <GestionUsuariosPage />
          </RutaAdmin>
        )
      },
      {
        path: 'admin/metricas',
        element: (
          <RutaAdmin>
            <TableroMetricasPage />
          </RutaAdmin>
        )
      },

      // Rutas comunes (1.6 y 1.7)
      { path: 'acceso-denegado', element: <AccesoDenegadoPage /> },
      { path: '*', element: <NoEncontradaPage /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AvisoProvider>
        <OfertaProvider>
          <AcuerdoProvider>
            <CalificacionProvider>
              <ReporteProvider>
                <RouterProvider router={router} />
              </ReporteProvider>
            </CalificacionProvider>
          </AcuerdoProvider>
        </OfertaProvider>
      </AvisoProvider>
    </AuthProvider>
  </StrictMode>
);
