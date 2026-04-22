"use client";

import { useState, useEffect, useRef, useCallback, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  GraduationCap,
  Code2,
  TrendingUp,
  BookOpen,
  Github,
  Mail,
  MapPin,
  Calendar,
  BarChart3,
  ExternalLink,
  GitBranch,
  Send,
  CheckCircle2,
  Linkedin,
  Twitter,
  FolderGit2,
  Star,
  GitCommitHorizontal,
  Trophy,
  Zap,
  ChevronDown,
  Quote,
  Coffee,
  Moon,
  Gamepad2,
  BookOpenCheck,
  Bug,
  Sparkles,
  Database,
  Server,
  Smartphone,
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

const projects = [
  {
    name: "CryptoTracker",
    description: "Real-time cryptocurrency portfolio tracker with price alerts and performance analytics.",
    tech: ["Python", "JavaScript", "API"],
    languages: [{ name: "Python", color: "#3572A5" }, { name: "JavaScript", color: "#f1e05a" }],
    link: "#",
    status: "active" as const,
    stars: 24,
    forks: 8,
    updated: "2 weeks ago",
  },
  {
    name: "AlgoTrade Bot",
    description: "Automated trading bot implementing momentum and mean-reversion strategies.",
    tech: ["Python", "Pandas", "CCXT"],
    languages: [{ name: "Python", color: "#3572A5" }],
    link: "#",
    status: "development" as const,
    stars: 12,
    forks: 3,
    updated: "1 month ago",
  },
  {
    name: "FinDash",
    description: "Interactive financial dashboard with candlestick charts and technical indicators.",
    tech: ["TypeScript", "React", "Recharts"],
    languages: [{ name: "TypeScript", color: "#3178c6" }, { name: "CSS", color: "#563d7c" }],
    link: "#",
    status: "active" as const,
    stars: 31,
    forks: 11,
    updated: "3 days ago",
  },
];

const timeline = [
  { year: "2022", event: "Enrolled in Computer Science", icon: GraduationCap },
  { year: "2023", event: "Started exploring crypto & algorithmic trading", icon: TrendingUp },
  { year: "2024", event: "Built first trading bot prototype", icon: Code2 },
  { year: "2025", event: "3rd Year — React + TypeScript midterm project", icon: Zap },
];

const testimonials = [
  {
    quote: "Jia-Sheng's ability to break down complex algorithmic problems is exceptional. He consistently delivers clean, well-documented code that exceeds expectations.",
    name: "Alex Chen",
    role: "Team Lead, University Dev Club",
    initials: "AC",
  },
  {
    quote: "Working with Jia-Sheng on the trading bot project was a fantastic experience. His understanding of financial markets combined with strong engineering skills made him invaluable to our team.",
    name: "Sarah Lin",
    role: "CS Graduate, NTU",
    initials: "SL",
  },
];

const contributionData = [
  [0.3, 0.1, 0.5, 0.7, 0.1, 0.3, 0.9, 0.5, 0.1, 0.3, 0.7, 0.5, 0.1, 0.3, 0.5],
  [0.1, 0.5, 0.3, 0.9, 0.7, 0.1, 0.5, 0.3, 0.7, 0.9, 0.1, 0.3, 0.5, 0.7, 0.3],
  [0.5, 0.3, 0.1, 0.3, 0.5, 0.9, 0.7, 0.1, 0.5, 0.3, 0.7, 0.9, 0.3, 0.1, 0.7],
  [0.7, 0.9, 0.3, 0.1, 0.3, 0.5, 0.1, 0.7, 0.9, 0.5, 0.3, 0.1, 0.7, 0.5, 0.9],
  [0.1, 0.7, 0.5, 0.5, 0.9, 0.7, 0.3, 0.5, 0.3, 0.1, 0.5, 0.7, 0.9, 0.3, 0.1],
  [0.3, 0.5, 0.7, 0.9, 0.1, 0.3, 0.5, 0.9, 0.7, 0.5, 0.1, 0.5, 0.3, 0.9, 0.5],
  [0.5, 0.1, 0.9, 0.3, 0.7, 0.5, 0.9, 0.3, 0.1, 0.7, 0.9, 0.3, 0.1, 0.7, 0.3],
];

const statsData = [
  { label: "Projects", value: 3, max: 5, icon: FolderGit2 },
  { label: "Experience", value: 2, suffix: "yr", max: 4, icon: Trophy },
  { label: "Technologies", value: 8, max: 12, icon: Zap },
  { label: "GPA", value: 3.7, decimals: 1, max: 4.0, icon: BarChart3 },
];

const githubStats = [
  { label: "Repositories", value: 12, icon: FolderGit2 },
  { label: "Stars", value: 48, icon: Star },
  { label: "Contributions", value: 342, icon: GitCommitHorizontal },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/chenjiasheng" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:cs111210554@example.edu" },
];

