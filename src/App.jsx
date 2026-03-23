import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import {
  education,
  experience,
  profile,
  projects,
  skills,
  stats,
} from './data/portfolioData';

// ─── Lenis smooth scroll + velocity CSS var ──────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let rafId;
    function raf(time) {
      lenis.raf(time);
      document.documentElement.style.setProperty('--sv', lenis.velocity.toFixed(3));
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

// ─── Custom cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', onMove);

    let rafId;
    const lerp = (a, b, t) => a + (b - a) * t;
    function tick() {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.1);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // Scale ring on hoverable elements
    const onEnter = () => ringRef.current?.classList.add('cursor-hover');
    const onLeave = () => ringRef.current?.classList.remove('cursor-hover');
    const targets = document.querySelectorAll('a, button, .project-card, .skill-tag');
    targets.forEach((el) => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      targets.forEach((el) => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

// ─── Line reveal — each word slides up from overflow:hidden parent ────────────
function LineReveal({ text, className, tag: Tag = 'span', delay = 0, italic = false }) {
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text} style={{ perspective: '800px' }}>
      {words.map((word, wi) => (
        <span key={wi} className="word-mask">
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotateX: -15, opacity: 0 }}
            whileInView={{ y: '0%', rotateX: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{
              duration: 0.75,
              delay: delay + wi * 0.06,
              ease: [0.14, 1, 0.34, 1],
            }}
          >
            {italic ? <em>{word}</em> : word}
          </motion.span>
          {' '}
        </span>
      ))}
    </Tag>
  );
}

// ─── Hero h1 — full split with rotateX 3D ────────────────────────────────────
function HeroTitle({ firstName, lastName }) {
  const allWords = [
    ...firstName.split(' ').map((w) => ({ word: w, italic: false })),
    ...lastName.split(' ').map((w) => ({ word: w, italic: true })),
  ];
  return (
    <h1 aria-label={`${firstName} ${lastName}`} style={{ perspective: '800px' }}>
      {allWords.map(({ word, italic }, wi) => (
        <span key={wi} className="word-mask">
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotateX: -18, opacity: 0 }}
            animate={{ y: '0%', rotateX: 0, opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.2 + wi * 0.12,
              ease: [0.14, 1, 0.34, 1],
            }}
          >
            {italic ? <em>{word}</em> : word}
          </motion.span>
          {' '}
        </span>
      ))}
    </h1>
  );
}

// ─── Counter — animated number on scroll ────────────────────────────────────
function Counter({ value }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const suffix = value.replace(/[\d]/g, '');
  const numeric = parseInt(value, 10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || isNaN(numeric)) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * numeric));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, numeric]);

  return <span ref={ref}>{isNaN(numeric) ? value : `${count}${suffix}`}</span>;
}

// ─── Marquee — infinite horizontal scroll ────────────────────────────────────
const marqueeItems = [
  { name: 'React', icon: 'react' },
  { name: 'Python', icon: 'python' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'Docker', icon: 'docker' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Flutter', icon: 'flutter' },
  { name: 'Azure', icon: 'microsoftazure' },
  { name: 'Framer', icon: 'framer' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'Prisma', icon: 'prisma' },
  { name: 'Redis', icon: 'redis' },
  { name: 'GitHub Actions', icon: 'githubactions' },
  { name: 'Pandas', icon: 'pandas' },
];

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-outer" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            <img src={`https://cdn.simpleicons.org/${item.icon}`} alt="" className="marquee-icon" loading="lazy" />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Magnetic button ─────────────────────────────────────────────────────────
function MagneticBtn({ children, className, href, onClick, target, rel }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * 0.28, y: (e.clientY - cy) * 0.28 });
  }, []);

  const onLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  const style = { transform: `translate(${pos.x}px, ${pos.y}px)`, transition: pos.x === 0 ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.1s linear' };

  if (href) return (
    <a ref={ref} className={className} href={href} target={target} rel={rel} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </a>
  );
  return (
    <button ref={ref} type="button" className={className} onClick={onClick} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </button>
  );
}

