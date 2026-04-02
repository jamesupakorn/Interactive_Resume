import React, { Component, Fragment, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Html, useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { LoopOnce } from "three";
import { content, skills } from "./data/resumeContent";
import {
  AVATAR_LAB_HASH,
  JOURNEY_START_Z,
  buildJourneyStops,
  getRoadX,
  getViewFromHash,
  normalizeMixamoClip,
} from "./utils/journeyUtils";

// Helper to build correct paths for models based on build base path
const getModelPath = (path) => `${import.meta.env.BASE_URL}${path}`;

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Unknown error" };
  }

  componentDidCatch(error) {
    console.error("Canvas render error:", error);
    console.error("Stack:", error?.stack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="canvas-fallback" style={{ flexDirection: "column", gap: "10px" }}>
          {this.props.fallback}
          <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: 0 }}>
            Debug: {this.state.errorMessage}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Shared TH/EN switch to keep nav and avatar header controls consistent.
function LanguageSwitch({ lang, setLang }) {
  return (
    <Fragment>
      <button
        type="button"
        className={`lang-btn${lang === "th" ? " active" : ""}`}
        onClick={() => setLang("th")}
      >
        TH
      </button>
      <button
        type="button"
        className={`lang-btn${lang === "en" ? " active" : ""}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </Fragment>
  );
}

function App() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("th");
  const [view, setView] = useState(() => getViewFromHash());
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [moveInput, setMoveInput] = useState({
    forward: false,
    backward: false,
    sprint: false,
  });

  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }, []);

  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") {
      return false;
    }

    return (
      /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }, []);

  const avatarDpr = isIOS ? [1, 1] : isTouchDevice ? [1, 1.15] : [1, 1.25];
  const resumeDpr = isIOS ? [1, 1] : isTouchDevice ? [1, 1.25] : [1, 1.5];
  const avatarGl = isIOS
    ? { antialias: true, alpha: true, powerPreference: "default" }
    : { antialias: false, alpha: false, powerPreference: "high-performance" };
  const resumeGl = isIOS
    ? { antialias: true, alpha: true, powerPreference: "default" }
    : { alpha: true, antialias: false, powerPreference: "high-performance" };

  const t = content[lang];
  const journeyStops = useMemo(() => buildJourneyStops(t), [t]);
  const activeStop = journeyStops[activeStopIndex] ??
    journeyStops[0] ?? {
      title: t.journeyIntroTitle,
      section: t.sections.profile,
      date: "",
      description: [t.avatarIntroLead],
    };

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => filter === "all" || skill.category === filter);
  }, [filter]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      mouseRef.current.x = event.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = event.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    setActiveStopIndex(0);
  }, [lang]);

  const openAvatarLab = () => {
    window.location.hash = AVATAR_LAB_HASH;
  };

  const openResume = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setView("resume");
  };

  if (view === "avatar") {
    const setMoveState = (nextState) => {
      setMoveInput((prev) => ({ ...prev, ...nextState }));
    };

    const resetMoveState = () => {
      setMoveInput({ forward: false, backward: false, sprint: false });
    };

    return (
      <div className="model-page-shell">
        <header className="model-page-header panel">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.avatarLabTitle}</h1>
          <p className="subtitle">{t.avatarLabDescription}</p>

          <div className="hero-actions">
            <button type="button" onClick={openResume}>
              {t.backToResume}
            </button>
            <button
              id="toggleTheme"
              type="button"
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            >
              {t.switchTheme}
            </button>
            <LanguageSwitch lang={lang} setLang={setLang} />
          </div>
        </header>

        <section className="model-viewer-panel panel">
          <div className="journey-layout">
            <div className="model-viewer-canvas">
              <CanvasErrorBoundary
                fallback={<div className="canvas-fallback">3D viewer unavailable.</div>}
              >
                <Canvas
                  dpr={avatarDpr}
                  camera={{ fov: 38, near: 0.1, far: 220, position: [0, 1.7, 6] }}
                  gl={avatarGl}
                  fallback={<div className="canvas-fallback">อุปกรณ์นี้ไม่รองรับ 3D canvas</div>}
                >
                  <Suspense fallback={null}>
                    <JourneyScene
                      activeStopIndex={activeStopIndex}
                      onStopChange={setActiveStopIndex}
                      moveInput={moveInput}
                      theme={theme}
                      timelineStops={journeyStops}
                    />
                  </Suspense>
                </Canvas>
              </CanvasErrorBoundary>
              <div
                className="touch-controls in-canvas"
                role="group"
                aria-label="Avatar movement controls"
              >
                <button
                  type="button"
                  onPointerDown={() => setMoveState({ forward: true, backward: false })}
                  onPointerUp={resetMoveState}
                  onPointerCancel={resetMoveState}
                  onPointerLeave={resetMoveState}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  ↑ เดินหน้า
                </button>
                <button
                  type="button"
                  onPointerDown={() => setMoveState({ backward: true, forward: false })}
                  onPointerUp={resetMoveState}
                  onPointerCancel={resetMoveState}
                  onPointerLeave={resetMoveState}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  ↓ ถอยหลัง
                </button>
                <button
                  type="button"
                  onPointerDown={() =>
                    setMoveState({ sprint: true, backward: true, forward: false })
                  }
                  onPointerUp={resetMoveState}
                  onPointerCancel={resetMoveState}
                  onPointerLeave={resetMoveState}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  ⚡ เร่ง
                </button>
              </div>
            </div>

            <aside className="journey-sidebar">
              <div className="journey-current-card">
                <p className="eyebrow">{t.avatarJourneyNow}</p>
                <h2>{activeStop.title}</h2>
                <p className="journey-stop-section">{activeStop.section}</p>
                {activeStop.date ? <p className="journey-date">{activeStop.date}</p> : null}
                {activeStopIndex === 0 ? (
                  <p className="journey-current-role">{t.subtitle}</p>
                ) : null}
                {activeStop.description.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            </aside>
          </div>
          <p className="model-viewer-hint">{t.avatarLabHint}</p>
        </section>
      </div>
    );
  }

  return (
    <Fragment>
      <CanvasErrorBoundary fallback={null}>
        <Canvas
          id="bg-canvas"
          dpr={resumeDpr}
          camera={{ fov: 37, near: 0.1, far: 120, position: [0, 1.78, 1.78] }}
          gl={resumeGl}
          fallback={null}
        >
          <Suspense fallback={null}>
            <SceneContent mouseRef={mouseRef} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>

      <nav className="site-nav">
        <a className="site-nav-brand" href="#profile">
          {t.name}
        </a>
        <div className="site-nav-links">
          {t.navLinks.map((link) => (
            <a key={link.href} href={link.href} className="site-nav-link">
              {link.label}
            </a>
          ))}
        </div>
        <div className="site-nav-controls">
          <button type="button" className="btn-journey-sm" onClick={openAvatarLab}>
            {t.openAvatarLab}
          </button>
          <div className="site-nav-lang">
            <LanguageSwitch lang={lang} setLang={setLang} />
          </div>
          <button
            id="toggleTheme"
            type="button"
            className="theme-btn"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            aria-label={t.switchTheme}
          >
            {theme === "light" ? "🌙" : "☀"}
          </button>
        </div>
      </nav>

      <div className="page-shell">
        <header className="hero" id="profile">
          <div className="hero-body">
            <div className="hero-text">
              <span className="hero-available">{t.availableLabel}</span>
              <h1>{t.name}</h1>
              <p className="subtitle">{t.subtitle}</p>
              <p className="hero-bio">{t.profileSummary}</p>
              <div className="hero-cta">
                <a className="btn-primary" href="#contact">
                  {t.contactBtn}
                </a>
                <button type="button" className="btn-secondary" onClick={openAvatarLab}>
                  {t.openAvatarLab} →
                </button>
              </div>
            </div>
            <div className="hero-stats-col">
              {t.heroStats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main>
          <section className="panel" id="skills">
            <div className="section-head">
              <h2>{t.sections.skills}</h2>
              <div className="filters" role="group" aria-label="Skill filters">
                {["all", "expert", "intermediate", "basic", "database", "tools"].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${filter === cat ? "active" : ""}`}
                    data-filter={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                  >
                    {t.filters[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div id="skillGrid" className="skill-grid">
              {filteredSkills.map((skill) => (
                <article className="skill-card" key={skill.name}>
                  <div className="name">{skill.name}</div>
                  <div className="meta">{t.skillLevel[skill.category]}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel" id="experience">
            <h2>{t.sections.experience}</h2>
            <div id="timeline" className="timeline">
              {t.experiences.map((item) => (
                <article className="entry" key={`${item.title}-${item.date}`}>
                  <div className="title">{item.title}</div>
                  <div className="date">{item.date}</div>
                  {item.description.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section className="panel" id="soft-skills">
            <h2>{t.sections.softSkills}</h2>
            {t.softSkills.map((skill) => (
              <p key={skill}>{skill}</p>
            ))}
          </section>

          <section className="panel" id="education">
            <h2>{t.sections.education}</h2>
            {t.education.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </section>

          <section className="panel" id="portfolio">
            <h2>{t.sections.portfolio}</h2>
            <div className="portfolio-grid">
              {t.portfolio.map((project) => (
                <article className="portfolio-card" key={project.title}>
                  <div className="portfolio-title">{project.title}</div>
                  <p className="portfolio-desc">{project.description}</p>
                  <div className="portfolio-tech">
                    {project.tech.map((tag) => (
                      <span className="tech-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a className="portfolio-link" href={project.url} target="_blank" rel="noreferrer">
                    {project.label} →
                  </a>
                </article>
              ))}
            </div>

            <p>{t.repoTitle}</p>
            <div className="contact-actions">
              {t.repositories.map((repo) => (
                <a key={repo.url} href={repo.url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
              ))}
            </div>
          </section>

          <section className="panel" id="contact">
            <h2>{t.sections.contact}</h2>
            <div className="contact-actions">
              <a href="tel:+66937720044">{t.contact.phone}</a>
              <a href="mailto:jamesupakorn@hotmail.com">{t.contact.email}</a>
              <a href="https://line.me/R/ti/p/%40manofmoon" target="_blank" rel="noreferrer">
                {t.contact.line}
              </a>
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}

function JourneyScene({ activeStopIndex, onStopChange, moveInput, theme, timelineStops }) {
  const roadColor = theme === "light" ? "#c6b18b" : "#1a2b3a";
  const roadStripeColor = theme === "light" ? "#efe2c6" : "#496b7f";
  const groundColor = theme === "light" ? "#efe4d2" : "#07131e";
  const segmentCount = Math.max(28, timelineStops.length * 4);
  const roadSegments = Array.from({ length: segmentCount }, (_, index) => {
    const z = JOURNEY_START_Z - index * 2.2;
    const x = getRoadX(z);
    const aheadX = getRoadX(z - 0.35);
    const angle = Math.atan2(aheadX - x, -0.35);

    return { angle, index, x, z };
  });

  return (
    <>
      <color attach="background" args={[groundColor]} />
      <fog attach="fog" args={[groundColor, 10, 92]} />
      <ambientLight intensity={1.15} />
      <directionalLight intensity={1.9} position={[5, 8, 5]} />
      <directionalLight intensity={0.8} position={[-6, 5, -4]} color="#2fd4c7" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.21, -44]} receiveShadow>
        <planeGeometry args={[70, 160]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {roadSegments.map((segment) => (
        <group key={segment.index} position={[segment.x, 0, segment.z]}>
          <mesh position={[0, -1.13, 0]} rotation={[0, segment.angle, 0]}>
            <boxGeometry args={[3.4, 0.08, 2.4]} />
            <meshStandardMaterial color={roadColor} roughness={0.92} />
          </mesh>
          <mesh position={[0, -1.085, 0]} rotation={[0, segment.angle, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.88]} />
            <meshStandardMaterial color={roadStripeColor} emissive={roadStripeColor} />
          </mesh>
        </group>
      ))}

      {timelineStops.map((stop, index) => {
        const pinOffset = stop.side * 2.7;
        const isActive = index === activeStopIndex;
        const stopState = isActive ? "current" : "hidden";

        if (!isActive) {
          return null;
        }

        const stopOpacity = 1;

        return (
          <group key={`${stop.title}-${index}`} position={[stop.x, 0, stop.z]}>
            <mesh position={[0, -0.98, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 18]} />
              <meshStandardMaterial
                color={isActive ? "#ff8a3c" : "#2fd4c7"}
                transparent
                opacity={stopOpacity}
              />
            </mesh>
            <mesh position={[pinOffset * 0.5, -0.82, 0]} rotation={[0, 0, 0.08 * stop.side]}>
              <boxGeometry args={[Math.abs(pinOffset), 0.03, 0.03]} />
              <meshStandardMaterial
                color={theme === "light" ? "#94744d" : "#88aab8"}
                transparent
                opacity={stopOpacity}
              />
            </mesh>
            <mesh position={[pinOffset, -0.18, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.15, 12]} />
              <meshStandardMaterial
                color={theme === "light" ? "#70593d" : "#8ab9ca"}
                transparent
                opacity={stopOpacity}
              />
            </mesh>
            <Html position={[pinOffset, 0.62, 0]} distanceFactor={11}>
              <div
                style={{
                  transform: `translateX(${stop.side === -1 ? "0%" : "-100%"}) translateY(-50%)`,
                }}
              >
                <div className={`journey-pin ${stopState}${isActive ? " active" : ""}`}>
                  <div className="journey-pin-section">{stop.section}</div>
                  <div className="journey-pin-title">{stop.title}</div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      <AvatarModel
        moveInput={moveInput}
        onStopChange={onStopChange}
        timelineStops={timelineStops}
      />
    </>
  );
}

function AvatarModel({ moveInput, onStopChange, timelineStops }) {
  const gltf = useGLTF(getModelPath("models/Supakorn.glb"));
  const walkingFbx = useFBX(getModelPath("models/Walking.fbx"));
  const runningFbx = useFBX(getModelPath("models/Run.fbx"));
  const avatarRef = useRef();
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const keysRef = useRef({
    forward: false,
    backward: false,
    sprint: false,
  });
  const movingRef = useRef("idle");
  const activeStopRef = useRef(0);
  const baseYRef = useRef(-1.15);

  const idleClip = useMemo(() => {
    const sourceClips = gltf.animations ?? [];
    return (
      sourceClips.find((clip) => /idle|breath|stand|pose/i.test(clip.name)) ??
      sourceClips[0] ??
      null
    );
  }, [gltf.animations]);

  const walkClip = useMemo(() => {
    return normalizeMixamoClip(walkingFbx.animations?.[0], "Walk");
  }, [walkingFbx]);

  const runClip = useMemo(() => {
    return normalizeMixamoClip(runningFbx.animations?.[0], "Run");
  }, [runningFbx]);

  const animationClips = useMemo(() => {
    const clips = [];
    if (idleClip) {
      clips.push(idleClip);
    }
    if (walkClip) {
      clips.push(walkClip);
    }
    if (runClip) {
      clips.push(runClip);
    }
    return clips;
  }, [idleClip, walkClip, runClip]);

  const { actions } = useAnimations(animationClips, scene);

  useEffect(() => {
    const firstStop = timelineStops[0];

    if (avatarRef.current && firstStop) {
      avatarRef.current.position.set(firstStop.x, baseYRef.current, firstStop.z);
      avatarRef.current.rotation.y = Math.PI;
    }

    movingRef.current = "idle";
    activeStopRef.current = 0;
    onStopChange?.(0);
  }, [onStopChange, timelineStops]);

  useEffect(() => {
    const idleAction = idleClip ? actions[idleClip.name] : null;
    const walkAction = actions.Walk;
    const runAction = actions.Run;

    if (idleAction) {
      idleAction.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).play();
    }

    walkAction?.reset().setEffectiveWeight(0).setEffectiveTimeScale(0.9).play();
    runAction?.reset().setEffectiveWeight(0).setEffectiveTimeScale(1.15).play();

    return () => {
      idleAction?.stop();
      walkAction?.stop();
      runAction?.stop();
    };
  }, [actions, idleClip]);

  useEffect(() => {
    const setKeyState = (event, isPressed) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keysRef.current.forward = isPressed;
          break;
        case "KeyS":
        case "ArrowDown":
          keysRef.current.backward = isPressed;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keysRef.current.sprint = isPressed;
          break;
        default:
          break;
      }
    };

    const handleKeyDown = (event) => setKeyState(event, true);
    const handleKeyUp = (event) => setKeyState(event, false);
    const resetKeys = () => {
      keysRef.current = {
        forward: false,
        backward: false,
        sprint: false,
      };
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", resetKeys);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", resetKeys);
    };
  }, []);

  useFrame(({ camera, clock }, delta) => {
    if (!avatarRef.current || timelineStops.length === 0) {
      return;
    }

    const allZ = timelineStops.map((stop) => stop.z);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);
    const isForward = keysRef.current.forward || moveInput.forward;
    const isBackward = keysRef.current.backward || moveInput.backward;
    const isSprint = keysRef.current.sprint || moveInput.sprint;
    const moveZ = Number(isBackward) - Number(isForward);
    const isMoving = moveZ !== 0;
    const speed = isSprint ? 4.6 : 2.4;
    const nextZ = Math.min(
      maxZ,
      Math.max(minZ, avatarRef.current.position.z + moveZ * speed * delta)
    );

    avatarRef.current.position.z = nextZ;

    const targetRoadX = getRoadX(nextZ);
    avatarRef.current.position.x += (targetRoadX - avatarRef.current.position.x) * 0.18;

    if (isMoving) {
      const pathStep = moveZ > 0 ? 0.35 : -0.35;
      const lookX = getRoadX(nextZ + pathStep) - targetRoadX;
      avatarRef.current.rotation.y = Math.atan2(lookX, pathStep);
      avatarRef.current.position.y =
        baseYRef.current + Math.abs(Math.sin(clock.elapsedTime * 10)) * 0.05;
    } else {
      avatarRef.current.position.y += (baseYRef.current - avatarRef.current.position.y) * 0.12;
    }

    const idleAction = idleClip ? actions[idleClip.name] : null;
    const walkAction = actions.Walk;
    const runAction = actions.Run;
    const activeState = isMoving ? (isSprint ? "run" : "walk") : "idle";

    if (activeState !== movingRef.current) {
      const previousState = movingRef.current;
      movingRef.current = activeState;

      const previousAction =
        previousState === "run" ? runAction : previousState === "walk" ? walkAction : idleAction;
      const nextAction =
        activeState === "run" ? runAction : activeState === "walk" ? walkAction : idleAction;

      if (previousAction && previousAction !== nextAction) {
        previousAction.fadeOut(0.22);
      }

      if (nextAction) {
        nextAction.reset().setEffectiveWeight(1).fadeIn(0.22).play();
      }
    }

    walkAction?.setEffectiveTimeScale(0.9);
    runAction?.setEffectiveTimeScale(1.15);

    // Find the closest stop based on actual distance
    let closestIndex = activeStopRef.current;
    let closestDistance = Math.abs(timelineStops[closestIndex].z - nextZ);

    for (let i = 0; i < timelineStops.length; i++) {
      const distance = Math.abs(timelineStops[i].z - nextZ);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    // Only switch if moving toward the new stop and past its midpoint from current stop
    if (closestIndex !== activeStopRef.current) {
      const currentStopZ = timelineStops[activeStopRef.current].z;
      const nextStopZ = timelineStops[closestIndex].z;
      const midpoint = (currentStopZ + nextStopZ) / 2;

      // Moving forward (Z decreasing) toward a stop with smaller Z?
      // Or moving backward (Z increasing) toward a stop with larger Z?
      const isMovingTowardNewStop =
        (nextStopZ < currentStopZ && nextZ < midpoint) ||
        (nextStopZ > currentStopZ && nextZ > midpoint);

      if (isMovingTowardNewStop) {
        activeStopRef.current = closestIndex;
        onStopChange?.(closestIndex);
      }
    }

    const avatarPos = avatarRef.current.position;
    const targetCameraX = avatarPos.x + 0.55;
    const targetCameraY = 1.85;
    const targetCameraZ = avatarPos.z + 5.5;

    camera.position.x += (targetCameraX - camera.position.x) * 0.09;
    camera.position.y += (targetCameraY - camera.position.y) * 0.09;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.09;
    camera.lookAt(avatarPos.x, 0.82, avatarPos.z - 2.4);
  });

  return (
    <group ref={avatarRef} position={[0, -1.15, JOURNEY_START_Z]}>
      <primitive object={scene} />
    </group>
  );
}

function SceneContent({ mouseRef }) {
  const modelRef = useRef();
  const particlesRef = useRef();
  const suitModel = useGLTF(getModelPath("models/supakorn_suit_Tpost.glb"));
  const standingPoseFbx = useFBX(getModelPath("models/Male%20Standing%20Pose.fbx"));
  const modelScene = useMemo(() => clone(suitModel.scene), [suitModel.scene]);

  const standingClip = useMemo(() => {
    return normalizeMixamoClip(standingPoseFbx.animations?.[0], "StandPose");
  }, [standingPoseFbx]);

  const standClips = useMemo(() => {
    return standingClip ? [standingClip] : [];
  }, [standingClip]);

  const { actions: standActions } = useAnimations(standClips, modelScene);

  useEffect(() => {
    const standAction = standActions.StandPose;

    if (!standAction) {
      return;
    }

    standAction.reset();
    standAction.clampWhenFinished = true;
    standAction.setLoop(LoopOnce, 1);
    standAction.play();

    return () => {
      standAction.stop();
    };
  }, [standActions]);

  const positions = useMemo(() => {
    const particlesCount = 900;
    const generated = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i += 1) {
      const i3 = i * 3;
      generated[i3] = (Math.random() - 0.5) * 14;
      generated[i3 + 1] = (Math.random() - 0.5) * 10;
      generated[i3 + 2] = (Math.random() - 0.5) * 12;
    }

    return generated;
  }, []);

  useFrame(({ camera }) => {
    if (!modelRef.current || !particlesRef.current) {
      return;
    }

    const { x, y } = mouseRef.current;

    modelRef.current.rotation.y += 0.006;
    modelRef.current.position.x += (x * 0.55 - modelRef.current.position.x) * 0.03;
    modelRef.current.position.y += (-0.62 + -y * 0.08 - modelRef.current.position.y) * 0.03;

    particlesRef.current.rotation.y += 0.0008;
    particlesRef.current.rotation.x += 0.0004;

    camera.position.x += (x * 0.3 - camera.position.x) * 0.03;
    camera.position.y += (1.72 - y * 0.05 - camera.position.y) * 0.03;
    camera.lookAt(0, 1.58, 0);
  });

  return (
    <Fragment>
      <pointLight color="#2fd4c7" intensity={2.3} distance={20} position={[2.5, 2.2, 2.3]} />
      <pointLight color="#ff8a3c" intensity={1.8} distance={20} position={[-2.4, -1.8, 2.2]} />
      <ambientLight intensity={0.26} />

      <group ref={modelRef} position={[0, -0.62, 0]} rotation={[0, Math.PI, 0]} scale={1.45}>
        <primitive object={modelScene} />
      </group>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffbe8f" size={0.025} transparent opacity={0.9} />
      </points>
    </Fragment>
  );
}

useGLTF.preload(getModelPath("models/Supakorn.glb"));
useGLTF.preload(getModelPath("models/supakorn_suit_Tpost.glb"));
useFBX.preload(getModelPath("models/Walking.fbx"));
useFBX.preload(getModelPath("models/Male%20Standing%20Pose.fbx"));

export default App;