const learningItems = ["React", "TypeScript", "Next.js", "Algorithms"];

const funFacts = [
  { emoji: "🐛", text: "Debugged 10,000+ lines of code", back: "Mostly at 2 AM with a cup of coffee in hand. The best bugs always hide in the most obvious places." },
  { emoji: "☕", text: "Consumed 1,024 cups of coffee", back: "That's approximately 2.8 cups per day over the past year. Double espresso is the fuel of choice." },
  { emoji: "🌙", text: "Best coding hours: 11 PM – 3 AM", back: "The night is peaceful, distractions are zero, and that's when the best algorithms are born." },
  { emoji: "🎮", text: "Built first game at age 14", back: "A simple Python text adventure game. It had 20 rooms and a dragon boss. Nostalgia!" },
  { emoji: "📚", text: "Read 50+ tech articles this year", back: "From MDN docs to obscure RFCs. Strong opinions, loosely held, and always learning." },
];

const pinnedRepos = [
  {
    name: "CryptoTracker",
    description: "Real-time cryptocurrency portfolio tracker with price alerts, performance analytics, and multi-exchange support.",
    language: { name: "Python", color: "#3572A5" },
    stars: 128,
    forks: 34,
    updated: "2 days ago",
  },
  {
    name: "algo-trade-engine",
    description: "High-performance algorithmic trading engine with backtesting framework and live execution support.",
    language: { name: "TypeScript", color: "#3178c6" },
    stars: 89,
    forks: 17,
    updated: "1 week ago",
  },
  {
    name: "fin-dash-react",
    description: "Interactive financial dashboard built with React, featuring candlestick charts and 20+ technical indicators.",
    language: { name: "JavaScript", color: "#f1e05a" },
    stars: 56,
    forks: 12,
    updated: "3 days ago",
  },
];

/* ────────────── Animation Variants ────────────── */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ────────────── Helper Components ────────────── */

