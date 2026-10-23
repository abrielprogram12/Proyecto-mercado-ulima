
const svgToDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;

function crearSvgLibro({ titulo, subtitulo, autor, edicion, colorCubierta = '#B84A27', colorAcento = '#F5E3DC', codigo = 'MAT-101' }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <rect width="480" height="360" fill="#F6F1EB"/>
      <circle cx="410" cy="60" r="95" fill="#EFE8DF" opacity="0.7"/>
      <circle cx="70" cy="310" r="80" fill="#EFE8DF" opacity="0.7"/>
      <rect x="136" y="48" width="220" height="276" rx="10" fill="#D8CFC8"/>
      <rect x="130" y="42" width="218" height="272" rx="8" fill="#FFFDF9" stroke="#D8CFC8" stroke-width="2"/>
      <rect x="122" y="38" width="212" height="272" rx="8" fill="${colorCubierta}"/>
      <rect x="122" y="38" width="24" height="272" rx="6" fill="#2A211C" opacity="0.28"/>
      <rect x="158" y="64" width="152" height="24" rx="4" fill="${colorAcento}" opacity="0.92"/>
      <text x="234" y="80" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="11" font-weight="700" fill="${colorCubierta}" text-anchor="middle" letter-spacing="1">${codigo}</text>
      <text x="234" y="128" font-family="Plus Jakarta Sans, Georgia, serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle">${titulo}</text>
      <text x="234" y="152" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${colorAcento}" text-anchor="middle">${subtitulo}</text>
      <rect x="164" y="174" width="140" height="72" rx="6" fill="#2A211C" opacity="0.18"/>
      <path d="M 176 232 Q 205 180 234 212 T 292 188" fill="none" stroke="${colorAcento}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="205" cy="198" r="4" fill="#FFFFFF"/>
      <circle cx="264" cy="204" r="4" fill="#FFFFFF"/>
      <text x="234" y="274" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">${autor}</text>
      <text x="234" y="292" font-family="Inter, Arial, sans-serif" font-size="10" fill="${colorAcento}" text-anchor="middle">${edicion}</text>
    </svg>
  `);
}

function crearSvgCalculadora({ modelo = 'ClassWiz fx-991', subtitulo = 'Científica · Solar y batería', pantalla = '∫(x²+2x)dx = 28.5' }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <rect width="480" height="360" fill="#F6F1EB"/>
      <rect x="148" y="34" width="192" height="298" rx="22" fill="#D8CFC8"/>
      <rect x="140" y="28" width="192" height="296" rx="20" fill="#2E2724" stroke="#4A3F3A" stroke-width="2"/>
      <rect x="252" y="44" width="60" height="18" rx="3" fill="#4A3831" stroke="#6E5D54" stroke-width="1"/>
      <text x="160" y="54" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="11" font-weight="800" fill="#F5E3DC">CASIO</text>
      <text x="160" y="68" font-family="Inter, Arial, sans-serif" font-size="9" font-weight="600" fill="#D97706">${modelo}</text>
      <rect x="158" y="78" width="156" height="58" rx="6" fill="#DCE8DF" stroke="#9BB5A2" stroke-width="2"/>
      <text x="168" y="98" font-family="JetBrains Mono, monospace" font-size="10" fill="#2A3B2E">MATH  D  FIX</text>
      <text x="304" y="122" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="#1B2A1E" text-anchor="end">${pantalla}</text>
      <g fill="#4A3F3A">
        <rect x="158" y="150" width="32" height="18" rx="4"/>
        <rect x="198" y="150" width="32" height="18" rx="4"/>
        <rect x="242" y="150" width="32" height="18" rx="4"/>
        <rect x="282" y="150" width="32" height="18" rx="4"/>
      </g>
      <g fill="#F8F3ED" stroke="#2A211C" stroke-width="1">
        <rect x="158" y="182" width="34" height="24" rx="4"/>
        <rect x="200" y="182" width="34" height="24" rx="4"/>
        <rect x="242" y="182" width="34" height="24" rx="4"/>
        <rect x="158" y="214" width="34" height="24" rx="4"/>
        <rect x="200" y="214" width="34" height="24" rx="4"/>
        <rect x="242" y="214" width="34" height="24" rx="4"/>
        <rect x="158" y="246" width="34" height="24" rx="4"/>
        <rect x="200" y="246" width="34" height="24" rx="4"/>
        <rect x="242" y="246" width="34" height="24" rx="4"/>
        <rect x="158" y="278" width="76" height="24" rx="4"/>
        <rect x="242" y="278" width="34" height="24" rx="4"/>
      </g>
      <rect x="284" y="182" width="30" height="24" rx="4" fill="#B84A27"/>
      <rect x="284" y="214" width="30" height="24" rx="4" fill="#B84A27"/>
      <rect x="284" y="246" width="30" height="56" rx="4" fill="#2E7D5B"/>
      <text x="240" y="346" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" fill="#6E5D54" text-anchor="middle">${subtitulo}</text>
    </svg>
  `);
}

