"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Terminal,
  Layers,
  Zap,
  Palette,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Copy,
  Check,
  GitCommit,
  GitCommitHorizontal,
  GitPullRequest,
  Clock,
  User,
  Gamepad2,
  BookOpen,
  Sparkles,
  FileText,
  Coffee,
  Wrench,
  Globe,
  PenTool,
  Container,
  MonitorDot,
  Search,
  MessageSquare,
  Boxes,
  Rocket,
  Quote,
  Music,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface HomeProps {
  onNavigate: (page: "profile" | "game") => void;
}

const typingPhrases = [
  "Midterm Project",
  "TypeScript",
  "Dark Minimalist",
  "Interactive Game",
];

const codeSnippet = `function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen dark">
      <Navbar onNavigate={setPage} />
      <Page current={page} />
    </div>
  );
}`;

const features = [
  {
    icon: Code2,
    title: "TypeScript",
    description: "Strictly typed for reliability and developer experience.",
    complexity: "Core" as const,
    glowClass: "icon-glow-cyan",
  },
  {
    icon: Layers,
    title: "Component Architecture",
    description: "Modular, reusable components with clean separation.",
    complexity: "Essential" as const,
    glowClass: "icon-glow-emerald",
  },
  {
    icon: Zap,
    title: "Interactive Game",
    description: "Functional Tic-Tac-Toe with state management.",
    complexity: "Advanced" as const,
    glowClass: "icon-glow-amber",
  },
  {
    icon: Palette,
    title: "Dark Minimalist",
    description: "Clean UI with carefully crafted visual hierarchy.",
    complexity: "Essential" as const,
    glowClass: "icon-glow-teal",
  },
];

const complexityColors: Record<string, string> = {
  Core: "border-cyan-500/40 text-cyan-400/80 bg-cyan-500/10",
  Essential: "border-emerald-500/40 text-emerald-400/80 bg-emerald-500/10",
  Advanced: "border-amber-500/40 text-amber-400/80 bg-amber-500/10",
};

const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "67,432.18", change: "+2.4%", positive: true, sparkline: [40, 35, 45, 38, 42] },
  { symbol: "ETH", name: "Ethereum", price: "3,521.07", change: "+1.8%", positive: true, sparkline: [30, 32, 28, 35, 33] },
  { symbol: "SOL", name: "Solana", price: "178.92", change: "-0.6%", positive: false, sparkline: [25, 22, 28, 30, 26] },
  { symbol: "BNB", name: "BNB", price: "612.35", change: "+3.1%", positive: true, sparkline: [20, 18, 22, 25, 30] },
  { symbol: "ADA", name: "Cardano", price: "0.68", change: "-1.2%", positive: false, sparkline: [35, 38, 32, 36, 34] },
  { symbol: "DOGE", name: "Dogecoin", price: "0.165", change: "+5.7%", positive: true, sparkline: [15, 18, 20, 25, 28] },
  { symbol: "DOT", name: "Polkadot", price: "8.42", change: "+0.9%", positive: true, sparkline: [28, 26, 30, 27, 29] },
];

const recentActivity = [
  {
    type: "commit" as const,
    message: "feat: add AI opponent to Tic-Tac-Toe",
    time: "3 hours ago",
  },
  {
    type: "pr" as const,
    message: "fix: resolve theme toggle persistence bug",
    time: "5 hours ago",
  },
  {
    type: "commit" as const,
    message: "style: enhance profile page with timeline",
    time: "1 day ago",
  },
  {
    type: "pr" as const,
    message: "feat: crypto ticker widget for home page",
    time: "2 days ago",
  },
];

const learningItems = [
  { icon: Sparkles, title: "React Advanced Patterns", progress: 70, color: "from-cyan-500 to-teal-400" },
  { icon: Layers, title: "Next.js App Router", progress: 45, color: "from-emerald-500 to-teal-400" },
  { icon: Terminal, title: "Rust Basics", progress: 25, color: "from-amber-500 to-orange-400" },
];

