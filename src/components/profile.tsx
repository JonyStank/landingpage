"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  User,
  GraduationCap,
  Code2,
  TrendingUp,
  BookOpen,
  BarChart3,
  MapPin,
  Calendar,
  FolderGit2,
  Trophy,
  Zap,
  ChevronDown,
  Sparkles,
  Lightbulb,
} from "lucide-react";

/* ────────────── Data ────────────── */

const skills = [
  { name: "Python", level: 85, description: "Data analysis, automation, algorithmic trading" },
  { name: "JavaScript", level: 80, description: "React, Node.js, web development" },
  { name: "TypeScript", level: 75, description: "Type-safe applications, interfaces" },
  { name: "SQL", level: 70, description: "Database design, queries, optimization" },
];

const radarSkills = [
  { label: "Frontend", value: 82 },
  { label: "Backend", value: 68 },
  { label: "Algorithms", value: 90 },
  { label: "DevOps", value: 55 },
  { label: "Database", value: 75 },
  { label: "Mobile", value: 40 },
];

const interests = [
  {
    name: "Crypto Market Analysis",
    icon: TrendingUp,
    description: "Price patterns, on-chain metrics, sentiment analysis",
    details: [
      "Tracking 50+ cryptocurrency pairs daily",
      "Building custom sentiment analysis models with NLP",
      "Contributing to open-source on-chain analytics tools",
    ],
  },
  {
    name: "Algorithmic Trading",
    icon: Code2,
    description: "Strategy development, backtesting, execution",
    details: [
      "Implemented momentum and mean-reversion strategies",
      "Backtested across 3 years of historical data",
      "Optimized execution latency to sub-second levels",
    ],
  },
  {
    name: "Financial Analysis",
    icon: BarChart3,
    description: "Fundamental analysis, risk assessment, valuation",
    details: [
      "Modeled DCF valuations for tech companies",
      "Built risk assessment dashboards with real-time data",
      "Published sector analysis reports for university finance club",
    ],
  },
];

const statsData = [
  { label: "Projects", value: 3, max: 5, icon: FolderGit2 },
  { label: "Experience", value: 2, suffix: "yr", max: 4, icon: Trophy },
  { label: "Technologies", value: 8, max: 12, icon: Zap },
];

const learningItems = ["React", "TypeScript", "Next.js", "Algorithms"];

const funFacts = [
  { emoji: "🐛", text: "Debugged 10,000+ lines of code", back: "Mostly at 2 AM. The best bugs always hide in the most obvious places." },
  { emoji: "🌙", text: "Best coding hours: 11 PM – 3 AM", back: "The night is peaceful, distractions are zero, and that's when the best algorithms are born." },
  { emoji: "🎮", text: "Built first game at age 14", back: "A simple Python text adventure game. It had 20 rooms and a dragon boss. Nostalgia!" },
  { emoji: "📚", text: "Read 50+ tech articles this year", back: "From MDN docs to obscure RFCs. Strong opinions, loosely held, and always learning." },
];

/* ────────────── Helper Components ────────────── */

function getSkillBadge(level: number) {
  if (level >= 85) return { label: "Expert", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
  if (level >= 70) return { label: "Advanced", className: "bg-teal-500/15 text-teal-400 border-teal-500/20" };
  return { label: "Intermediate", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
}

function CountUp({ target, decimals = 0, duration = 1.5, onComplete }: { target: number; decimals?: number; duration?: number; onComplete?: () => void }) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const handleComplete = useCallback(() => {
    setFinished(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Number((eased * target).toFixed(decimals)));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              handleComplete();
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimals, duration, handleComplete]);

  return (
    <span ref={ref} className={finished ? "sparkle-finished" : ""}>
      {count.toFixed(decimals)}
    </span>
  );
}

function CyclingText({ items, interval = 2000 }: { items: string[]; interval?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = items[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, interval);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length - 1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 40);
      }
    }

    timeoutRef.current = timeout;
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, isDeleting, currentIndex, items, interval]);

  return (
    <span className="text-sm text-emerald-400/80">
      Currently learning: <span className="font-medium text-emerald-400">{displayed}</span>
      <span className="typing-cursor" />
    </span>
  );
}

function StatCard({ stat }: { stat: typeof statsData[number] }) {
  const [sparkleKey, setSparkleKey] = useState(0);

  return (
    <div
      className="stat-card flex flex-col items-center gap-1.5 rounded-lg border border-border/30 bg-secondary/5 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-secondary/10 hover:shadow-lg hover:shadow-emerald-500/5"
    >
      <stat.icon className="size-4 text-emerald-400/70" />
      <span className="text-xl font-bold text-foreground">
        <CountUp
          target={stat.value}
          decimals={stat.decimals ?? 0}
          duration={1.2}
          onComplete={() => setSparkleKey((k) => k + 1)}
        />
        {stat.suffix ? (
          <span className="text-sm font-normal text-muted-foreground">
            {stat.suffix}
          </span>
        ) : null}
      </span>
      <span className="text-[11px] text-muted-foreground/60">{stat.label}</span>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((stat.value / (stat.max ?? 100)) * 100)}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-teal-400/60"
        />
      </div>
    </div>
  );
}

