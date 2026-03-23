const asset = (fileName) => `${import.meta.env.BASE_URL}${fileName}`;

export const profile = {
  name: 'Jose Manuel Benitez Ruiz',
  firstName: 'Jose Manuel',
  lastName: 'Benitez Ruiz',
  role: 'Fullstack Developer · Data Science & IA',
  location: 'Palma del Rio, Cordoba',
  email: 'josemanuelbenitezruiz14@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jose-manuel-benitez-ruiz/',
  github: 'https://github.com/jose98br',
  heroImage: asset('Gemini_Generated_Image_o63kfio63kfio63k.png'),
  summary:
    'Desarrollador fullstack especializado en Python, React y Node.js. Experiencia en APIs REST, Docker, Azure y automatizacion de procesos. Cursando Master en Data Science & IA en Evolve Academy.',
};

export const stats = [
  { label: 'Tecnologias', value: '20+' },
  { label: 'Años en IT', value: '2+' },
  { label: 'Certificaciones', value: '4+' },
];

// icon: slug de simpleicons.org — null = sin icono SVG
export const skills = [
  {
    title: 'Lenguajes',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'SQL', icon: 'postgresql' },
      { name: 'Dart', icon: 'dart' },
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
    ],
  },
  {
    title: 'Frontend & Mobile',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'React Native', icon: 'react' },
      { name: 'Expo', icon: 'expo' },
      { name: 'Flutter', icon: 'flutter' },
      { name: 'Ionic', icon: 'ionic' },
      { name: 'Framer Motion', icon: 'framer' },
    ],
  },
  {
    title: 'Backend & APIs',
    items: [
      { name: 'Node.js', icon: 'nodedotjs' },
      { name: 'Express', icon: 'express' },
      { name: 'Django', icon: 'django' },
      { name: 'Flask', icon: 'flask' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Prisma ORM', icon: 'prisma' },
      { name: 'JWT', icon: 'jsonwebtokens' },
    ],
  },
  {
    title: 'Data & IA',
    items: [
      { name: 'Machine Learning', icon: null },
      { name: 'Pandas', icon: 'pandas' },
      { name: 'Matplotlib', icon: null },
      { name: 'n8n', icon: 'n8n' },
      { name: 'GitHub Copilot', icon: 'githubcopilot' },
      { name: 'LLMs & IA gen.', icon: null },
    ],
  },
  {
    title: 'Bases de datos',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Redis', icon: 'redis' },
    ],
  },
  {
    title: 'DevOps & Cloud',
    items: [
      { name: 'Docker', icon: 'docker' },
      { name: 'Azure', icon: 'microsoftazure' },
      { name: 'Azure DevOps', icon: 'azuredevops' },
      { name: 'GitHub Actions', icon: 'githubactions' },
      { name: 'Git', icon: 'git' },
      { name: 'Jest', icon: 'jest' },
      { name: 'Postman', icon: 'postman' },
    ],
  },
];

export const projects = [
  {
    title: 'Laboro - Control de horas',
    period: 'Ene 2026 - Feb 2026',
    description:
      'App gratuita para freelancers: registra jornadas, calcula cobro mensual y exporta a PDF/CSV. Funcionalidad offline completa, sin cuentas ni servidores.',
    highlights: [
      'Hasta 3 trabajos activos simultaneos',
      'Calendario visual con dias trabajados',
      'Exportacion a PDF y CSV',
      'Offline-first, sin cuentas ni internet',
    ],
    stack: ['Flutter', 'Dart', 'Offline-first'],
    type: 'App movil',
    icon: asset('laboro-icon.svg'),
  },
  {
    title: 'Data Practice Lab',
    period: '2025 - Actualidad',
    description:
      'Plataforma educativa para practicar Python orientado a Data Science. Editor integrado con Pyodide (Python en el navegador), sistema de niveles, EXP y ranking.',
    highlights: [
      'Python corriendo en el navegador con Pyodide',
      'Editor Ace con syntax highlighting',
      'Sistema de niveles, EXP y ranking',
      'Validacion automatica con tests',
    ],
    stack: ['Python', 'Pyodide', 'JavaScript', 'Ace Editor', 'HTML5'],
    type: 'Proyecto data',
    emoji: '🧪',
  },
  {
    title: 'Bot de Telegram - Futbol',
    period: '2025',
    description:
      'Bot automatizado con Python y GitHub Actions que envia resultados y noticias de las principales ligas europeas. Cero intervencion manual.',
    highlights: [
      'Datos de APIs de futbol en tiempo real',
      'Automatizacion con GitHub Actions (schedule)',
      'Distribucion automatica en Telegram',
    ],
    stack: ['Python', 'GitHub Actions', 'Telegram API'],
    type: 'Automatizacion',
    emoji: '⚽',
  },
  {
    title: 'NASA NEO Analyzer',
    period: '2025',
    description:
      'Exploracion y analisis de objetos cercanos a la Tierra usando la API publica de la NASA. Visualizaciones de datos astronomicos.',
    highlights: [
      'Consulta de API REST de la NASA',
      'Analisis con Pandas y Matplotlib',
      'Visualizaciones de trayectorias orbitales',
    ],
    stack: ['Python', 'Pandas', 'Matplotlib', 'REST APIs'],
    type: 'Proyecto data',
    emoji: '🪐',
  },
];

export const experience = [
  {
    date: 'Ene 2026 - Actualidad',
    role: 'Software Developer',
    company: 'OptiZure',
    details:
      'Desarrollo frontend con React, APIs REST con Node.js/Express, MySQL, gestion CI/CD con Azure DevOps y despliegue en Microsoft Azure.',
  },
  {
    date: 'Feb 2025 - Ago 2025',
    role: 'Full-Stack Developer',
    company: 'AppyWeb',
    details:
      'APIs REST con Node.js/Express, PostgreSQL + Prisma ORM, Redis, Docker, autenticacion JWT, app movil con React Native/Expo y automatizacion con n8n.',
  },
  {
    date: 'Mar 2017 - Jun 2017',
    role: 'Administrativo en practicas',
    company: 'MAPFRE',
    details: 'Soporte administrativo y atencion al cliente en entorno corporativo.',
  },
];

export const education = [
  {
    title: 'Master en Data Science & Desarrollo de IA',
    institution: 'Evolve Academy',
    period: 'Ene 2026 - Ago 2026',
    logo: asset('evolveacademy_logo.jpeg'),
  },
  {
    title: 'Programacion Python',
    institution: 'Escuela MUSK',
    period: 'Abr 2024 - Ene 2025',
    logo: asset('escuelamusk_logo.jpeg'),
  },
  {
    title: 'Grado Superior en Administracion y Finanzas',
    institution: 'Salesianos San Luis Rey',
    period: '2017 - 2020',
    logo: null,
  },
];