function crearSvgDibujo({ titulo = 'Escuadras y Escalímetro', subtitulo = 'Faber-Castell · 30 cm · Biseladas' }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <rect width="480" height="360" fill="#F6F1EB"/>
      <rect x="56" y="42" width="368" height="256" rx="12" fill="#FFFDF9" stroke="#E5DDD5" stroke-width="2"/>
      <polygon points="96,264 276,264 96,84" fill="#2B5B84" fill-opacity="0.22" stroke="#2B5B84" stroke-width="3"/>
      <polygon points="122,242 218,242 122,146" fill="#FFFDF9" stroke="#2B5B84" stroke-width="2"/>
      <polygon points="210,256 386,256 386,104" fill="#2E7D5B" fill-opacity="0.22" stroke="#2E7D5B" stroke-width="3"/>
      <rect x="110" y="64" width="260" height="28" rx="5" fill="#F5E3DC" stroke="#B84A27" stroke-width="2"/>
      <text x="240" y="82" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#B84A27" text-anchor="middle">1:100   1:200   1:250   1:500</text>
      <text x="240" y="328" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="14" font-weight="700" fill="#2A211C" text-anchor="middle">${titulo} — ${subtitulo}</text>
    </svg>
  `);
}

function crearSvgApuntes({ titulo = 'Apuntes Anillados', curso = 'Contabilidad General', nota = 'Ejercicios y prácticas resueltas' }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <rect width="480" height="360" fill="#F6F1EB"/>
      <rect x="134" y="42" width="224" height="278" rx="10" fill="#D8CFC8"/>
      <rect x="126" y="34" width="224" height="276" rx="8" fill="#FFFDF9" stroke="#C8BCB2" stroke-width="2"/>
      <g fill="#6E5D54">
        <rect x="116" y="56" width="20" height="8" rx="4"/>
        <rect x="116" y="88" width="20" height="8" rx="4"/>
        <rect x="116" y="120" width="20" height="8" rx="4"/>
        <rect x="116" y="152" width="20" height="8" rx="4"/>
        <rect x="116" y="184" width="20" height="8" rx="4"/>
        <rect x="116" y="216" width="20" height="8" rx="4"/>
        <rect x="116" y="248" width="20" height="8" rx="4"/>
        <rect x="116" y="280" width="20" height="8" rx="4"/>
      </g>
      <rect x="154" y="60" width="172" height="58" rx="6" fill="#F5E3DC" stroke="#B84A27" stroke-width="1.5"/>
      <text x="240" y="84" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="14" font-weight="800" fill="#B84A27" text-anchor="middle">${titulo}</text>
      <text x="240" y="104" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="600" fill="#2A211C" text-anchor="middle">${curso}</text>
      <g stroke="#E5DDD5" stroke-width="2">
        <line x1="154" y1="146" x2="324" y2="146"/>
        <line x1="154" y1="170" x2="324" y2="170"/>
        <line x1="154" y1="194" x2="324" y2="194"/>
        <line x1="154" y1="218" x2="324" y2="218"/>
        <line x1="154" y1="242" x2="290" y2="242"/>
      </g>
      <rect x="154" y="262" width="172" height="28" rx="5" fill="#E6F3EC"/>
      <text x="240" y="280" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700" fill="#2E7D5B" text-anchor="middle">${nota}</text>
    </svg>
  `);
}