const techStackItems = [
  { name: "React", color: "text-cyan-400" },
  { name: "TypeScript", color: "text-teal-400" },
  { name: "Next.js", color: "text-foreground/80" },
  { name: "Tailwind", color: "text-cyan-500" },
  { name: "Framer Motion", color: "text-teal-400" },
  { name: "shadcn/ui", color: "text-emerald-400" },
  { name: "Node.js", color: "text-emerald-400" },
  { name: "Git", color: "text-amber-400/80" },
  { name: "VS Code", color: "text-cyan-400/80" },
  { name: "Prisma", color: "text-teal-400" },
];

const miniContribData = [
  [0, 1, 3, 2, 0, 4, 1, 0, 2, 3, 1, 0],
  [1, 2, 0, 4, 3, 0, 2, 1, 3, 0, 4, 2],
  [3, 0, 2, 1, 4, 2, 0, 3, 1, 2, 0, 4],
  [0, 4, 1, 3, 2, 1, 3, 0, 4, 1, 2, 3],
  [2, 1, 4, 0, 3, 4, 1, 2, 0, 3, 4, 1],
  [4, 3, 0, 2, 1, 3, 4, 1, 3, 0, 2, 4],
  [1, 2, 3, 1, 0, 2, 3, 4, 2, 1, 3, 0],
];

const miniContribColors = [
  "oklch(0 0 0 / 4%)",
  "oklch(0.65 0.17 162 / 25%)",
  "oklch(0.65 0.17 162 / 50%)",
  "oklch(0.65 0.17 162 / 75%)",
  "oklch(0.65 0.17 162 / 100%)",
];

const counterItems = [
  { label: "Lines of Code", value: 12847, icon: Code2 },
  { label: "Commits", value: 342, icon: GitCommit },
  { label: "Projects", value: 8, icon: Layers },
  { label: "Coffee", value: 1024, icon: Coffee, emoji: "☕" },
];

const blogPosts = [
  {
    title: "Building a Tic-Tac-Toe AI with Minimax",
    excerpt: "A deep dive into implementing the Minimax algorithm for an unbeatable AI opponent in React.",
    date: "Jan 15",
    readTime: "5 min read",
  },
  {
    title: "My Journey into Algorithmic Trading",
    excerpt: "From curiosity to building automated trading bots with Python and real market data.",
    date: "Dec 28",
    readTime: "8 min read",
  },
  {
    title: "Why TypeScript Changed How I Code",
    excerpt: "How strict typing caught bugs I never knew existed and improved my development workflow.",
    date: "Nov 10",
    readTime: "4 min read",
  },
];

/* ── Tools I Use ── */
const toolsItems = [
  { name: "VS Code", icon: Code2, color: "text-cyan-400" },
  { name: "GitHub", icon: Globe, color: "text-foreground/80" },
  { name: "Docker", icon: Container, color: "text-cyan-400" },
  { name: "Figma", icon: PenTool, color: "text-teal-400" },
  { name: "Postman", icon: MonitorDot, color: "text-amber-400" },
  { name: "DevTools", icon: Search, color: "text-foreground/70" },
  { name: "Terminal", icon: Terminal, color: "text-emerald-400" },
  { name: "Notion", icon: FileText, color: "text-foreground/70" },
  { name: "Discord", icon: MessageSquare, color: "text-cyan-400/80" },
  { name: "Stack Overflow", icon: Layers, color: "text-amber-400" },
  { name: "npm", icon: Boxes, color: "text-red-400/80" },
  { name: "Vercel", icon: Rocket, color: "text-foreground/80" },
];