// ─── Parallax hero photo ─────────────────────────────────────────────────────
function HeroPhoto({ src, alt }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  return (
    <div ref={ref} className="hero-photo-wrap">
      <motion.img src={src} alt={alt} style={{ y }} />
    </div>
  );
}

// ─── Hero zoom-out on scroll ─────────────────────────────────────────────────
function HeroScrollZoom({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  return (
    <motion.div ref={ref} style={{ scale, opacity, y, transformOrigin: 'top center' }}>
      {children}
    </motion.div>
  );
}

// ─── 3-D card tilt on hover ──────────────────────────────────────────────────
// ─── Draw line — overline horizontal bar that grows left-to-right ────────────
function DrawLine({ delay = 0 }) {
  return (
    <motion.span
      className="draw-line"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// ─── Scroll-scrubbed zoom — follows scroll position, reverses on scroll up ────
function ScrollReveal({ children, tag = 'div', className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center 55%'],
  });
  const scale   = useTransform(scrollYProgress, [0, 1], [0.72, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const blur    = useTransform(scrollYProgress, [0, 0.5], [10, 0]);
  const filter  = useTransform(blur, (v) => `blur(${v}px)`);
  return tag === 'article' ? (
    <motion.article ref={ref} className={className} style={{ scale, opacity, y, filter }}>
      {children}
    </motion.article>
  ) : (
    <motion.div ref={ref} className={className} style={{ scale, opacity, y, filter }}>
      {children}
    </motion.div>
  );
}

// ─── Scroll-scrubbed tilt card (projects) ────────────────────────────────────
function ScrollTiltCard({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center 55%'],
  });
  const scale   = useTransform(scrollYProgress, [0, 1], [0.72, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [70, 0]);

  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const onMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (py - 0.5) * -12, y: (px - 0.5) * 12, gx: px * 100, gy: py * 100 });
  }, []);
  const onLeave = useCallback(() => setTilt({ x: 0, y: 0, gx: 50, gy: 50 }), []);

  return (
    <motion.article
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        scale,
        opacity,
        y,
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: 'preserve-3d',
        '--gx': `${tilt.gx}%`,
        '--gy': `${tilt.gy}%`,
        transition: tilt.x === 0 ? 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' : undefined,
      }}
    >
      {children}
    </motion.article>
  );
}

// ─── Framer Motion variants ──────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

// ─── Challenge levels ────────────────────────────────────────────────────────
const challengeLevels = {
  easy: {
    label: 'Nivel 1 · Easy',
    mission: 'Arranca el entorno de desarrollo local.',
    solution: 'npm run dev',
    files: {
      'clue_1.txt': 'Pista: aqui no desplegamos, primero arrancamos en local.',
      'clue_2.txt': 'Pista: piensa en el comando basico de Vite para desarrollo.',
      'notes.md': 'Recuerda: package.json contiene scripts utiles.',
    },
    hints: ['Empieza por npm.', 'Usa el script de desarrollo.', 'Comando exacto: npm run dev'],
  },
  medium: {
    label: 'Nivel 2 · Medium',
    mission: 'Genera una build de produccion optimizada.',
    solution: 'npm run build',
    files: {
      'clue_1.txt': 'Pista: no es dev, aqui toca empaquetar para produccion.',
      'clue_2.txt': 'Pista: usa el script que ejecuta vite build.',
      'deploy.md': 'Antes de subir, construye la carpeta dist.',
    },
    hints: ['Busca el script adecuado en package.json.', 'Es un run script de npm.', 'Comando exacto: npm run build'],
  },
  hard: {
    label: 'Nivel 3 · Hard',
    mission: 'Abre una preview local de la build para validarla.',
    solution: 'npm run preview',
    files: {
      'clue_1.txt': 'Pista: ya tienes dist, ahora hay que inspeccionarla en local.',
      'clue_2.txt': 'Pista: existe un script para previsualizar el build.',
      'ops.log': 'Validacion final: levantar servidor de preview.',
    },
    hints: ['No es dev ni build, es el paso posterior.', 'Se ejecuta con npm run ...', 'Comando exacto: npm run preview'],
  },
};

