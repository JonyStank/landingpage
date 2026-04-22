"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Terminal,
  Layers,
  Zap,
  Palette,
  ChevronRight,
  TrendingUp,
  Copy,
  Check,
  GitCommit,
  GitPullRequest,
  Clock,
  User,
  Gamepad2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  },
  {
    icon: Layers,
    title: "Component Architecture",
    description: "Modular, reusable components with clean separation.",
  },
  {
    icon: Zap,
    title: "Interactive Game",
    description: "Functional Tic-Tac-Toe with state management.",
  },
  {
    icon: Palette,
    title: "Dark Minimalist",
    description: "Clean UI with carefully crafted visual hierarchy.",
  },
];

const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "67,432.18", change: "+2.4%", positive: true },
  { symbol: "ETH", name: "Ethereum", price: "3,521.07", change: "+1.8%", positive: true },
  { symbol: "SOL", name: "Solana", price: "178.92", change: "-0.6%", positive: false },
  { symbol: "BNB", name: "BNB", price: "612.35", change: "+3.1%", positive: true },
  { symbol: "ADA", name: "Cardano", price: "0.68", change: "-1.2%", positive: false },
  { symbol: "DOGE", name: "Dogecoin", price: "0.165", change: "+5.7%", positive: true },
  { symbol: "DOT", name: "Polkadot", price: "8.42", change: "+0.9%", positive: true },
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
          let processed = line;

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
            <div key={lineIdx}>
              {nodes}
              {lineIdx < lines.length - 1 ? "\n" : ""}
            </div>
          );
        })}
      </code>
    </pre>
  );
}

export default function Home({ onNavigate }: HomeProps) {
  const [typedText, setTypedText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

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

  return (
    <main className="relative flex flex-1 flex-col items-center px-6 py-12 overflow-hidden">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-40" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 20% 10%, oklch(0.7 0.12 170 / 0.06), transparent), radial-gradient(ellipse 500px 500px at 80% 20%, oklch(0.65 0.15 150 / 0.05), transparent), radial-gradient(ellipse 400px 300px at 60% 80%, oklch(0.6 0.1 200 / 0.04), transparent), radial-gradient(ellipse 700px 500px at 10% 70%, oklch(0.75 0.08 130 / 0.04), transparent), radial-gradient(ellipse 500px 600px at 50% 50%, oklch(0.985 0 0 / 0.02), transparent)",
        }}
      />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
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
            }}
          />
        ))}
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
            className="group flex items-center gap-2.5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            <Code2 className="size-4" />
            View Profile
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => onNavigate("game")}
            className="group flex items-center gap-2.5 rounded-lg border border-border/60 bg-secondary/10 px-6 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary/20 hover:border-border hover:-translate-y-0.5"
          >
            Play Game
          </button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 grid grid-cols-3 gap-8 text-center sm:gap-12"
        >
          {[
            { label: "Framework", value: "React 19" },
            { label: "Language", value: "TypeScript" },
            { label: "Styling", value: "Tailwind CSS" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-1.5 rounded-lg px-4 py-3 transition-all duration-300 hover:scale-105 hover:bg-secondary/30"
              style={{
                transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
              }}
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
          ))}
        </motion.div>
      </motion.div>

      <Separator className="my-10 w-full max-w-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
        className="relative mt-4 mb-4 w-full max-w-xl"
      >
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
      </motion.div>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.5, ease: "easeOut" }}
        className="relative mb-4 w-full max-w-3xl"
      >
        <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <TrendingUp className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Crypto Market</span>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        className="relative mb-4 w-full max-w-3xl"
      >
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
      </motion.div>

      <Separator className="my-8 w-full max-w-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className="relative mb-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
            className="group rounded-lg border border-border/30 bg-card/30 p-4 transition-all duration-300 hover:border-transparent hover:bg-card/50 hover:gradient-border hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                <feature.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/0 transition-all duration-300 -translate-x-1 group-hover:text-muted-foreground/60 group-hover:translate-x-0" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Separator className="mb-8 w-full max-w-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
        className="relative mb-8 w-full max-w-3xl"
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => onNavigate("profile")}
            className="group flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-6 py-3 transition-all duration-300 hover:border-emerald-500/30 hover:bg-card/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/5"
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
            className="group flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-6 py-3 transition-all duration-300 hover:border-teal-500/30 hover:bg-card/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-teal-500/5"
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
      </motion.div>
    </main>
  );
}