/* ────────────── Scroll Reveal Hook ────────────── */

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ScrollRevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GradientSeparator() {
  return <hr className="gradient-separator my-2" />;
}

/* ────────────── Radar Chart ────────────── */

function RadarChart() {
  const { ref, visible } = useScrollReveal(0.25);
  const [tooltip, setTooltip] = useState<{ label: string; value: number; x: number; y: number } | null>(null);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 85;
  const levels = 4;
  const n = radarSkills.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function polarToCart(angle: number, r: number) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const gridLines = useMemo(() => {
    const lines: string[] = [];
    for (let l = 1; l <= levels; l++) {
      const r = (maxR / levels) * l;
      const pts: string[] = [];
      for (let i = 0; i < n; i++) {
        const p = polarToCart(startAngle + i * angleStep, r);
        pts.push(`${p.x},${p.y}`);
      }
      lines.push(pts.join(" "));
    }
    return lines;
  }, []);

  const axisLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < n; i++) {
      const p = polarToCart(startAngle + i * angleStep, maxR);
      lines.push({ x1: cx, y1: cy, x2: p.x, y2: p.y });
    }
    return lines;
  }, []);

  const dataPoints = useMemo(() => {
    return radarSkills.map((s, i) => {
      const r = (s.value / 100) * maxR;
      return polarToCart(startAngle + i * angleStep, r);
    });
  }, []);

  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labelPositions = radarSkills.map((s, i) => {
    const r = maxR + 16;
    return polarToCart(startAngle + i * angleStep, r);
  });

  return (
    <div ref={ref} className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid */}
        {gridLines.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="1" />
        ))}
        {/* Axes */}
        {axisLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="oklch(1 0 0 / 6%)" strokeWidth="1" />
        ))}
        {/* Data shape */}
        {visible && (
          <>
            <polygon
              points={dataPath}
              fill="oklch(0.7 0.15 160 / 15%)"
              stroke="oklch(0.7 0.15 160 / 70%)"
              strokeWidth="2"
              className="radar-shape-animate"
            />
            <polygon
              points={dataPath}
              fill="oklch(0.7 0.15 160 / 10%)"
              className="radar-fill-animate"
            />
          </>
        )}
        {/* Data points */}
        {visible && dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="oklch(0.7 0.15 160)"
            stroke="oklch(0.155 0 0)"
            strokeWidth="1.5"
            className="radar-fill-animate"
            onMouseEnter={() => setTooltip({ label: radarSkills[i].label, value: radarSkills[i].value, x: p.x, y: p.y })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: "pointer" }}
          />
        ))}
        {/* Labels */}
        {labelPositions.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] fill-muted-foreground/70 select-none"
            style={{ fontSize: "9px" }}
          >
            {radarSkills[i].label}
          </text>
        ))}
        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 30}
              y={tooltip.y - 28}
              width={60}
              height={22}
              rx={4}
              fill="oklch(0.2 0 0)"
              stroke="oklch(1 0 0 / 10%)"
              strokeWidth="1"
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 14}
              textAnchor="middle"
              className="text-[9px] fill-emerald-400 select-none"
              style={{ fontSize: "9px", fontWeight: 600 }}
            >
              {tooltip.label} {tooltip.value}%
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ────────────── Main Component ────────────── */