/* ── Inspirational Quotes ── */
const quotes = [
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function SparklineChart({ points, positive }: { points: number[]; positive: boolean }) {
  const width = 48;
  const height = 20;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * width,
    y: height - ((p - min) / range) * height,
  }));

  const pathD = coords
    .map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`))
    .join(" ");

  return (
    <svg width={width} height={height} className="shrink-0" viewBox={`0 0 ${width} ${height}`}>
      <path
        d={pathD}
        fill="none"
        stroke={positive ? "oklch(0.7 0.17 162)" : "oklch(0.6 0.2 25)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

function HighlightedCode({ code }: { code: string }) {
  const rules: { pattern: RegExp; cls: string }[] = [
    { pattern: /\b(function|const|return)\b/g, cls: "text-emerald-500/80" },
    { pattern: /^(\s*)(<[A-Z]\w*)/gm, cls: "text-teal-400/80" },
    { pattern: /(<\/?)([A-Z]\w+)/g, cls: "text-teal-400/80" },
    { pattern: /(<\/?)(div|span|p|h[1-6]|main|section|header|nav)/g, cls: "text-muted-foreground/70" },
    { pattern: /(".*?")/g, cls: "text-amber-400/70" },
    { pattern: /\b(className|onNavigate|current)\b(?=\s*=)/g, cls: "text-teal-300/70" },
    { pattern: /\b(useState)\b/g, cls: "text-cyan-400/80" },
    { pattern: /([(){}[\]=;,])/g, cls: "text-muted-foreground/50" },
    { pattern: /(\/?>|<\/)/g, cls: "text-muted-foreground/50" },
  ];

  const lines = code.split("\n");

  return (
    <pre className="font-mono text-xs leading-relaxed text-foreground/70 overflow-x-auto">
      <code>
        {lines.map((line, lineIdx) => {
          interface Match {
            start: number;
            end: number;
            cls: string;
            text: string;
          }
          const allMatches: Match[] = [];

          for (const rule of rules) {
            const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
            let m: RegExpExecArray | null;
            while ((m = regex.exec(line)) !== null) {
              let start = m.index;
              let end = m.index + m[0].length;
              let text = m[0];

              if (m[2] !== undefined) {
                start = m.index + m[1].length;
                end = start + m[2].length;
                text = m[2];
              }

              allMatches.push({ start, end, cls: rule.cls, text });
            }
          }

          allMatches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

          const filtered: Match[] = [];
          let lastEnd = -1;
          for (const match of allMatches) {
            if (match.start >= lastEnd) {
              filtered.push(match);
              lastEnd = match.end;
            }
          }

          const nodes: React.ReactNode[] = [];
          let cursor = 0;

          for (const match of filtered) {
            if (match.start > cursor) {
              nodes.push(
                <span key={`t-${lineIdx}-${cursor}`}>
                  {line.slice(cursor, match.start)}
                </span>
              );
            }
            nodes.push(
              <span key={`h-${lineIdx}-${match.start}`} className={match.cls}>
                {match.text}
              </span>
            );
            cursor = match.end;
          }

          if (cursor < line.length) {
            nodes.push(
              <span key={`e-${lineIdx}-${cursor}`}>{line.slice(cursor)}</span>
            );
          }

          return (
            <div key={lineIdx} className="flex code-line-hover rounded-sm px-1 -mx-1 transition-colors duration-150">
              <span className="inline-block w-6 shrink-0 text-right pr-3 select-none text-muted-foreground/30">
                {lineIdx + 1}
              </span>
              <span className="flex-1">
                {nodes}
                {lineIdx < lines.length - 1 ? "\n" : ""}
              </span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}

/* ── ScrollReveal wrapper component ── */
function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("revealed");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ── Equalizer Bars ── */
function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      <div className="eq-bar" style={{ height: "8px" }} />
      <div className="eq-bar" style={{ height: "12px" }} />
      <div className="eq-bar" style={{ height: "6px" }} />
      <div className="eq-bar" style={{ height: "10px" }} />
    </div>
  );
}

/* ── Tool Card ── */
function ToolCard({ tool, index }: { tool: { name: string; icon: LucideIcon; color: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
      className="tool-card-glow group flex flex-col items-center gap-2.5 rounded-lg border border-border/30 bg-card/20 p-4 cursor-default"
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-all duration-300 group-hover:text-foreground">
        <tool.icon className="size-5" />
      </div>
      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
        {tool.name}
      </span>
    </motion.div>
  );
}

export default function Home({ onNavigate }: HomeProps) {
  const [typedText, setTypedText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [quoteKey, setQuoteKey] = useState(0);

  const mainRef = useRef<HTMLElement>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // Typing animation
  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIdx];

    if (!isDeleting && typedText === currentPhrase) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && typedText === "") {
      const nextTimer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % typingPhrases.length);
      }, 40);
      return () => clearTimeout(nextTimer);
    }

    const delay = isDeleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (isDeleting) {
        setTypedText((prev) => prev.slice(0, -1));
      } else {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx]);

  // Mouse follow gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mainRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0.5, y: 0.5 });
    };

    const el = mainRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quote auto-cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % quotes.length);
        setQuoteKey((prev) => prev + 1);
        setQuoteVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Parallax speeds for particles (different speeds)
  const particleParallaxSpeeds = [0.15, 0.25, 0.1, 0.3, 0.2, 0.35, 0.12, 0.28];

  return (
    <main ref={mainRef} className="relative flex flex-1 flex-col items-center px-6 py-12 overflow-hidden noise-overlay">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* Mouse-follow gradient overlay */}
      <div
        className="mouse-gradient-overlay active"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, oklch(0.65 0.15 162 / 0.07), transparent 60%)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 20% 10%, oklch(0.7 0.12 170 / 0.06), transparent), radial-gradient(ellipse 500px 500px at 80% 20%, oklch(0.65 0.15 150 / 0.05), transparent), radial-gradient(ellipse 400px 300px at 60% 80%, oklch(0.6 0.1 200 / 0.04), transparent), radial-gradient(ellipse 700px 500px at 10% 70%, oklch(0.75 0.08 130 / 0.04), transparent), radial-gradient(ellipse 500px 600px at 50% 50%, oklch(0.985 0 0 / 0.02), transparent)",
        }}
      />

      {/* Breathing glow orb — top-right emerald/teal */}
      <div
        className="absolute -top-20 right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.6 0.17 162 / 0.25), oklch(0.55 0.14 180 / 0.1), transparent 70%)",
          animation: "breathe-glow 6s ease-in-out infinite",
        }}
      />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

      {/* Floating particles with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => {
          const speed = particleParallaxSpeeds[i] || 0.2;
          return (
            <div
              key={i}
              className="floating-particle absolute rounded-full bg-foreground/[0.03]"
              style={{
                width: `${4 + i * 3}px`,
                height: `${4 + i * 3}px`,
                left: `${15 + i * 10}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${6 + i * 2}s`,
                transform: `translateY(${-scrollY * speed}px)`,
                transition: "transform 0.1s linear",
              }}
            />
          );
        })}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div variants={item} className="mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-4 py-1.5 text-sm text-muted-foreground bg-secondary/20"
            style={{
              animation: "pulse-border 3s ease-in-out infinite",
            }}
          >
            <style>{`
              @keyframes pulse-border {
                0%, 100% { border-color: oklch(0.7 0.17 162 / 0.25); box-shadow: 0 0 0 0 oklch(0.7 0.17 162 / 0); }
                50% { border-color: oklch(0.7 0.17 162 / 0.5); box-shadow: 0 0 12px 2px oklch(0.7 0.17 162 / 0.1); }
              }
            `}</style>
            <Terminal className="size-3.5" />
            <span className="font-mono">react + typescript midterm</span>
            <span className="size-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.75 0.17 162), oklch(0.7 0.15 180), oklch(0.8 0.12 155))",
            }}
          >
            React + TS
          </span>
          <br />
          <span className="text-muted-foreground/80 glow-text">
            {typedText}
            <span className="typing-cursor" />
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mb-10 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A minimal web application built with React and TypeScript. Featuring
          clean architecture, dark UI, and interactive components.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => onNavigate("profile")}
            className="cta-micro-interact group flex items-center gap-2.5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/5"
          >
            <Code2 className="size-4" />
            View Profile
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => onNavigate("game")}
            className="cta-micro-interact group flex items-center gap-2.5 rounded-lg border border-border/60 bg-secondary/10 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/20 hover:border-border"
          >
            Play Game
          </button>
        </motion.div>

        {/* Tech Stats with tooltips and connectors */}
        <motion.div
          variants={item}
          className="mt-16 grid grid-cols-3 gap-8 text-center sm:gap-12"
        >
          {[
            { label: "Framework", value: "React 19", tooltip: "Latest version with new compiler" },
            { label: "Language", value: "TypeScript", tooltip: "Strict type safety" },
            { label: "Styling", value: "Tailwind CSS", tooltip: "Utility-first CSS framework" },
          ].map(({ label, value, tooltip }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <div
                  className="stat-connector group flex flex-col items-center gap-1.5 rounded-lg px-4 py-3 transition-all duration-300 hover:scale-105 hover:bg-secondary/30 cursor-default"
                >
                  <span className="relative flex items-center gap-2">
                    <span className="size-1 rounded-full bg-emerald-500/60 animate-pulse" />
                    <span className="font-mono text-lg font-semibold text-foreground">
                      {value}
                    </span>
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-foreground text-background text-[11px] border-0">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={item}
          className="mt-14 flex flex-col items-center gap-1.5"
        >
          <div className="scroll-indicator">
            <ChevronDown className="size-5 text-muted-foreground/40" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30">
            Scroll
          </span>
        </motion.div>
      </motion.div>

      <Separator className="my-10 w-full max-w-3xl opacity-30" />

      {/* ── Currently Playing Status Bar ── */}
      <ScrollReveal className="relative w-full max-w-3xl mb-6">
        <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/20 px-4 py-2.5">
          <div className="flex items-center gap-2.5 shrink-0">
            <EqualizerBars />
            <Music className="size-3.5 text-muted-foreground/50" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground/90 truncate">lofi hip hop radio</span>
              <span className="text-sm">📻</span>
            </div>
            <span className="text-[11px] text-muted-foreground/60 truncate block">
              beats to relax/study to
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-muted-foreground/40">
              <div className="flex gap-[2px]">
                <div className="w-[2px] h-2 rounded-full bg-muted-foreground/30" />
                <div className="w-[2px] h-3 rounded-full bg-muted-foreground/30" />
                <div className="w-[2px] h-1.5 rounded-full bg-muted-foreground/30" />
                <div className="w-[2px] h-2.5 rounded-full bg-muted-foreground/30" />
                <div className="w-[2px] h-1 rounded-full bg-muted-foreground/30" />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground/40 font-mono">3:24</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Code Terminal with line numbers and language badge */}
      <ScrollReveal className="relative mt-4 mb-4 w-full max-w-xl">
        <div className="rounded-lg border border-border/30 bg-card/40 overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border/30 bg-secondary/20 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <span className="ml-2 text-[11px] font-mono text-muted-foreground/60">
                App.tsx
              </span>
              <Badge
                variant="outline"
                className="ml-2 h-4 px-1.5 text-[9px] font-mono border-emerald-500/30 text-emerald-400/70 bg-emerald-500/5"
              >
                TSX
              </Badge>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground/60 transition-colors duration-200 hover:bg-secondary/40 hover:text-foreground/80"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 text-emerald-400"
                  >
                    <Check className="size-3" />
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="size-3" />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <div className="p-4">
            <HighlightedCode code={codeSnippet} />
          </div>
        </div>
      </ScrollReveal>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      {/* Crypto Ticker with sparklines and Live indicator */}
      <ScrollReveal className="relative mb-4 w-full max-w-3xl">
        <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Crypto Market</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-medium">
                Live
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-card/80 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-card/80 to-transparent" />
            <div className="no-scrollbar flex gap-1 overflow-x-auto p-3">
              {cryptoData.map((coin) => (
                <div
                  key={coin.symbol}
                  className="flex shrink-0 items-center gap-3 rounded-lg border border-border/30 bg-secondary/10 px-3.5 py-2.5 transition-all duration-200 hover:border-border/60 hover:bg-secondary/20"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[11px] font-bold text-foreground">
                    {coin.symbol.slice(0, 2)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-foreground/90">{coin.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        ${coin.price}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-medium ${
                          coin.positive ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {coin.change}
                      </span>
                    </div>
                  </div>
                  <SparklineChart points={coin.sparkline} positive={coin.positive} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      {/* Recent Activity */}
      <ScrollReveal className="relative mb-4 w-full max-w-3xl">
        <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Recent Activity</span>
          </div>
          <div className="divide-y divide-border/20">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.3 }}
                className="flex items-start gap-3 px-4 py-3 transition-colors duration-200 hover:bg-secondary/10"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/50">
                  {activity.type === "commit" ? (
                    <GitCommit className="size-3.5 text-emerald-400/80" />
                  ) : (
                    <GitPullRequest className="size-3.5 text-teal-400/80" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 truncate">{activity.message}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      {/* What I'm Learning Section */}
      <ScrollReveal className="relative mb-4 w-full max-w-3xl">
        <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <BookOpen className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">What I&apos;m Learning</span>
          </div>
          <div className="divide-y divide-border/20">
            {learningItems.map((lItem, idx) => (
              <motion.div
                key={lItem.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + idx * 0.12, duration: 0.4 }}
                className="flex items-center gap-4 px-4 py-3.5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground">
                  <lItem.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground/90">{lItem.title}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{lItem.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lItem.progress}%` }}
                      transition={{ delay: 0.85 + idx * 0.12, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${lItem.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* GitHub Activity Mini Graph */}
      <ScrollReveal className="relative mb-4 w-full max-w-3xl">
        <div className="rounded-lg border border-border/30 bg-card/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GitCommitHorizontal className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Contributions</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Last 12 weeks</span>
          </div>
          <div className="flex flex-col gap-[3px] items-start">
            {miniContribData.map((row, rowIdx) => (
              <motion.div
                key={rowIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + rowIdx * 0.06, duration: 0.3 }}
                className="flex gap-[3px]"
              >
                {row.map((level, colIdx) => (
                  <motion.div
                    key={`${rowIdx}-${colIdx}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.85 + (rowIdx * 12 + colIdx) * 0.004,
                      duration: 0.15,
                    }}
                    className="contribution-cell"
                    style={{ backgroundColor: miniContribColors[level] }}
                  />
                ))}
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400/70 font-medium">247 contributions</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-muted-foreground/40">Less</span>
              {miniContribColors.slice(1).map((color, i) => (
                <div
                  key={i}
                  className="contribution-cell"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-[9px] text-muted-foreground/40">More</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      {/* Feature Cards with icon glow and complexity badges */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
              className="group rounded-lg border border-border/30 bg-card/30 p-4 transition-all duration-300 hover:border-transparent hover:bg-card/50 hover:gradient-border hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="flex items-start gap-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground transition-all duration-300 group-hover:text-foreground ${feature.glowClass}`}>
                  <feature.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`h-4 px-1.5 text-[8px] uppercase tracking-wider font-medium ${complexityColors[feature.complexity]}`}
                    >
                      {feature.complexity}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/0 transition-all duration-300 -translate-x-1 group-hover:text-muted-foreground/60 group-hover:translate-x-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Tech Stack Marquee */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee-track py-2">
          {[...techStackItems, ...techStackItems].map((sItem, idx) => (
            <div
              key={`${sItem.name}-${idx}`}
              className="flex shrink-0 items-center gap-2 px-4"
            >
              <div className={`flex size-7 items-center justify-center rounded-full border border-border/30 bg-secondary/20 text-[10px] font-bold ${sItem.color}`}>
                {sItem.name.slice(0, 2)}
              </div>
              <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">{sItem.name}</span>
              <span className="size-1 rounded-full bg-border/40" />
            </div>
          ))}
        </div>
      </ScrollReveal>

      <Separator className="mb-8 w-full max-w-3xl opacity-30" />

      {/* ── Tools I Use Grid ── */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl">
        <div className="flex items-center gap-2 mb-5">
          <Wrench className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Tools I Use</span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {toolsItems.map((tool, idx) => (
            <ToolCard key={tool.name} tool={tool} index={idx} />
          ))}
        </div>
      </ScrollReveal>

      <Separator className="mb-8 w-full max-w-3xl opacity-30" />

      {/* Animated Counter Section — My Numbers */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl">
        <div className="mb-4 text-center">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">
            My Numbers
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {counterItems.map((counter, idx) => (
            <motion.div
              key={counter.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.12, duration: 0.4 }}
              className="flex flex-col items-center gap-2 rounded-lg border border-border/30 bg-card/20 p-4 transition-all duration-300 hover:border-border/60 hover:bg-card/30 hover:-translate-y-0.5"
            >
              <counter.icon className="size-4 text-emerald-400/60" />
              <span className="text-3xl font-bold text-foreground tabular-nums">
                {counter.value.toLocaleString()}
                {counter.emoji ? <span className="ml-1 text-xl">{counter.emoji}</span> : null}
              </span>
              <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-emerald-500/40 to-teal-400/40" />
              <span className="text-[11px] text-muted-foreground/60">{counter.label}</span>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      <Separator className="mb-8 w-full max-w-3xl opacity-30" />

      {/* ── Inspirational Quote Section ── */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl">
        <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Quote className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Inspiration</span>
            <div className="flex-1" />
            <span className="text-[10px] text-muted-foreground/40 font-mono">
              {quoteIdx + 1}/{quotes.length}
            </span>
          </div>
          <div className="relative px-6 py-6 min-h-[100px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: quoteVisible ? 1 : 0, y: quoteVisible ? 0 : -8 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-center max-w-md"
              >
                <p className="text-base leading-relaxed text-foreground/80 italic">
                  &ldquo;{quotes[quoteIdx].text}&rdquo;
                </p>
                <p className="mt-3 text-xs font-medium text-muted-foreground/60">
                  — {quotes[quoteIdx].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Progress bar */}
          <div className="h-[2px] w-full bg-secondary/30 overflow-hidden">
            <div
              key={`progress-${quoteKey}`}
              className="quote-progress-bar"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Blog Preview Section */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Latest Blog Posts</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {blogPosts.map((post, idx) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 + idx * 0.1, duration: 0.4 }}
              className="group rounded-lg border border-border/30 bg-card/20 p-4 transition-all duration-300 hover:border-emerald-500/20 hover:bg-card/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
            >
              <h4 className="text-sm font-medium text-foreground/90 leading-snug group-hover:text-emerald-400/90 transition-colors duration-300">
                {post.title}
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/40">{post.date}</span>
                  <span className="size-0.5 rounded-full bg-border/40" />
                  <span className="text-[10px] text-muted-foreground/40">{post.readTime}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400/70 transition-transform duration-200 group-hover:translate-x-0.5">
                  Read
                  <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      <Separator className="mb-8 w-full max-w-3xl opacity-30" />

      {/* Quick Links with gradient sweep and dot pattern */}
      <ScrollReveal className="relative mb-8 w-full max-w-3xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => onNavigate("profile")}
            className="hover-gradient-sweep group flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-6 py-3 dot-pattern transition-all duration-300 hover:border-emerald-500/30 hover:bg-card/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/5"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-colors duration-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10">
              <User className="size-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-medium text-foreground">Profile</span>
              <span className="block text-[11px] text-muted-foreground">View skills &amp; projects</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:text-emerald-400/70 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => onNavigate("game")}
            className="hover-gradient-sweep group flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-6 py-3 dot-pattern transition-all duration-300 hover:border-teal-500/30 hover:bg-card/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-teal-500/5"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-colors duration-300 group-hover:text-teal-400 group-hover:bg-teal-500/10">
              <Gamepad2 className="size-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-medium text-foreground">Game</span>
              <span className="block text-[11px] text-muted-foreground">Play Tic-Tac-Toe vs AI</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:text-teal-400/70 group-hover:translate-x-0.5" />
          </button>
        </div>
      </ScrollReveal>
    </main>
  );
}
