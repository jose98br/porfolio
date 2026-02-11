import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  education,
  experience,
  profile,
  projects,
  skills,
  stats,
} from './data/portfolioData';

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

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
    hints: [
      'Empieza por npm.',
      'Usa el script de desarrollo.',
      'Comando exacto: npm run dev',
    ],
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
    hints: [
      'Busca el script adecuado en package.json.',
      'Es un run script de npm.',
      'Comando exacto: npm run build',
    ],
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
    hints: [
      'No es dev ni build, es el paso posterior.',
      'Se ejecuta con npm run ...',
      'Comando exacto: npm run preview',
    ],
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

const normalize = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();

function SectionTitle({ overline, title }) {
  return (
    <motion.div className="section-title-wrap" {...fadeInUp}>
      <p className="overline">{overline}</p>
      <h2>{title}</h2>
    </motion.div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, active: false, id: 0 });
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
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    return () => {
      if (themeTimerRef.current) {
        window.clearTimeout(themeTimerRef.current);
      }
      if (rippleTimerRef.current) {
        window.clearTimeout(rippleTimerRef.current);
      }
    };
  }, []);

  const appendLines = (newLines) => {
    setTerminalHistory((prev) => [
      ...prev,
      ...newLines.map((line) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...line,
      })),
    ]);
  };

  const startLevel = (nextLevelKey) => {
    const nextLevel = challengeLevels[nextLevelKey];
    setLevelKey(nextLevelKey);
    setHintStep(0);
    setMistakes(0);
    setChallengeSolved(false);
    setTerminalInput('');
    setTerminalHistory([
      { id: 'boot-1', type: 'system', text: `Challenge cargado: ${nextLevel.label}` },
      { id: 'boot-2', type: 'system', text: `Mision: ${nextLevel.mission}` },
      { id: 'boot-3', type: 'system', text: 'Escribe `help` para ver comandos.' },
    ]);
  };

  const handleThemeToggle = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const id = Date.now();
    setRipple({ x, y, active: true, id });

    setThemeAnimating(true);
    const applyTheme = () => {
      setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    if (document.startViewTransition) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }

    if (themeTimerRef.current) {
      window.clearTimeout(themeTimerRef.current);
    }
    if (rippleTimerRef.current) {
      window.clearTimeout(rippleTimerRef.current);
    }
    themeTimerRef.current = window.setTimeout(() => {
      setThemeAnimating(false);
    }, 520);
    rippleTimerRef.current = window.setTimeout(() => {
      setRipple((prevRipple) => ({ ...prevRipple, active: false }));
    }, 650);
  };

  const handleTerminalSubmit = (event) => {
    event.preventDefault();
    const rawCommand = terminalInput;
    const command = normalize(rawCommand);

    if (!command) return;

    appendLines([{ type: 'input', text: `$ ${rawCommand}` }]);
    setTerminalInput('');

    if (command === 'exit') {
      setTerminalOpen(false);
      return;
    }

    if (!level) {
      appendLines([{ type: 'error', text: 'Selecciona un nivel antes de ejecutar comandos.' }]);
      return;
    }

    if (command === 'clear') {
      setTerminalHistory([]);
      return;
    }

    if (command === 'help') {
      appendLines(helpLines.map((line) => ({ type: 'system', text: line })));
      return;
    }

    if (command === 'mission') {
      appendLines([{ type: 'system', text: `Objetivo actual: ${level.mission}` }]);
      return;
    }

    if (command === 'ls') {
      appendLines([
        {
          type: 'system',
          text: Object.keys(level.files).join('  '),
        },
      ]);
      return;
    }

    if (command.startsWith('cat ')) {
      const fileName = command.replace('cat ', '').trim();
      if (level.files[fileName]) {
        appendLines([{ type: 'system', text: level.files[fileName] }]);
      } else {
        appendLines([{ type: 'error', text: `cat: ${fileName}: fichero no encontrado` }]);
      }
      return;
    }

    if (command === 'hint') {
      const hint = level.hints[Math.min(hintStep, level.hints.length - 1)];
      appendLines([{ type: 'system', text: `Hint ${Math.min(hintStep + 1, level.hints.length)}: ${hint}` }]);
      setHintStep((prev) => Math.min(prev + 1, level.hints.length - 1));
      return;
    }

    if (command === normalize(level.solution)) {
      setChallengeSolved(true);
      appendLines([
        { type: 'success', text: `✔ Desafio superado en ${level.label}` },
        { type: 'success', text: 'Buen nivel tecnico. Compartelo conmigo por LinkedIn.' },
        { type: 'system', text: `Comando correcto: ${level.solution}` },
      ]);
      return;
    }

    const nextMistake = mistakes + 1;
    setMistakes(nextMistake);
    const autoHint = level.hints[Math.min(nextMistake - 1, level.hints.length - 1)];
    appendLines([
      { type: 'error', text: 'Comando no valido para la mision actual.' },
      { type: 'system', text: `Pista automatica: ${autoHint}` },
    ]);
  };

  return (
    <div className="page-shell">
      <div
        key={ripple.id}
        className={`theme-ripple ${ripple.active ? 'active' : ''}`}
        style={{ '--ripple-x': `${ripple.x}px`, '--ripple-y': `${ripple.y}px` }}
        aria-hidden="true"
      />
      <div className={`theme-wash ${themeAnimating ? 'active' : ''}`} aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow bg-glow-a" aria-hidden="true" />
      <div className="bg-glow bg-glow-b" aria-hidden="true" />

      <header className="topbar">
        <a href="#inicio" className="brand">JM.</a>
        <div className="topbar-right">
          <nav>
            <a href="#proyectos">Proyectos</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            onClick={(event) => handleThemeToggle(event)}
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
        </div>
      </header>

      <main>
        <section id="inicio" className="hero section-limit">
          <motion.div className="hero-copy" {...fadeInUp}>
            <p className="kicker">Disponible para oportunidades tech</p>
            <h1>{profile.name}</h1>
            <p className="role">{profile.role}</p>
            <p className="summary">{profile.summary}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contacto">Hablemos</a>
              <a className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </motion.div>

          <motion.div className="hero-media" {...fadeInUp}>
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
          </motion.div>
        </section>

        <section id="proyectos" className="section-limit">
          <SectionTitle overline="Trabajo reciente" title="Proyectos destacados" />
          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                className="project-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <span className="chip">{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="stack-list">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-limit">
          <SectionTitle overline="Stack" title="Habilidades tecnicas" />
          <div className="skills-grid">
            {skills.map((group, index) => (
              <motion.article
                key={group.title}
                className="skills-card"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="experiencia" className="section-limit">
          <SectionTitle overline="Trayectoria" title="Experiencia y formacion" />
          <div className="columns-two">
            <div className="timeline">
              {experience.map((item, index) => (
                <motion.article
                  key={`${item.company}-${item.date}`}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
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
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  {item.logo ? <img src={item.logo} alt={item.institution} /> : <div className="edu-dot" aria-hidden="true" />}
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

        <section id="contacto" className="section-limit contact-wrap">
          <SectionTitle overline="Contacto" title="Construyamos algo potente" />
          <motion.div className="contact-card" {...fadeInUp}>
            <p>{profile.email}</p>
            <p>{profile.location}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>Enviar email</a>
              <a className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      </footer>

      <button
        type="button"
        className="easter-launch"
        onClick={() => setTerminalOpen(true)}
      >
        {'</>'} Terminal Challenge
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
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 22, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
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
                      onChange={(event) => setTerminalInput(event.target.value)}
                      placeholder="Escribe un comando..."
                      autoFocus
                    />
                    <button type="submit">run</button>
                  </form>

                  <div className="terminal-footer-actions">
                    <button type="button" onClick={() => startLevel(levelKey)}>Reiniciar nivel</button>
                    <button type="button" onClick={() => setLevelKey(null)}>Cambiar dificultad</button>
                    {challengeSolved && (
                      <a href={profile.linkedin} target="_blank" rel="noreferrer">
                        Compartir conmigo en LinkedIn
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