export default function Profile() {
  const [expandedInterest, setExpandedInterest] = useState<number | null>(null);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [flippedFact, setFlippedFact] = useState<number | null>(null);

  // Parallax scroll offset for avatar
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = Math.min(scrollY * 0.15, 20);

  return (
    <main className="relative flex flex-1 items-start justify-center px-4 py-16 sm:px-6">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-30" />
      <div className="relative w-full max-w-2xl space-y-6">

        {/* ═══════════ 1. Avatar & Header ═══════════ */}
        <ScrollRevealSection>
          <Card className="border-border/40 bg-card/40 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-secondary/80 via-secondary/40 to-secondary/80" />
            <CardHeader className="-mt-8">
              <CardTitle className="flex items-center gap-4 text-xl">
                <div className="relative" style={{ transform: `translateY(${parallaxOffset}px)` }}>
                  {/* Pulse ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-400/20 avatar-pulse-ring" />
                  {/* Rainbow shimmer ring on hover */}
                  <div
                    className={`absolute -inset-0.5 rounded-full transition-opacity duration-500 ${
                      avatarHovered ? "rainbow-ring opacity-100" : "animate-spin-slow opacity-70 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                    }`}
                  />
                  <div
                    className={`absolute -inset-1 rounded-full blur-[2px] transition-opacity duration-500 ${
                      avatarHovered ? "rainbow-ring opacity-100" : "animate-spin-slow opacity-70 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                    }`}
                  />
                  <div
                    className="relative flex size-16 items-center justify-center rounded-full border-2 border-background bg-secondary text-lg font-bold text-foreground shadow-lg cursor-pointer transition-shadow duration-300 hover:shadow-emerald-500/20 hover:shadow-xl"
                    onMouseEnter={() => setAvatarHovered(true)}
                    onMouseLeave={() => setAvatarHovered(false)}
                  >
                    CJS
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-semibold tracking-tight">陳家盛</span>
                  <span className="text-sm font-normal text-muted-foreground">Chen Jia-Sheng</span>
                  {/* Status indicator */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="relative flex size-2">
                      <span className="pulse-green-dot absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs text-emerald-400/90">🎓 Open to internships</span>
                  </div>
                  {/* Cycling "Currently learning" */}
                  <CyclingText items={learningItems} interval={2000} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5 border-0">
                  <GraduationCap className="size-3" />
                  Computer Science
                </Badge>
                <Badge variant="secondary" className="gap-1.5 border-0">
                  <BookOpen className="size-3" />
                  3rd Year
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  ID: 111210554
                </Badge>
              </div>
              <Separator className="bg-border/40" />
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span>s111210554@student.nqu.edu.tw</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>github.com/JonyStank</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-muted-foreground/60" />
                  <span>Taiwan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-muted-foreground/60" />
                  <span>Expected Graduation: 2027</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 2. Stats Overview ═══════════ */}
        <ScrollRevealSection delay={0.05}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <User className="size-4 text-muted-foreground" />
                Stats Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                {statsData.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 3. Skills Radar Chart ═══════════ */}
        <ScrollRevealSection delay={0.08}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="size-4 text-muted-foreground" />
                Skills Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChart />
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 4. Technical Skills ═══════════ */}
        <ScrollRevealSection delay={0.1}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Code2 className="size-4 text-muted-foreground" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {skills.map((skill, idx) => {
                const badge = getSkillBadge(skill.level);
                return (
                  <div key={skill.name} className="space-y-2 group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 border ${badge.className}`}
                        >
                          {badge.label}
                        </Badge>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative h-2 w-full cursor-pointer overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 + idx * 0.15 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          />
                          {/* Traveling dot */}
                          <div
                            className="traveling-dot"
                            style={{ animationDelay: `${idx * 0.5}s` }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        <span className="font-mono font-medium">{skill.level}% — {badge.label}</span>
                      </TooltipContent>
                    </Tooltip>
                    <p className="text-xs text-muted-foreground/70 transition-all duration-300 group-hover:text-muted-foreground group-hover:font-medium">
                      {skill.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 5. Fun Facts ═══════════ */}
        <ScrollRevealSection delay={0.12}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="size-4 text-muted-foreground" />
                Fun Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {funFacts.map((fact, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                  >
                    <div
                      className="flip-card h-[120px] cursor-pointer"
                      onClick={() => setFlippedFact(flippedFact === idx ? null : idx)}
                    >
                      <div className={`flip-card-inner ${flippedFact === idx ? "flipped" : ""}`}>
                        {/* Front */}
                        <div className="flip-card-front rounded-lg border border-border/30 bg-secondary/5 p-4 flex flex-col items-center justify-center gap-2 text-center">
                          <span className="text-2xl">{fact.emoji}</span>
                          <span className="text-xs font-medium text-foreground/90 leading-snug">{fact.text}</span>
                        </div>
                        {/* Back */}
                        <div className="flip-card-back rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-center text-center">
                          <p className="text-[11px] text-muted-foreground/80 leading-relaxed px-1">
                            {fact.back}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-[10px] text-muted-foreground/40 mt-3">
                Hover or tap to flip
              </p>
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 6. Interests ═══════════ */}
        <ScrollRevealSection delay={0.15}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="size-4 text-muted-foreground" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {interests.map((interest, idx) => (
                  <div
                    key={interest.name}
                    className="group relative flex items-start gap-3 rounded-lg border border-border/30 bg-secondary/10 px-3 py-3 transition-all duration-300 hover:border-border/60 hover:bg-gradient-to-br hover:from-emerald-500/5 hover:via-teal-500/5 hover:to-cyan-500/5 cursor-pointer"
                    onClick={() =>
                      setExpandedInterest((prev) =>
                        prev === idx ? null : idx
                      )
                    }
                  >
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-foreground/20 via-foreground/50 to-foreground/20 transition-all duration-300 group-hover:from-emerald-400/60 group-hover:via-teal-400/80 group-hover:to-cyan-400/60" />
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition-all duration-300 group-hover:bg-foreground/10 group-hover:text-foreground">
                      <interest.icon
                        className="size-4 transition-transform duration-700 group-hover:[animation:rotate-slow_1.5s_ease-in-out]"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-foreground/90 leading-tight">
                          {interest.name}
                        </span>
                        <ChevronDown
                          className={`size-3 text-muted-foreground/50 transition-transform duration-300 ${
                            expandedInterest === idx ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground/60 leading-snug">
                        {interest.description}
                      </span>
                    </div>
                    {/* Expandable detail */}
                    <AnimatePresence>
                      {expandedInterest === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden col-span-full"
                        >
                          <ul className="mt-2 ml-11 space-y-1">
                            {interest.details.map((d, dIdx) => (
                              <motion.li
                                key={dIdx}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: dIdx * 0.06, duration: 0.2 }}
                                className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80"
                              >
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-500/50" />
                                {d}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollRevealSection>
      </div>
    </main>
  );
}
