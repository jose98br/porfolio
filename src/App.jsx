import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import {
  education,
  experience,
  profile,
  projects,
  skills,
  stats,
} from './data/portfolioData';

// ─── Lenis smooth scroll hook ───────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let rafId;
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
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
    <motion.div className="section-title-wrap" {...fadeUp}>
      <p className="overline">{overline}</p>
      <h2>{em ? <><span>{title} </span><em>{em}</em></> : title}</h2>
    </motion.div>
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
    // color-scheme permite usar light-dark() en CSS (2026)
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
      {/* CSS scroll-driven progress bar — no JS needed */}
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
        <section id="inicio" className="hero section-limit">
          {/* @starting-style maneja la animación de entrada — CSS puro, sin JS */}
          <div className="hero-copy">
            <p className="kicker">Disponible para oportunidades tech</p>
            <h1>
              {profile.firstName} <em>{profile.lastName}</em>
            </h1>
            <p className="role">{profile.role}</p>
            <p className="summary">{profile.summary}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contacto">Hablemos</a>
              <a className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-photo-wrap">
              <img src={profile.heroImage} alt={profile.name} />
            </div>
            <div className="stat-strip">
              {stats.map((item) => (
                <div key={item.label} className="stat-box">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="proyectos" className="section-limit">
          <SectionTitle overline="Trabajo reciente" title="Proyectos" em="destacados" />
          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                className="project-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
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
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="habilidades" className="section-limit">
          <SectionTitle overline="Stack" title="Habilidades" em="técnicas" />
          <div className="skills-grid">
            {skills.map((group, index) => (
              <motion.article
                key={group.title}
                className="skills-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
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
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── Experience & Education ── */}
        <section id="experiencia" className="section-limit">
          <SectionTitle overline="Trayectoria" title="Experiencia" em="& formación" />
          <div className="columns-two">
            <div className="timeline">
              {experience.map((item, index) => (
                <motion.article
                  key={`${item.company}-${item.date}`}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <p className="date">{item.date}</p>
                  <h3>{item.role}</h3>
                  <p className="company">{item.company}</p>
                  <p>{item.details}</p>
                </motion.article>
              ))}
            </div>

            <div className="edu-list">
              {education.map((item, index) => (
                <motion.article
                  key={`${item.institution}-${item.period}`}
                  className="edu-item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  {item.logo
                    ? <img src={item.logo} alt={item.institution} />
                    : <div className="edu-dot" aria-hidden="true" />
                  }
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.institution}</p>
                    <small>{item.period}</small>
                  </div>
                </motion.article>
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
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>Enviar email</a>
              <a className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
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