function crearSvgMandil({ talla = 'Talla M', curso = 'Laboratorio de Química' }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <rect width="480" height="360" fill="#F6F1EB"/>
      <circle cx="240" cy="180" r="136" fill="#EFE8DF"/>
      <path d="M 176 68 L 212 68 L 240 112 L 268 68 L 304 68 L 346 144 L 318 162 L 298 124 L 298 294 L 182 294 L 182 124 L 162 162 L 134 144 Z" fill="#FFFDF9" stroke="#C8BCB2" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 212 68 L 240 128 L 268 68" fill="none" stroke="#9B8B82" stroke-width="2"/>
      <circle cx="240" cy="154" r="4" fill="#6E5D54"/>
      <circle cx="240" cy="186" r="4" fill="#6E5D54"/>
      <circle cx="240" cy="218" r="4" fill="#6E5D54"/>
      <rect x="256" y="138" width="28" height="32" rx="3" fill="#F5E3DC" stroke="#B84A27" stroke-width="1.5"/>
      <text x="270" y="158" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="10" font-weight="800" fill="#B84A27" text-anchor="middle">UL</text>
      <text x="240" y="332" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="13" font-weight="700" fill="#2A211C" text-anchor="middle">Mandil de Laboratorio · ${talla} · ${curso}</text>
    </svg>
  `);
}

function crearSvgLaptop({ titulo = 'Accesorios y Equipos', subtitulo = 'Campus ULima', colorPantalla = '#2B5B84' }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
      <rect width="480" height="360" fill="#F6F1EB"/>
      <rect x="116" y="64" width="248" height="164" rx="12" fill="#2A211C"/>
      <rect x="128" y="76" width="224" height="140" rx="6" fill="${colorPantalla}"/>
      <text x="240" y="142" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">${titulo}</text>
      <text x="240" y="166" font-family="Inter, Arial, sans-serif" font-size="12" fill="#F5E3DC" text-anchor="middle">${subtitulo}</text>
      <path d="M 84 228 L 396 228 L 416 252 L 64 252 Z" fill="#C8BCB2" stroke="#9B8B82" stroke-width="2"/>
      <rect x="206" y="234" width="68" height="8" rx="4" fill="#6E5D54"/>
    </svg>
  `);
}

export const ILUSTRACION_HERO_CAMPUS = svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" width="640" height="420">
    <rect width="640" height="420" fill="#F3E6DE"/>
    <circle cx="520" cy="90" r="130" fill="#EAD5C8"/>
    <circle cx="110" cy="340" r="110" fill="#EAD5C8"/>
    <rect x="64" y="68" width="512" height="284" rx="16" fill="#FFFDF9" stroke="#E5DDD5" stroke-width="2"/>
    <rect x="64" y="68" width="512" height="46" rx="16" fill="#B84A27"/>
    <circle cx="92" cy="91" r="6" fill="#F5E3DC"/>
    <circle cx="112" cy="91" r="6" fill="#F5E3DC"/>
    <text x="320" y="96" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.8">CAMPUS MONTERRICO · INTERCAMBIO ACADÉMICO</text>
    <rect x="114" y="232" width="180" height="34" rx="6" fill="#B84A27"/>
    <text x="204" y="254" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">CÁLCULO I · STEWART</text>
    <rect x="126" y="196" width="168" height="34" rx="6" fill="#2E7D5B"/>
    <text x="210" y="218" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">FÍSICA II · SERWAY</text>
    <rect x="138" y="160" width="152" height="34" rx="6" fill="#2B5B84"/>
    <text x="214" y="182" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">QUÍMICA · CHANG</text>
    <rect x="336" y="146" width="196" height="136" rx="12" fill="#F6F1EB" stroke="#D8CFC8" stroke-width="2"/>
    <rect x="356" y="166" width="96" height="22" rx="11" fill="#E6F3EC"/>
    <text x="404" y="181" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700" fill="#2E7D5B" text-anchor="middle">✓ Trato cerrado</text>
    <text x="356" y="212" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="15" font-weight="800" fill="#2A211C">Entrega en Biblioteca</text>
    <text x="356" y="232" font-family="Inter, Arial, sans-serif" font-size="12" fill="#6E5D54">11:00 – 13:00 · Sin comisiones</text>
    <text x="356" y="262" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700" fill="#B84A27">S/ 84.00</text>
    <text x="320" y="324" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="#6E5D54" text-anchor="middle">Comunidad verificada con correo institucional @aloe.ulima.edu.pe</text>
  </svg>
