"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Terminal, Layers, Zap, Palette } from "lucide-react";

interface HomeProps {
  onNavigate: (page: "profile" | "game") => void;
}

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

export default function Home({ onNavigate }: HomeProps) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 overflow-hidden">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div variants={item} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/20 px-4 py-1.5 text-sm text-muted-foreground">
            <Terminal className="size-3.5" />
            <span className="font-mono">react + typescript midterm</span>
            <span className="size-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl glow-text"
        >
          <span className="text-foreground">React + TS</span>
          <br />
          <span className="text-muted-foreground/80">Midterm Project</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mb-10 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A minimal web application built with React and TypeScript.
          Featuring clean architecture, dark UI, and interactive components.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3">
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
            <div key={label} className="flex flex-col gap-1.5">
              <span className="font-mono text-lg font-semibold text-foreground">{value}</span>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className="relative mt-20 mb-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
            className="group rounded-lg border border-border/30 bg-card/30 p-4 transition-all duration-300 hover:border-border/60 hover:bg-card/50"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                <feature.icon className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{feature.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