function getSkillBadge(level: number) {
  if (level >= 85) return { label: "Expert", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
  if (level >= 70) return { label: "Advanced", className: "bg-teal-500/15 text-teal-400 border-teal-500/20" };
  return { label: "Intermediate", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
}

function StatusBadge({ status }: { status: "active" | "development" }) {
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-[10px] font-medium ${
        status === "active"
          ? "border-emerald-500/30 text-emerald-400"
          : "border-amber-500/30 text-amber-400"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          status === "active" ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />
      {status === "active" ? "Active" : "In Development"}
    </Badge>
  );
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

/* ────────────── Coding Streak Calendar ────────────── */

function CodingStreakCalendar() {
  const { ref, visible } = useScrollReveal(0.15);
  const weeks = 12;
  const days = 7;

  // Deterministic pseudo-random using simple seed
  const calendarData = useMemo(() => {
    const data: number[][] = [];
    let seed = 42;
    for (let w = 0; w < weeks; w++) {
      const row: number[] = [];
      for (let d = 0; d < days; d++) {
        seed = (seed * 16807 + 0) % 2147483647;
        const val = (seed % 100) / 100;
        // Make weekends and recent weeks more active
        const recencyBoost = w > 8 ? 0.15 : 0;
        const weekendBoost = d === 0 || d === 6 ? -0.1 : 0.05;
        row.push(Math.max(0, Math.min(1, val + recencyBoost + weekendBoost)));
      }
      data.push(row);
    }
    return data;
  }, []);

  const monthLabels = useMemo(() => {
    const now = new Date();
    const months: string[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      months.push(d.toLocaleString("en-US", { month: "short" }));
    }
    return months;
  }, []);

  const getColor = (val: number) => {
    if (val < 0.15) return "oklch(1 0 0 / 4%)";
    if (val < 0.35) return "oklch(0.7 0.15 160 / 25%)";
    if (val < 0.55) return "oklch(0.7 0.15 160 / 45%)";
    if (val < 0.75) return "oklch(0.7 0.15 160 / 65%)";
    return "oklch(0.7 0.15 160 / 90%)";
  };

  const totalContributions = useMemo(() => {
    return calendarData.flat().filter((v) => v >= 0.55).length;
  }, [calendarData]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground/60">
          {totalContributions} active days in last 12 weeks
        </span>
      </div>
      {/* Month labels */}
      <div className="flex gap-[3px] pl-0">
        {monthLabels.map((m, i) => (
          <span key={i} className="text-[8px] text-muted-foreground/40 flex-1 truncate">
            {i % 2 === 0 ? m : ""}
          </span>
        ))}
      </div>
      {/* Day labels + grid */}
      <div className="flex gap-1">
        <div className="flex flex-col gap-[3px] shrink-0 pt-0">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <span key={i} className="text-[8px] text-muted-foreground/30 h-[11px] flex items-center leading-none">
              {d}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px] flex-1">
          {calendarData.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((val, dIdx) => (
                <motion.div
                  key={`${wIdx}-${dIdx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{
                    delay: (wIdx * 7 + dIdx) * 0.008,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="calendar-cell"
                  style={{ backgroundColor: getColor(val) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-[9px] text-muted-foreground/40">Less</span>
        {[0.05, 0.25, 0.45, 0.65, 0.85].map((l, i) => (
          <div
            key={i}
            className="size-[10px] rounded-[2px]"
            style={{ backgroundColor: getColor(l) }}
          />
        ))}
        <span className="text-[9px] text-muted-foreground/40">More</span>
      </div>
    </div>
  );
}

/* ────────────── Main Component ────────────── */

export default function Profile() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [expandedInterest, setExpandedInterest] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [preferredContact, setPreferredContact] = useState("email");
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [flippedFact, setFlippedFact] = useState<number | null>(null);

  // Parallax scroll offset for avatar
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for timeline line animation
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimelineVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: "", email: "", message: "" });
    }, 3000);
  }

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
                  <Mail className="size-3.5 text-muted-foreground/60" />
                  <span>cs111210554@example.edu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="size-3.5 text-muted-foreground/60" />
                  <span>github.com/chenjiasheng</span>
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
              <Separator className="bg-border/40" />
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-lg border border-border/30 bg-secondary/10 text-muted-foreground transition-all duration-200 hover:border-border/60 hover:bg-secondary/30 hover:text-foreground hover:shadow-sm"
                  >
                    <link.icon className="size-4" />
                    <span className="sr-only">{link.label}</span>
                  </a>
                ))}
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                <Coffee className="size-4 text-muted-foreground" />
                Fun Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

        <GradientSeparator />

        {/* ═══════════ 7. Pinned Repositories ═══════════ */}
        <ScrollRevealSection delay={0.18}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <GitBranch className="size-4 text-muted-foreground" />
                  Pinned Repositories
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-normal">
                  Custom
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pinnedRepos.map((repo, idx) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  className="pinned-repo-card rounded-lg border border-border/30 bg-secondary/5 p-4 cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <BookOpen className="size-3.5 text-muted-foreground/50 shrink-0" />
                          <h4 className="text-sm font-semibold text-emerald-400/90 truncate">{repo.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                          {repo.description}
                        </p>
                      </div>
                      <a href="#" className="shrink-0 flex size-7 items-center justify-center rounded-md border border-border/30 text-muted-foreground/40 transition-all duration-200 hover:border-border/60 hover:text-foreground">
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground/50">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: repo.language.color }} />
                        {repo.language.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="size-3" />
                        {repo.forks}
                      </span>
                      <span className="ml-auto text-muted-foreground/35">{repo.updated}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 8. Projects ═══════════ */}
        <ScrollRevealSection delay={0.2}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <FolderGit2 className="size-4 text-muted-foreground" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="group rounded-lg border border-border/30 bg-secondary/5 p-4 transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
                  style={{
                    backgroundImage: "linear-gradient(135deg, transparent, transparent)",
                    backgroundSize: "200% 200%",
                    transitionProperty: "all",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundImage =
                      "linear-gradient(135deg, oklch(0.7 0.15 160 / 3%), oklch(0.65 0.2 200 / 3%))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage =
                      "linear-gradient(135deg, transparent, transparent)";
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-medium text-foreground/90">{project.name}</h4>
                        <StatusBadge status={project.status} />
                      </div>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">
                        {project.description}
                      </p>
                      {/* Language dots + star/fork */}
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {project.languages.map((lang) => (
                            <span key={lang.name} className="flex items-center gap-1">
                              <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: lang.color }}
                              />
                              <span className="text-[10px] text-muted-foreground/60">{lang.name}</span>
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground/50">
                          ⭐ {project.stars} · 🍴 {project.forks}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <a
                        href={project.link}
                        className="flex size-7 items-center justify-center rounded-md border border-border/30 text-muted-foreground/50 transition-all duration-200 hover:border-border/60 hover:text-foreground"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                      <span className="text-[10px] text-muted-foreground/40">{project.updated}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ GitHub Stats ═══════════ */}
        <ScrollRevealSection delay={0.22}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Github className="size-4 text-muted-foreground" />
                GitHub Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {githubStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="stat-card flex flex-col items-center gap-1.5 rounded-lg border border-border/30 bg-secondary/5 p-4 transition-all duration-300 hover:border-emerald-500/20 hover:bg-secondary/10"
                  >
                    <stat.icon className="size-5 text-muted-foreground/50" />
                    <span className="text-lg font-bold text-foreground tabular-nums">
                      <CountUp target={stat.value} duration={1.5} />
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 9. Coding Streak Calendar ═══════════ */}
        <ScrollRevealSection delay={0.25}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="size-4 text-muted-foreground" />
                Coding Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodingStreakCalendar />
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 10. Contact Form ═══════════ */}
        <ScrollRevealSection delay={0.28}>
          <Card className="border-border/40 bg-card/40 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Mail className="size-4 text-muted-foreground" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <AnimatePresence>
                  {contactSent && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 mb-4">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                        <span className="text-sm text-emerald-400">Message sent successfully! I&apos;ll get back to you soon.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  {/* Name field with floating label */}
                  <div className="relative">
                    <label
                      className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        focusedField === "name" || contactForm.name
                          ? "top-1 text-[10px] text-emerald-400/80 bg-card px-0.5"
                          : "top-2.5 text-sm text-muted-foreground/50"
                      }`}
                    >
                      Your name
                    </label>
                    <Input
                      type="text"
                      placeholder=" "
                      value={contactForm.name}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="border-border/30 bg-secondary/10 text-sm placeholder:text-transparent rounded-lg pt-5 pb-1.5"
                    />
                  </div>
                  {/* Email field with floating label */}
                  <div className="relative">
                    <label
                      className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        focusedField === "email" || contactForm.email
                          ? "top-1 text-[10px] text-emerald-400/80 bg-card px-0.5"
                          : "top-2.5 text-sm text-muted-foreground/50"
                      }`}
                    >
                      your@email.com
                    </label>
                    <Input
                      type="email"
                      placeholder=" "
                      value={contactForm.email}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="border-border/30 bg-secondary/10 text-sm placeholder:text-transparent rounded-lg pt-5 pb-1.5"
                    />
                  </div>
                  {/* Message field with floating label + char counter */}
                  <div className="relative">
                    <label
                      className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                        focusedField === "message" || contactForm.message
                          ? "top-1 text-[10px] text-emerald-400/80 bg-card px-0.5"
                          : "top-2.5 text-sm text-muted-foreground/50"
                      }`}
                    >
                      Your message...
                    </label>
                    <Textarea
                      placeholder=" "
                      value={contactForm.message}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 500) {
                          setContactForm((prev) => ({ ...prev, message: val }));
                        }
                      }}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={4}
                      className="border-border/30 bg-secondary/10 text-sm placeholder:text-transparent rounded-lg resize-none pt-5 pb-1.5"
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/40 tabular-nums">
                      {contactForm.message.length}/500
                    </span>
                  </div>
                  {/* Preferred contact method */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground/60">Preferred contact method</span>
                    <Select value={preferredContact} onValueChange={setPreferredContact}>
                      <SelectTrigger className="w-full border-border/30 bg-secondary/10 text-sm rounded-lg h-9">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">📧 Email</SelectItem>
                        <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                        <SelectItem value="twitter">🐦 Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full gap-2"
                    disabled={contactSent}
                  >
                    {contactSent ? (
                      <>
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 11. Testimonials ═══════════ */}
        <ScrollRevealSection delay={0.3}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Quote className="size-4 text-muted-foreground" />
                Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.12, duration: 0.4 }}
                  className="relative rounded-lg border border-border/30 bg-secondary/5 p-4 pl-5"
                >
                  {/* Left accent border */}
                  <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-emerald-500/40 via-teal-500/60 to-cyan-500/40" />
                  <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-[11px] font-bold text-emerald-400">
                      {t.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground/90">{t.name}</span>
                      <span className="text-[10px] text-muted-foreground/60">{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </ScrollRevealSection>

        <GradientSeparator />

        {/* ═══════════ 12. Timeline ═══════════ */}
        <ScrollRevealSection delay={0.32}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="size-4 text-muted-foreground" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                  Activity
                </p>
                <div className="flex flex-col gap-[3px]">
                  {contributionData.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-[3px]">
                      {row.map((level, colIdx) => (
                        <motion.div
                          key={`${rowIdx}-${colIdx}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 1.0 + (rowIdx * 15 + colIdx) * 0.003,
                            duration: 0.15,
                          }}
                          className="size-[10px] rounded-[2px] bg-foreground"
                          style={{ opacity: level }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-muted-foreground/40">Less</span>
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((l) => (
                    <div
                      key={l}
                      className="size-[10px] rounded-[2px] bg-foreground"
                      style={{ opacity: l }}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground/40">More</span>
                </div>
              </div>

              <Separator className="bg-border/40" />

              <div className="relative" ref={timelineRef}>
                {/* Animated timeline line */}
                <div
                  className={`absolute left-[11px] top-1 bottom-1 w-px bg-border/30 md:left-1/2 md:-translate-x-px ${
                    timelineVisible ? "timeline-line-animated" : "scale-y-0"
                  }`}
                />
                <div className="space-y-0">
                  {timeline.map((entry, idx) => {
                    const isLeft = idx % 2 === 0;
                    const isLast = idx === timeline.length - 1;
                    const EntryIcon = entry.icon;
                    return (
                      <motion.div
                        key={entry.year}
                        initial={{ opacity: 0, x: isLeft ? -12 : 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + idx * 0.12, duration: 0.35 }}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        <div className="hidden md:flex md:w-1/2 md:justify-end md:pr-8">
                          {isLeft ? (
                            <div className="flex flex-col items-end text-right">
                              <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                              <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                            </div>
                          ) : null}
                        </div>
                        <div className="relative z-10 flex shrink-0">
                          <div className="flex size-6 items-center justify-center rounded-full border border-border/50 bg-card shadow-sm">
                            <EntryIcon className="size-3 text-muted-foreground" />
                          </div>
                          {isLast && (
                            <Badge
                              variant="outline"
                              className="absolute -top-2 left-full ml-2 px-1.5 py-0 text-[9px] font-bold border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                            >
                              NOW
                            </Badge>
                          )}
                        </div>
                        <div className="md:hidden flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                            {isLast && (
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[9px] font-bold border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                              >
                                NOW
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                        </div>
                        <div className="hidden md:flex md:w-1/2 md:pl-8">
                          {!isLeft ? (
                            <div className="flex flex-col">
                              <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                              <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollRevealSection>
      </div>
    </main>
  );
}