`);

export const IMAGENES_POR_AVISO_ID = {
  'av-101': [
    crearSvgLibro({
      titulo: 'CÁLCULO',
      subtitulo: 'De una variable · Trascendentes tempranas',
      autor: 'James Stewart',
      edicion: 'Octava Edición · Cengage Learning',
      colorCubierta: '#B84A27',
      codigo: 'CÁLCULO I'
    }),
    crearSvgLibro({
      titulo: 'LOMO Y ENCUADERNADO',
      subtitulo: 'Tapa firme · Sin hojas sueltas',
      autor: 'Conservación 9/10',
      edicion: 'Forrado en plástico transparente',
      colorCubierta: '#8E3519',
      codigo: 'VISTA LATERAL'
    }),
    crearSvgApuntes({
      titulo: 'Hojas Interiores',
      curso: 'Capítulos 1 al 8 impecables',
      nota: 'Incluye separador original'
    }),
    crearSvgApuntes({
      titulo: 'Tabla de Derivadas',
      curso: 'Formulario impreso incluido',
      nota: 'Fórmulas de límites e integrales'
    })
  ],
  'av-102': [
    crearSvgCalculadora({
      modelo: 'ClassWiz fx-991LA X',
      subtitulo: '552 funciones · Hoja de cálculo · QR',
      pantalla: '∫(x²+2x)dx = 28.5'
    }),
    crearSvgCalculadora({
      modelo: 'Pantalla Alta Resolución',
      subtitulo: 'Sin rayones · Pila nueva instalada',
      pantalla: 'f(x) = sin(x) + cos(x)'
    }),
    crearSvgCalculadora({
      modelo: 'Tapa Dura y Estuche',
      subtitulo: 'Incluye manual original Casio',
      pantalla: 'LISTO PARA EXAMEN'
    })
  ],
  'av-103': [
    crearSvgDibujo({
      titulo: 'Juego de Escuadras y Escalímetro',
      subtitulo: 'Faber-Castell · 30 cm · Dibujo Técnico'
    })
  ],
  'av-104': [
    crearSvgApuntes({
      titulo: 'Contabilidad General',
      curso: 'Apuntes completos de 2 ciclos',
      nota: 'Estados financieros y PC resueltas'
    })
  ],
  'av-105': [
    crearSvgMandil({
      talla: 'Talla M',
      curso: 'Química General'
    })
  ],
  'av-106': [
    crearSvgLibro({
      titulo: 'FÍSICA',
      subtitulo: 'Para ciencias e ingeniería · Tomo I',
      autor: 'Serway · Jewett',
      edicion: 'Novena Edición · Mecánica y Ondas',
      colorCubierta: '#2B5B84',
      codigo: 'FÍSICA II'
    })
  ],
  'av-107': [
    crearSvgLibro({
      titulo: 'CÁLCULO',
      subtitulo: 'Tomo I · Diferencial e Integral',
      autor: 'Ron Larson · Bruce Edwards',
      edicion: 'Novena Edición · Ejercicios resueltos',
      colorCubierta: '#2E7D5B',
      codigo: 'CÁLCULO I'
    })
  ],
  'av-108': [
    crearSvgApuntes({
      titulo: 'Solucionario Cálculo I',
      curso: 'Exámenes parciales y finales',
      nota: 'Últimos 4 ciclos académicos paso a paso'
    })
  ],
  'av-109': [
    crearSvgLibro({
      titulo: 'CÁLCULO',
      subtitulo: 'Diferencial e Integral',
      autor: 'Purcell · Varberg · Rigdon',
      edicion: 'Novena Edición · Pearson',
      colorCubierta: '#6B4423',
      codigo: 'CÁLCULO I'
    })
  ],
  'av-110': [
    crearSvgLibro({
      titulo: 'CÁLCULO APLICADO',
      subtitulo: 'Para administración y economía',
      autor: 'Hoffmann · Bradley',
      edicion: 'Optimización y marginalidad',
      colorCubierta: '#3B5998',
      codigo: 'ECONOMÍA'
    })
  ],
  'av-111': [
    crearSvgApuntes({
      titulo: 'Límites y Derivadas',
      curso: '200 problemas resueltos',
      nota: 'Continuidad, derivadas y aplicaciones'
    })
  ],
  'av-112': [
    crearSvgLibro({
      titulo: 'CÁLCULO VECTORIAL',
      subtitulo: 'Funciones de varias variables',
      autor: 'Jerrold E. Marsden · Anthony Tromba',
      edicion: 'Quinta Edición · Pearson',
      colorCubierta: '#7A3E65',
      codigo: 'MATEMÁTICA'
    })
  ],
  'av-113': [
    crearSvgDibujo({
      titulo: 'Estuche Técnico Staedtler',
      subtitulo: 'Compás de precisión · Estilógrafos · Portaminas'
    })
  ],
  'av-114': [
    crearSvgApuntes({
      titulo: 'Estadística Aplicada',
      curso: 'Tablas z, t-Student, Chi-cuadrado',
      nota: 'Incluye casos prácticos en Excel'
    })
  ],
  'av-115': [
    crearSvgLibro({
      titulo: 'QUÍMICA GENERAL',
      subtitulo: 'Principios y estructura de la materia',
      autor: 'Raymond Chang · Kenneth Goldsby',
      edicion: '11.ª Edición · McGraw-Hill',
      colorCubierta: '#1F6E58',
      codigo: 'QUÍMICA'
    })
  ],
  'av-116': [
    crearSvgLaptop({
      titulo: 'Mochila Acolchada 15.6"',
      subtitulo: 'Impermeable · Compartimento para laptop',
      colorPantalla: '#3D5A6C'
    })
  ],
  'av-117': [
    crearSvgLaptop({
      titulo: 'Laptop Gamer 15.6"',
      subtitulo: 'Aviso en revisión por moderación',
      colorPantalla: '#8E2A2A'
    })
  ]
};

export const ICONOS_CATEGORIAS_DESTACADAS = {
  'Libros de texto': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <rect x="14" y="10" width="36" height="44" rx="5" fill="#F5E3DC" stroke="#B84A27" stroke-width="2.5"/>
      <rect x="14" y="10" width="9" height="44" rx="3" fill="#B84A27"/>
      <path d="M 38 10 L 38 24 L 42 20 L 46 24 L 46 10 Z" fill="#D97706"/>
      <line x1="28" y1="28" x2="43" y2="28" stroke="#B84A27" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="28" y1="35" x2="40" y2="35" stroke="#6E5D54" stroke-width="2" stroke-linecap="round"/>
      <line x1="28" y1="42" x2="36" y2="42" stroke="#6E5D54" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  'Calculadoras': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <rect x="16" y="8" width="32" height="48" rx="6" fill="#FFFDF9" stroke="#2A211C" stroke-width="2.5"/>
      <rect x="21" y="14" width="22" height="11" rx="2.5" fill="#DCE8DF" stroke="#2E7D5B" stroke-width="2"/>
      <circle cx="24" cy="33" r="2.5" fill="#6E5D54"/>
      <circle cx="32" cy="33" r="2.5" fill="#6E5D54"/>
      <circle cx="40" cy="33" r="2.5" fill="#B84A27"/>
      <circle cx="24" cy="41" r="2.5" fill="#6E5D54"/>
      <circle cx="32" cy="41" r="2.5" fill="#6E5D54"/>
      <circle cx="40" cy="41" r="2.5" fill="#B84A27"/>
      <rect x="21.5" y="47" width="13" height="4" rx="2" fill="#6E5D54"/>
      <circle cx="40" cy="49" r="2.5" fill="#2E7D5B"/>
    </svg>
  `),
  'Instrumentos de dibujo': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <polygon points="12,50 50,50 12,12" fill="#F5E3DC" stroke="#B84A27" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="19,43 33,43 19,29" fill="#FFFDF9" stroke="#B84A27" stroke-width="2" stroke-linejoin="round"/>
      <rect x="28" y="12" width="24" height="8" rx="2" transform="rotate(45 40 16)" fill="#DCE8DF" stroke="#2E7D5B" stroke-width="2"/>
      <line x1="18" y1="50" x2="18" y2="46" stroke="#B84A27" stroke-width="2"/>
      <line x1="26" y1="50" x2="26" y2="46" stroke="#B84A27" stroke-width="2"/>
      <line x1="34" y1="50" x2="34" y2="46" stroke="#B84A27" stroke-width="2"/>
      <line x1="42" y1="50" x2="42" y2="46" stroke="#B84A27" stroke-width="2"/>
    </svg>
  `),
  'Apuntes y guías': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <rect x="16" y="10" width="34" height="44" rx="4" fill="#FFFDF9" stroke="#B84A27" stroke-width="2.5"/>
      <line x1="13" y1="17" x2="19" y2="17" stroke="#6E5D54" stroke-width="3" stroke-linecap="round"/>
      <line x1="13" y1="25" x2="19" y2="25" stroke="#6E5D54" stroke-width="3" stroke-linecap="round"/>
      <line x1="13" y1="33" x2="19" y2="33" stroke="#6E5D54" stroke-width="3" stroke-linecap="round"/>
      <line x1="13" y1="41" x2="19" y2="41" stroke="#6E5D54" stroke-width="3" stroke-linecap="round"/>
      <line x1="13" y1="49" x2="19" y2="49" stroke="#6E5D54" stroke-width="3" stroke-linecap="round"/>
      <rect x="23" y="16" width="20" height="8" rx="2" fill="#F5E3DC"/>
      <line x1="23" y1="31" x2="43" y2="31" stroke="#B84A27" stroke-width="2" stroke-linecap="round"/>
      <line x1="23" y1="38" x2="43" y2="38" stroke="#9B8B82" stroke-width="2" stroke-linecap="round"/>
      <line x1="23" y1="45" x2="35" y2="45" stroke="#9B8B82" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  'Laptops y accesorios': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <rect x="14" y="14" width="36" height="24" rx="4" fill="#F5E3DC" stroke="#2A211C" stroke-width="2.5"/>
      <rect x="18" y="18" width="28" height="16" rx="2" fill="#FFFDF9" stroke="#B84A27" stroke-width="1.5"/>
      <path d="M 8 39 L 56 39 L 52 46 L 12 46 Z" fill="#E5DDD5" stroke="#2A211C" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="28" y1="42.5" x2="36" y2="42.5" stroke="#B84A27" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  'Uniformes y mandiles': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <path d="M 22 12 L 28 12 L 32 20 L 36 12 L 42 12 L 52 24 L 46 30 L 42 24 L 42 52 L 22 52 L 22 24 L 18 30 L 12 24 Z" fill="#FFFDF9" stroke="#B84A27" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 28 12 L 32 24 L 36 12" fill="none" stroke="#6E5D54" stroke-width="2" stroke-linejoin="round"/>
      <rect x="34" y="28" width="5" height="6" rx="1" fill="#F5E3DC" stroke="#B84A27" stroke-width="1.5"/>
      <circle cx="32" cy="31" r="1.5" fill="#B84A27"/>
      <circle cx="32" cy="38" r="1.5" fill="#B84A27"/>
      <circle cx="32" cy="45" r="1.5" fill="#B84A27"/>
    </svg>
  `),
  'Material de laboratorio': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <path d="M 26 12 L 38 12 M 29 12 L 29 24 L 16 46 C 14.5 49 16.5 52 20 52 L 44 52 C 47.5 52 49.5 49 48 46 L 35 24 L 35 12" fill="#FFFDF9" stroke="#2E7D5B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 21 38 L 43 38 L 47 46 C 48 48 46.5 50 44 50 L 20 50 C 17.5 50 16 48 17 46 Z" fill="#DCE8DF"/>
      <circle cx="28" cy="44" r="2" fill="#2E7D5B"/>
      <circle cx="35" cy="41" r="1.5" fill="#2E7D5B"/>
      <circle cx="33" cy="32" r="1.5" fill="#B84A27"/>
    </svg>
  `)
};

export function obtenerIconoCategoria(categoria) {
  return (
    ICONOS_CATEGORIAS_DESTACADAS[categoria] ||
    ICONOS_CATEGORIAS_DESTACADAS['Libros de texto']
  );
}

export function obtenerImagenPorCategoria(categoria = 'Libros de texto', titulo = 'Material académico') {
  const cat = (categoria || '').toLowerCase();
  if (cat.includes('calculadora')) {
    return crearSvgCalculadora({ modelo: titulo.slice(0, 22), subtitulo: categoria });
  }
  if (cat.includes('dibujo') || cat.includes('instrumento')) {
    return crearSvgDibujo({ titulo: titulo.slice(0, 26), subtitulo: categoria });
  }
  if (cat.includes('apunte') || cat.includes('guía') || cat.includes('separata')) {
    return crearSvgApuntes({ titulo: titulo.slice(0, 22), curso: categoria });
  }
  if (cat.includes('uniforme') || cat.includes('mandil') || cat.includes('bata')) {
    return crearSvgMandil({ talla: 'Campus ULima', curso: categoria });
  }
  if (cat.includes('laptop') || cat.includes('accesorio')) {
    return crearSvgLaptop({ titulo: titulo.slice(0, 22), subtitulo: categoria });
  }
  return crearSvgLibro({
    titulo: titulo.slice(0, 18).toUpperCase(),
    subtitulo: categoria,
    autor: 'Material académico ULima',
    edicion: 'Campus Monterrico',
    codigo: 'TABLÓN ULIMA'
  });
}

export function obtenerPortadaAviso(aviso) {
  if (!aviso) return null;
  const fotos = Array.isArray(aviso.fotos) ? aviso.fotos : null;

  if (fotos) {
    const fotoPrincipal =
      fotos.find((f) => f?.principal && f?.url) || fotos.find((f) => f?.url);
    if (fotoPrincipal?.url) {
      return fotoPrincipal.url;
    }
    if (fotos.length === 0) {
      return null;
    }
  }

  const listaId = IMAGENES_POR_AVISO_ID[aviso.id];
  if (listaId && listaId.length > 0) {
    return listaId[0];
  }

  return null;
}

export function obtenerFotosEnriquecidasAviso(aviso) {
  if (!aviso) return [];
  const fotosOriginales = Array.isArray(aviso.fotos) ? aviso.fotos : [];
  const listaId = IMAGENES_POR_AVISO_ID[aviso.id] || [];

  if (fotosOriginales.length === 0) {
    return [];
  }

  return fotosOriginales.map((foto, idx) => ({
    ...foto,
    url: foto.url || listaId[idx] || null
  }));
}

export function leerArchivoImagen(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ ok: false, error: 'No se seleccionó ningún archivo.' });
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const nombre = (file.name || '').toLowerCase();
    const extensionValida =
      nombre.endsWith('.jpg') ||
      nombre.endsWith('.jpeg') ||
      nombre.endsWith('.png') ||
      nombre.endsWith('.webp');

    if (!tiposPermitidos.includes(file.type) && !extensionValida) {
      resolve({
        ok: false,
        tipoError: 'formato',
        error: `Formato no permitido. «${file.name}» no es JPG, PNG ni WEBP.`
      });
      return;
    }

    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      const pesoMb = (file.size / (1024 * 1024)).toFixed(1);
      resolve({
        ok: false,
        tipoError: 'peso',
        error: `La imagen supera 5 MB. «${file.name}» pesa ${pesoMb} MB; elige una más liviana.`
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        ok: true,
        url: reader.result,
        nombre: file.name,
        pesoBytes: file.size
      });
    };
    reader.onerror = () => {
      resolve({
        ok: false,
        error: 'No se pudo leer el archivo seleccionado.'
      });
    };
    reader.readAsDataURL(file);
  });
}
