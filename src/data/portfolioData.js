const asset = (fileName) => `${import.meta.env.BASE_URL}${fileName}`;

export const profile = {
  name: 'Jose Manuel Benitez Ruiz',
  role: 'Python Developer · Full Stack · Data Science & IA',
  location: 'Palma del Rio, Cordoba',
  email: 'josemanuelbenitezruiz14@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jose-manuel-benitez-ruiz/',
  github: 'https://github.com/jose98br',
  heroImage: asset('Gemini_Generated_Image_o63kfio63kfio63k.png'),
  summary:
    'Desarrollador con experiencia en Python, desarrollo web y movil, automatizacion de procesos con n8n y construccion de APIs REST. Actualmente cursando Master en Data Science & Desarrollo de IA en Evolve Academy.',
};

export const stats = [
  { label: 'Tecnologias', value: '15+' },
  { label: 'Anos de experiencia laboral', value: '8+' },
  { label: 'Certificaciones', value: '4+' },
];

export const skills = [
  {
    title: 'Lenguajes',
    items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Dart'],
  },
  {
    title: 'Frameworks y desarrollo',
    items: ['Flutter', 'Django', 'Flask', 'Node.js', 'Express', 'Prisma ORM'],
  },
  {
    title: 'Data & IA',
    items: ['Machine Learning', 'Analisis de datos', 'n8n', 'ChatGPT para desarrollo', 'GitHub Copilot'],
  },
  {
    title: 'Infra y herramientas',
    items: ['Docker', 'Git & GitHub', 'PostgreSQL', 'MongoDB', 'Redis', 'Postman'],
  },
];

export const projects = [
  {
    title: 'Laboro - Control de horas',
    period: 'Ene 2026 - Feb 2026',
    description:
      'App gratuita para registrar jornadas por horas y calcular cobro mensual. Funciona sin internet y sin cuentas.',
    highlights: [
      'Hasta 3 trabajos activos',
      'Registro de horas con descansos no pagados',
      'Calendario con dias trabajados por color',
      'Informes por trabajo',
      'Exportacion rapida a PDF y CSV',
      'Todo local, sin cuentas ni internet',
    ],
    stack: ['Flutter', 'Dart', 'PDF', 'CSV', 'Offline-first'],
    type: 'Proyecto destacado',
    icon: asset('laboro-icon.svg'),
  },
  {
    title: 'Portfolio profesional web',
    period: '2026',
    description:
      'Portfolio en React con secciones de proyectos, experiencia, educacion y habilidades. Incluye animaciones y modo claro/oscuro.',
    stack: ['React', 'JavaScript', 'Vite', 'Framer Motion', 'GitHub Pages'],
    type: 'Proyecto web',
    url: 'https://jose98br.github.io/porfolio/',
  },
  {
    title: 'NASA NEO Analyzer',
    period: '2025',
    description:
      'Exploracion de objetos cercanos a la Tierra con Python para consulta y analisis de datos astronomicos.',
    stack: ['Python', 'APIs', 'Analisis de datos'],
    type: 'Proyecto data',
    url: 'https://github.com/jose98br/NASA-NEO-Analyzer-Exploraci-n-de-Objetos-Cercanos-a-la-Tierra',
  },
  {
    title: 'Asistente virtual interestelar',
    period: '2025',
    description:
      'Proyecto de asistente virtual con enfoque experimental para automatizar interacciones por comandos.',
    stack: ['Python', 'Automatizacion'],
    type: 'Proyecto IA',
    url: 'https://github.com/jose98br/asistente-virtual-interestelar',
  },
];

export const experience = [
  {
    date: 'Feb 2025 - Ago 2025',
    role: 'Desarrollador Web y App + Automatizaciones',
    company: 'AppyWeb',
    details:
      'Desarrollo de aplicaciones web y moviles con integraciones de automatizacion para mejorar procesos internos.',
  },
  {
    date: '2022 - 2024',
    role: 'Mozo de almacen',
    company: 'Sunaran SAT',
    details: 'Gestion de inventario y logistica en entorno de alta demanda.',
  },
  {
    date: '2019 - 2024',
    role: 'Camarero',
    company: 'Catering El Palacio',
    details: 'Atencion al cliente, trabajo en equipo y coordinacion en eventos.',
  },
  {
    date: 'Mar 2017 - Jun 2017',
    role: 'Administrativo en practicas',
    company: 'MAPFRE',
    details: 'Soporte administrativo y atencion al cliente.',
  },
];

export const education = [
  {
    title: 'Master en Data Science & Desarrollo de IA',
    institution: 'Evolve Academy',
    period: 'Enero 2026 - Actualidad',
    logo: asset('evolveacademy_logo.jpeg'),
  },
  {
    title: 'Programacion Python',
    institution: 'Escuela Musk de Programacion',
    period: 'Abril 2024 - Enero 2025',
    logo: asset('escuelamusk_logo.jpeg'),
  },
  {
    title: 'Grado Superior en Administracion y Finanzas',
    institution: 'Salesianos San Luis Rey',
    period: '2017 - 2020',
    logo: null,
  },
];