const helpLines = [
  'Comandos disponibles:',
  'help          -> muestra ayuda',
  'mission       -> ver objetivo del nivel',
  'ls            -> listar pistas',
  'cat <archivo> -> leer pista',
  'hint          -> pista progresiva',
  'clear         -> limpiar terminal',
  'exit          -> cerrar terminal',
];

const normalize = (v) => v.trim().replace(/\s+/g, ' ').toLowerCase();

// ─── Components ──────────────────────────────────────────────────────────────
function SectionTitle({ overline, title, em }) {
  return (
    <div className="section-title-wrap">
      <motion.p className="overline" {...fadeUp}>
        <DrawLine delay={0} />
        {overline}
      </motion.p>
      <h2 style={{ perspective: '800px' }}>
        <LineReveal text={title} delay={0.05} />
        {em && <>{' '}<LineReveal text={em} delay={0.15} italic /></>}
      </h2>
    </div>
  );
}

function SkillIcon({ slug }) {
  if (!slug) return null;
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt=""
      className="skill-icon"
      loading="lazy"
      aria-hidden="true"
    />
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  useLenis();

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [navOpen, setNavOpen] = useState(false);
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, active: false, id: 0 });

  // Terminal state
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [levelKey, setLevelKey] = useState(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [hintStep, setHintStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [challengeSolved, setChallengeSolved] = useState(false);

  const themeTimerRef = useRef(null);
  const rippleTimerRef = useRef(null);
  const terminalScrollRef = useRef(null);
  const level = useMemo(() => (levelKey ? challengeLevels[levelKey] : null), [levelKey]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    return () => {
      if (themeTimerRef.current) clearTimeout(themeTimerRef.current);
      if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    };
  }, []);

  const appendLines = (lines) => {
    setTerminalHistory((prev) => [
      ...prev,
      ...lines.map((l) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, ...l })),
    ]);
  };

  const startLevel = (key) => {
    const nl = challengeLevels[key];
    setLevelKey(key);
    setHintStep(0);
    setMistakes(0);
    setChallengeSolved(false);
    setTerminalInput('');
    setTerminalHistory([
      { id: 'b1', type: 'system', text: `Challenge cargado: ${nl.label}` },
      { id: 'b2', type: 'system', text: `Mision: ${nl.mission}` },
      { id: 'b3', type: 'system', text: 'Escribe `help` para ver comandos.' },
    ]);
  };

  const handleThemeToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const id = Date.now();
    setRipple({ x, y, active: true, id });
    setThemeAnimating(true);
    const apply = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
    if (themeTimerRef.current) clearTimeout(themeTimerRef.current);
    if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    themeTimerRef.current = setTimeout(() => setThemeAnimating(false), 520);
    rippleTimerRef.current = setTimeout(() => setRipple((r) => ({ ...r, active: false })), 650);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const raw = terminalInput;
    const cmd = normalize(raw);
    if (!cmd) return;
    appendLines([{ type: 'input', text: `$ ${raw}` }]);
    setTerminalInput('');

    if (cmd === 'exit') { setTerminalOpen(false); return; }
    if (!level) { appendLines([{ type: 'error', text: 'Selecciona un nivel antes de ejecutar comandos.' }]); return; }
    if (cmd === 'clear') { setTerminalHistory([]); return; }
    if (cmd === 'help') { appendLines(helpLines.map((t) => ({ type: 'system', text: t }))); return; }
    if (cmd === 'mission') { appendLines([{ type: 'system', text: `Objetivo: ${level.mission}` }]); return; }
    if (cmd === 'ls') { appendLines([{ type: 'system', text: Object.keys(level.files).join('  ') }]); return; }
    if (cmd.startsWith('cat ')) {
      const f = cmd.replace('cat ', '').trim();
      appendLines([{ type: level.files[f] ? 'system' : 'error', text: level.files[f] ?? `cat: ${f}: fichero no encontrado` }]);
      return;
    }
    if (cmd === 'hint') {
      const hint = level.hints[Math.min(hintStep, level.hints.length - 1)];
      appendLines([{ type: 'system', text: `Hint ${Math.min(hintStep + 1, level.hints.length)}: ${hint}` }]);
      setHintStep((p) => Math.min(p + 1, level.hints.length - 1));
      return;
    }
    if (cmd === normalize(level.solution)) {
      setChallengeSolved(true);
      appendLines([
        { type: 'success', text: `✔ Desafio superado en ${level.label}` },
        { type: 'success', text: 'Buen nivel tecnico. Compartelo conmigo por LinkedIn.' },
        { type: 'system', text: `Comando correcto: ${level.solution}` },
      ]);
      return;
    }
    const nm = mistakes + 1;
    setMistakes(nm);
    const autoHint = level.hints[Math.min(nm - 1, level.hints.length - 1)];
    appendLines([
      { type: 'error', text: 'Comando no valido para la mision actual.' },
      { type: 'system', text: `Pista automatica: ${autoHint}` },
    ]);
  };

  return (
    <div className="page-shell">
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* CSS scroll-driven progress bar */}
      <div className="scroll-progress" aria-hidden="true" />

      <div
        key={ripple.id}
        className={`theme-ripple ${ripple.active ? 'active' : ''}`}
        style={{ '--ripple-x': `${ripple.x}px`, '--ripple-y': `${ripple.y}px` }}
        aria-hidden="true"
      />
      <div className={`theme-wash ${themeAnimating ? 'active' : ''}`} aria-hidden="true" />

      {/* ── Topbar ── */}
      <header className="topbar">
        <a href="#inicio" className="brand">JM.</a>
        <div className="topbar-right">
          <nav className={navOpen ? 'nav-open' : ''}>
            <a href="#proyectos" onClick={() => setNavOpen(false)}>Proyectos</a>
            <a href="#habilidades" onClick={() => setNavOpen(false)}>Habilidades</a>
            <a href="#experiencia" onClick={() => setNavOpen(false)}>Experiencia</a>
            <a href="#contacto" onClick={() => setNavOpen(false)}>Contacto</a>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            onClick={handleThemeToggle}
            aria-label={`Activar modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            <motion.span
              className="theme-icon"
              key={theme}
              initial={{ rotate: -120, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </motion.span>
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <button
            className="hamburger"
            type="button"
            onClick={() => setNavOpen((p) => !p)}
            aria-label="Abrir menu"
          >
            <span className={`hamburger-icon ${navOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <HeroScrollZoom>
        <section id="inicio" className="hero section-limit">
          <div className="hero-copy">
            <motion.p
              className="kicker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Disponible para oportunidades tech
            </motion.p>

            <HeroTitle firstName={profile.firstName} lastName={profile.lastName} />

            <motion.p
              className="role"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
            >
              {profile.role}
            </motion.p>
            <motion.p
              className="summary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: 'easeOut' }}
            >
              {profile.summary}
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
            >
              <MagneticBtn className="btn btn-primary" href="#contacto">Hablemos</MagneticBtn>
              <MagneticBtn className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</MagneticBtn>
            </motion.div>
          </div>

          <div className="hero-media">
            <HeroPhoto src={profile.heroImage} alt={profile.name} />
            <div className="stat-strip">
              {stats.map((item) => (
                <div key={item.label} className="stat-box">
                  <strong><Counter value={item.value} /></strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        </HeroScrollZoom>

        {/* ── Marquee ── */}
        <Marquee />

        {/* ── Projects ── */}
        <section id="proyectos" className="section-limit">
          <SectionTitle overline="Trabajo reciente" title="Proyectos" em="destacados" />
          <div className="project-grid">
            {projects.map((project) => (
              <ScrollTiltCard key={project.title} className="project-card">
                <div className="project-head">
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="chip">{project.type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      {project.icon
                        ? <img src={project.icon} alt={project.title} className="project-icon" />
                        : project.emoji && <span className="project-emoji">{project.emoji}</span>
                      }
                      <div>
                        <h3>{project.title}</h3>
                        {project.period && <p className="project-period">{project.period}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <p>{project.description}</p>
                {project.highlights && (
                  <ul className="project-highlights">
                    {project.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                <div className="stack-list">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </ScrollTiltCard>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="habilidades" className="section-limit">
          <SectionTitle overline="Stack" title="Habilidades" em="técnicas" />
          <div className="skills-grid">
            {skills.map((group) => (
              <ScrollReveal key={group.title} tag="article" className="skills-card">
                <div className="skills-card-head">
                  <h3>{group.title}</h3>
                  {group.badge && <span className="badge-new">{group.badge}</span>}
                </div>
                <div className="skills-tags">
                  {group.items.map((item) => (
                    <span key={item.name} className="skill-tag">
                      <SkillIcon slug={item.icon} />
                      {item.name}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── Experience & Education ── */}
        <section id="experiencia" className="section-limit">
          <SectionTitle overline="Trayectoria" title="Experiencia" em="& formación" />
          <div className="columns-two">
            <div className="timeline">
              {experience.map((item) => (
                <ScrollReveal key={`${item.company}-${item.date}`} tag="article" className="timeline-item">
                    <p className="date">{item.date}</p>
                    <h3>{item.role}</h3>
                    <p className="company">{item.company}</p>
                    <p>{item.details}</p>
                  </ScrollReveal>
              ))}
            </div>

            <div className="edu-list">
              {education.map((item) => (
                <ScrollReveal key={`${item.institution}-${item.period}`} tag="article" className="edu-item">
                    {item.logo
                      ? <img src={item.logo} alt={item.institution} />
                      : <div className="edu-dot" aria-hidden="true" />
                    }
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.institution}</p>
                      <small>{item.period}</small>
                    </div>
                  </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contacto" className="section-limit contact-wrap">
          <SectionTitle overline="Contacto" title="Construyamos algo" em="potente" />
          <motion.div className="contact-card" {...fadeUp}>
            <p>{profile.email}</p>
            <p>{profile.location}</p>
            <div className="hero-actions" style={{ marginTop: '16px' }}>
              <MagneticBtn className="btn btn-primary" href={`mailto:${profile.email}`}>Enviar email</MagneticBtn>
              <MagneticBtn className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</MagneticBtn>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="footer section-limit">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      </footer>

      {/* ── Terminal Easter Egg ── */}
      <button
        type="button"
        className="easter-launch"
        onClick={() => setTerminalOpen(true)}
      >
        {'</>'} Challenge
      </button>

      <AnimatePresence>
        {terminalOpen && (
          <motion.aside
            className="easter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTerminalOpen(false)}
          >
            <motion.div
              className="easter-terminal"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="easter-head">
                <strong>JM Shell · Challenge Mode</strong>
                <button type="button" onClick={() => setTerminalOpen(false)}>cerrar</button>
              </div>

              {!level && (
                <div className="level-picker">
                  <p>Elige dificultad para empezar el reto:</p>
                  <div className="level-actions">
                    <button type="button" onClick={() => startLevel('easy')}>Nivel 1 · Easy</button>
                    <button type="button" onClick={() => startLevel('medium')}>Nivel 2 · Medium</button>
                    <button type="button" onClick={() => startLevel('hard')}>Nivel 3 · Hard</button>
                  </div>
                </div>
              )}

              {level && (
                <>
                  <div className="easter-status">
                    <span>{level.label}</span>
                    <span>Mision: {level.mission}</span>
                  </div>
                  <div className="terminal-screen" ref={terminalScrollRef}>
                    {terminalHistory.map((entry) => (
                      <p key={entry.id} className={`line-${entry.type}`}>{entry.text}</p>
                    ))}
                  </div>
                  <form className="terminal-input" onSubmit={handleTerminalSubmit}>
                    <span>$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Escribe un comando..."
                      autoFocus
                    />
                    <button type="submit">run</button>
                  </form>
                  <div className="terminal-footer-actions">
                    <button type="button" onClick={() => startLevel(levelKey)}>Reiniciar</button>
                    <button type="button" onClick={() => setLevelKey(null)}>Cambiar nivel</button>
                    {challengeSolved && (
                      <a href={profile.linkedin} target="_blank" rel="noreferrer">
                        Compartir en LinkedIn
                      </a>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
