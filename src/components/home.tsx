"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Terminal,
  Layers,
  Zap,
  Palette,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

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

/** Simple pseudo-syntax highlighting using colored spans */
function HighlightedCode({ code }: { code: string }) {
  // Map of patterns to highlight classes — order matters (first match wins per token)
  const rules: { pattern: RegExp; cls: string }[] = [
    // Keywords
    { pattern: /\b(function|const|return)\b/g, cls: "text-emerald-500/80" },
    // React component names (PascalCase at start of line)
    { pattern: /^(\s*)(<[A-Z]\w*)/gm, cls: "text-sky-400/80" },
    // HTML/component tags (PascalCase or lowercase tags)
    { pattern: /(<\/?)([A-Z]\w+)/g, cls: "text-sky-400/80" },
    { pattern: /(<\/?)(div|span|p|h[1-6]|main|section|header|nav)/g, cls: "text-muted-foreground/70" },
    // String literals
    { pattern: /(".*?")/g, cls: "text-amber-400/70" },
    // Props (identifiers before = inside JSX)
    { pattern: /\b(className|onNavigate|current)\b(?=\s*=)/g, cls: "text-violet-400/70" },
    // Hook calls
    { pattern: /\b(useState)\b/g, cls: "text-cyan-400/80" },
    // Brackets / punctuation
    { pattern: /([(){}[\]=;,])/g, cls: "text-muted-foreground/50" },
    // JSX angle brackets
    { pattern: /(\/?>|<\/)/g, cls: "text-muted-foreground/50" },
  ];

  // Simple approach: split code into lines and apply token-level coloring
  // For simplicity, we process line by line and wrap matched tokens
  const lines = code.split("\n");

  return (
    <pre className="font-mono text-xs leading-relaxed text-foreground/70 overflow-x-auto">
      <code>
        {lines.map((line, lineIdx) => {
          let processed = line;

          // Collect all matches and sort by position to avoid overlaps
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
              // For patterns with groups, determine which group is the highlight target
              let start = m.index;
              let end = m.index + m[0].length;
              let text = m[0];

              // If group 2 exists and is non-empty (e.g., tag name group), use it
              if (m[2] !== undefined) {
                start = m.index + m[1].length;
                end = start + m[2].length;
                text = m[2];
              }

              allMatches.push({ start, end, cls: rule.cls, text });
            }
          }

          // Sort by start position, then by length descending (longer matches first)
          allMatches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

          // Remove overlapping matches (keep first, longest)
          const filtered: Match[] = [];
          let lastEnd = -1;
          for (const match of allMatches) {
            if (match.start >= lastEnd) {
              filtered.push(match);
              lastEnd = match.end;
            }
          }

          // Build the line as React nodes
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
  /* ── Typing animation state ── */
  const [typedText, setTypedText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIdx];

    if (!isDeleting && typedText === currentPhrase) {
      // Finished typing — pause, then start deleting
      const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && typedText === "") {
      // Finished deleting — schedule move to next phrase via timeout to avoid sync setState
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
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient grid background */}
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* Gradient glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

      {/* Floating particles */}
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
        {/* Badge */}
        <motion.div variants={item} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/20 px-4 py-1.5 text-sm text-muted-foreground">
            <Terminal className="size-3.5" />
            <span className="font-mono">react + typescript midterm</span>
            <span className="size-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </motion.div>

        {/* Hero heading with typing animation */}
        <motion.h1
          variants={item}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl glow-text"
        >
          <span className="text-foreground">React + TS</span>
          <br />
          <span className="text-muted-foreground/80">
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

        {/* CTA Buttons */}
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

        {/* Tech Stats with pulsing dot */}
        <motion.div
          variants={item}
          className="mt-16 grid grid-cols-3 gap-8 text-center sm:gap-12"
        >
          {[
            { label: "Framework", value: "React 19" },
            { label: "Language", value: "TypeScript" },
            { label: "Styling", value: "Tailwind CSS" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
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

      {/* Code Snippet Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
        className="relative mt-14 mb-8 w-full max-w-xl"
      >
        <div className="rounded-lg border border-border/30 bg-card/40 overflow-hidden backdrop-blur-sm">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-border/30 bg-secondary/20 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500/70" />
              <span className="size-2.5 rounded-full bg-yellow-500/70" />
              <span className="size-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="ml-2 text-[11px] font-mono text-muted-foreground/60">
              App.tsx
            </span>
          </div>
          {/* Code body */}
          <div className="p-4">
            <HighlightedCode code={codeSnippet} />
          </div>
        </div>
      </motion.div>

      {/* Crypto Ticker Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.5, ease: "easeOut" }}
        className="relative mb-8 w-full max-w-3xl"
      >
        <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <TrendingUp className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Crypto Market</span>
          </div>
          {/* Scrollable ticker */}
          <div className="relative">
            {/* Left gradient mask */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-card/80 to-transparent" />
            {/* Right gradient mask */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-card/80 to-transparent" />
            <div className="no-scrollbar flex gap-1 overflow-x-auto p-3">
              {cryptoData.map((coin) => (
                <div
                  key={coin.symbol}
                  className="flex shrink-0 items-center gap-3 rounded-lg border border-border/30 bg-secondary/10 px-3.5 py-2.5 transition-all duration-200 hover:border-border/60 hover:bg-secondary/20"
                >
                  {/* Symbol circle */}
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

      {/* Feature Cards with gradient border on hover */}
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
            className="group rounded-lg border border-border/30 bg-card/30 p-4 transition-all duration-300 hover:border-transparent hover:bg-card/50 hover:gradient-border"
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
    </main>
  );
}
