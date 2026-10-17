/**
 * DATOS SEMILLA DE AVISOS — Tablón ULima
 * Incluye los avisos de Rosa Quispe (Vista 2.1), del catálogo de Cálculo I (Vista 3.1),
 * sugerencias de Química General (Vista 3.2), favoritos (Vista 3.7) y reportes (Vista 7.1).
 */

export const avisosIniciales = [
  {
    id: 'av-101',
    titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
    descripcion: 'Usado un ciclo en Cálculo I con el profesor Mendoza. Tapa firme, sin hojas sueltas, algunas anotaciones a lápiz en los capítulos 3 y 4. Incluye el separador original y la tabla de derivadas que reparten en clase.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 95.00,
    aceptaOfertas: true,
    montoMinimo: 70.00,
    estado: 'Publicado',
    fechaPublicacion: '18/08/2026',
    vendedorId: 'u-1',
    vendedorNombre: 'Rosa María Quispe Ríos',
    fotos: [
      { id: 'f-1', etiqueta: 'fotografía principal · portada del libro', principal: true },
      { id: 'f-2', etiqueta: 'lomo del libro', principal: false },
      { id: 'f-3', etiqueta: 'hojas interiores', principal: false },
      { id: 'f-4', etiqueta: 'tabla de derivadas incluida', principal: false }
    ],
    ofertasCount: 4
  },
  {
    id: 'av-102',
    titulo: 'Calculadora científica ClassWiz fx-991',
    descripcion: 'Usada dos ciclos en Física II. Pantalla sin rayones, incluye tapa y manual. Funciona con pila nueva; entrego con estuche de tela.',
    categoria: 'Calculadoras',
    curso: 'Física II',
    condicion: 'Como nuevo',
    precio: 120.00,
    aceptaOfertas: true,
    montoMinimo: 95.00,
    estado: 'Publicado',
    fechaPublicacion: '22/08/2026',
    vendedorId: 'u-1',
    vendedorNombre: 'Rosa María Quispe Ríos',
    fotos: [
      { id: 'f-21', etiqueta: 'fotografía principal · calculadora', principal: true },
      { id: 'f-22', etiqueta: 'pantalla encendida', principal: false },
      { id: 'f-23', etiqueta: 'tapa y estuche de tela', principal: false }
    ],
    ofertasCount: 3
  },
  {
    id: 'av-103',
    titulo: 'Juego de escuadras y escalímetro Faber',
    descripcion: 'Juego de dos escuadras biseladas de 30 cm y escalímetro triangular profesional usado en Dibujo Técnico. Sin bordes astillados.',
    categoria: 'Instrumentos de dibujo',
    curso: 'Dibujo Técnico',
    condicion: 'Buen estado',
    precio: 38.00,
    aceptaOfertas: true,
    montoMinimo: 30.00,
    estado: 'Pausado',
    fechaPublicacion: '10/08/2026',
    vendedorId: 'u-1',
    vendedorNombre: 'Rosa María Quispe Ríos',
    fotos: [
      { id: 'f-31', etiqueta: 'escuadras y escalímetro en estuche', principal: true }
    ],
    ofertasCount: 2
  },
  {
    id: 'av-104',
    titulo: 'Apuntes de Contabilidad General — 2 ciclos',
    descripcion: 'Cuaderno anillado con casos prácticos resueltos, asientos contables, estados financieros y prácticas calificadas pasadas.',
    categoria: 'Apuntes y guías',
    curso: 'Contabilidad General',
    condicion: 'Con marcas de uso',
    precio: 25.00,
    aceptaOfertas: true,
    montoMinimo: 18.00,
    estado: 'Publicado',
    fechaPublicacion: '29/08/2026',
    vendedorId: 'u-1',
    vendedorNombre: 'Rosa María Quispe Ríos',
    fotos: [
      { id: 'f-41', etiqueta: 'portada de apuntes anillados', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-105',
    titulo: 'Mandil de laboratorio talla M',
    descripcion: 'Mandil blanco de algodón grueso con mangas largas y broches metálicos para laboratorio de Química General.',
    categoria: 'Uniformes y mandiles',
    curso: 'Química General',
    condicion: 'Buen estado',
    precio: 45.00,
    aceptaOfertas: false,
    montoMinimo: 45.00,
    estado: 'Borrador',
    fechaPublicacion: 'Sin publicar',
    vendedorId: 'u-1',
    vendedorNombre: 'Rosa María Quispe Ríos',
    fotos: [],
    ofertasCount: 0
  },
  {
    id: 'av-106',
    titulo: 'Física para ciencias e ingeniería — Serway, tomo I',
    descripcion: 'Edición en español, ideal para Física II. Tapas forradas con plástico transparente, sin subrayados con resaltador.',
    categoria: 'Libros de texto',
    curso: 'Física II',
    condicion: 'Buen estado',
    precio: 110.00,
    aceptaOfertas: true,
    montoMinimo: 90.00,
    estado: 'Vendido',
    fechaPublicacion: '05/08/2026',
    fechaVenta: '05/08/2026',
    vendedorId: 'u-1',
    vendedorNombre: 'Rosa María Quispe Ríos',
    fotos: [
      { id: 'f-61', etiqueta: 'portada Serway tomo I', principal: true }
    ],
    ofertasCount: 1
  },
  {
    id: 'av-107',
    titulo: 'Cálculo — Larson, tomo I',
    descripcion: 'Novena edición. Excelente conservación, ejercicios impares con respuestas al final del libro.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 78.00,
    aceptaOfertas: true,
    montoMinimo: 65.00,
    estado: 'Publicado',
    fechaPublicacion: '20/08/2026',
    vendedorId: 'u-7',
    vendedorNombre: 'Iván Palomino Rojas',
    fotos: [
      { id: 'f-71', etiqueta: 'portada Cálculo Larson tomo I', principal: true }
    ],
    ofertasCount: 1
  },
  {
    id: 'av-108',
    titulo: 'Solucionario de Cálculo I anillado',
    descripcion: 'Solucionario paso a paso de exámenes parciales y finales de los últimos 4 ciclos académicos.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 45.00,
    aceptaOfertas: true,
    montoMinimo: 35.00,
    estado: 'Publicado',
    fechaPublicacion: '21/08/2026',
    vendedorId: 'u-3',
    vendedorNombre: 'Andrés Castillo Paredes',
    fotos: [
      { id: 'f-81', etiqueta: 'solucionario anillado Cálculo I', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-109',
    titulo: 'Cálculo diferencial e integral — Purcell',
    descripcion: 'Libro clásico para Cálculo I. Muy bien cuidado, sin marcas ni dobleces.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 62.00,
    aceptaOfertas: true,
    montoMinimo: 50.00,
    estado: 'Publicado',
    fechaPublicacion: '23/08/2026',
    vendedorId: 'u-4',
    vendedorNombre: 'Milagros Flores Ttito',
    fotos: [
      { id: 'f-91', etiqueta: 'portada Purcell Cálculo', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-110',
    titulo: 'Cálculo aplicado a la economía',
    descripcion: 'Enfoque práctico con derivadas, optimización y marginalidad para carreras de negocios.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 55.00,
    aceptaOfertas: true,
    montoMinimo: 45.00,
    estado: 'Publicado',
    fechaPublicacion: '24/08/2026',
    vendedorId: 'u-7',
    vendedorNombre: 'Iván Palomino Rojas',
    fotos: [
      { id: 'f-101', etiqueta: 'portada Cálculo aplicado', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-111',
    titulo: 'Problemas resueltos de límites y derivadas',
    descripcion: 'Compendio de 200 ejercicios resueltos de límites, continuidad y derivadas.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 40.00,
    aceptaOfertas: true,
    montoMinimo: 30.00,
    estado: 'Publicado',
    fechaPublicacion: '25/08/2026',
    vendedorId: 'u-5',
    vendedorNombre: 'Lucía Ramírez Ccahuana',
    fotos: [
      { id: 'f-111', etiqueta: 'compendio límites y derivadas', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-112',
    titulo: 'Cálculo vectorial — Marsden y Tromba',
    descripcion: 'Edición completa en español, ideal para profundizar en funciones de varias variables.',
    categoria: 'Libros de texto',
    curso: 'Cálculo I',
    condicion: 'Muy buen estado',
    precio: 105.00,
    aceptaOfertas: true,
    montoMinimo: 85.00,
    estado: 'Publicado',
    fechaPublicacion: '26/08/2026',
    vendedorId: 'u-3',
    vendedorNombre: 'Andrés Castillo Paredes',
    fotos: [
      { id: 'f-121', etiqueta: 'portada Marsden y Tromba', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-113',
    titulo: 'Estuche de dibujo técnico Staedtler',
    descripcion: 'Incluye compás de precisión con adaptador universal, estilógrafos y portaminas.',
    categoria: 'Instrumentos de dibujo',
    curso: 'Dibujo Técnico',
    condicion: 'Como nuevo',
    precio: 52.00,
    aceptaOfertas: true,
    montoMinimo: 42.00,
    estado: 'Publicado',
    fechaPublicacion: '25/08/2026',
    vendedorId: 'u-8',
    vendedorNombre: 'Paola Zegarra Ibáñez',
    fotos: [
      { id: 'f-131', etiqueta: 'estuche Staedtler abierto', principal: true }
    ],
    ofertasCount: 1
  },
  {
    id: 'av-114',
    titulo: 'Apuntes de Estadística Aplicada',
    descripcion: 'Formulario impreso, tablas de distribución normal, t-Student, chi-cuadrado y casos resueltos en Excel.',
    categoria: 'Apuntes y guías',
    curso: 'Estadística Aplicada',
    condicion: 'Buen estado',
    precio: 30.00,
    aceptaOfertas: true,
    montoMinimo: 22.00,
    estado: 'Publicado',
    fechaPublicacion: '27/08/2026',
    vendedorId: 'u-4',
    vendedorNombre: 'Milagros Flores Ttito',
    fotos: [
      { id: 'f-141', etiqueta: 'apuntes Estadística Aplicada', principal: true }
    ],
    ofertasCount: 0
  },
  {
    id: 'av-115',
    titulo: 'Química General — Chang, 11.ª ed.',
    descripcion: 'Libro clásico de Química General a todo color. Incluye tabla periódica desplegable.',
    categoria: 'Libros de texto',
    curso: 'Química General',
    condicion: 'Buen estado',
    precio: 85.00,
    aceptaOfertas: true,
    montoMinimo: 70.00,
    estado: 'Vendido',
    fechaPublicacion: '15/08/2026',
    fechaVenta: '21/08/2026',
    vendedorId: 'u-14',
    vendedorNombre: 'Marco Antonio Loayza Pinto',
    fotos: [
      { id: 'f-151', etiqueta: 'portada Química Chang 11a ed.', principal: true }
    ],
    ofertasCount: 1
  },
  {
    id: 'av-116',
    titulo: 'Mochila para laptop 15" acolchada',
    descripcion: 'Mochila impermeable con compartimento acolchado para laptop de hasta 15.6 pulgadas.',
    categoria: 'Laptops y accesorios',
    curso: 'Programación Web',
    condicion: 'Buen estado',
    precio: 65.00,
    aceptaOfertas: true,
    montoMinimo: 50.00,
    estado: 'Publicado',
    fechaPublicacion: '19/08/2026',
    vendedorId: 'u-15',
    vendedorNombre: 'Alejandra Cornejo Ríos',
    fotos: [
      { id: 'f-161', etiqueta: 'mochila acolchada 15 pulgadas', principal: true }
    ],
    ofertasCount: 1
  },
  {
    id: 'av-117',
    titulo: 'Laptop gamer casi nueva — precio de remate',
    descripcion: 'Laptop de alto rendimiento. Solicito adelanto por Yape para separar antes de entregar.',
    categoria: 'Laptops y accesorios',
    curso: 'Programación Web',
    condicion: 'Como nuevo',
    precio: 450.00,
    aceptaOfertas: false,
    montoMinimo: 450.00,
    estado: 'Publicado',
    fechaPublicacion: '02/09/2026',
    vendedorId: 'u-10',
    vendedorNombre: 'Kevin Bustamante Ruiz',
    fotos: [
      { id: 'f-171', etiqueta: 'foto del aviso · laptop gamer', principal: true }
    ],
    ofertasCount: 0
  }
];

export const favoritosInicialesPorUsuario = {
  'u-1': ['av-107', 'av-113'],
  'u-2': ['av-101', 'av-113', 'av-114', 'av-115', 'av-116']
};
