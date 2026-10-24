# Tablón ULima — Mercado de libros y materiales usados

**Tablón ULima** es una aplicación web desarrollada en **React + Vite** para la comunidad de estudiantes de la **Universidad de Lima**. Permite publicar, buscar, ofertar y acordar la entrega presencial dentro del campus de libros de texto, calculadoras, instrumentos de dibujo, apuntes, uniformes y materiales de laboratorio de segunda mano.

---

## Integrantes y distribución de Historias de Usuario (HU)

| Integrante | Historias de Usuario asignadas |
| :--- | :--- |
| **Renzo Murillo** | **HU-1** — Cuenta y acceso<br>**HU-7** — Moderación y métricas |
| **Nicole Espinoza** | **HU-2** — Publicaciones |
| **Andre Burbano** | **HU-3** — Catálogo y búsqueda |
| **Fabiana Moreno** | **HU-4** — Ofertas |
| **Renato Gambeta** | **HU-5** — Acuerdos de entrega<br>**HU-6** — Reputación |

---

## Instrucciones de instalación y ejecución

1. Clonar el repositorio e ingresar a la carpeta del proyecto:
   ```bash
   cd mercado-ulima
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador la dirección local indicada en consola (por defecto `http://localhost:5173`).

---

## Estructura de carpetas

El código fuente dentro de `src/` está organizado de forma modular:

```text
src/
├── pages/        # Vistas de las 7 historias de usuario (visitante, comun, usuario y administrador)
├── components/   # Componentes reutilizables con props (Header, Footer, TarjetaAviso, FiltrosCatalogo, GaleriaFotos, Modales, etc.)
├── context/      # Estado global compartido mediante React Context API y persistencia en localStorage
├── data/         # Datos semilla simulados, constantes del dominio e ilustraciones vectoriales
├── App.jsx       # Layout principal de la aplicación
└── main.jsx      # Definición de rutas con React Router (useParams, useNavigate) y guardas por rol
```

- **`pages/`**: Agrupa las pantallas por rol y módulo funcional (`visitante/`, `comun/`, `usuario/cuenta`, `usuario/publicaciones`, `usuario/catalogo`, `usuario/ofertas`, `usuario/acuerdos`, `usuario/reputacion` y `administrador/`).
- **`components/`**: Contiene los componentes visuales y modales reutilizables en distintas pantallas, cada uno con su hoja de estilos modular.
- **`context/`**: Administra el estado compartido y la persistencia en `localStorage` (`AuthContext`, `AvisoContext`, `OfertaContext`, `AcuerdoContext`, `CalificacionContext` y `ReporteContext`).
- **`data/`**: Define el contrato de datos compartido (`contratoDatos.js`), los datos iniciales de cada entidad y las utilidades de imágenes.

---

## Cuentas de prueba

Todas las cuentas institucionales registradas utilizan la contraseña: **`Password123`**

| Nombre | Correo institucional | Rol en el sistema |
| :--- | :--- | :--- |
| **Rosa María Quispe Ríos** | `20201234@aloe.ulima.edu.pe` | Usuario |
| **Diego Alonso Vargas Huamán** | `20204455@aloe.ulima.edu.pe` | Usuario |
| **Lucía Fernanda Ramírez Soto** | `20208899@aloe.ulima.edu.pe` | Usuario |
| **Julio César Mendoza Paredes** | `admin@ulima.edu.pe` | Administrador |
