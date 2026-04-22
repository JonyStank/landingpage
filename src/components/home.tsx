"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Terminal } from "lucide-react";

interface HomeProps {
  onNavigate: (page: "profile" | "game") => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex max-w-2xl flex-col items-center text-center"
      >
        <div className="mb-6 flex items-center gap-2 rounded-full border border-border/50 bg-secondary/30 px-4 py-1.5 text-sm text-muted-foreground">
          <Terminal className="size-3.5" />
          <span className="font-mono">react + typescript midterm</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-foreground">React + TS</span>
          <br />
          <span className="text-muted-foreground">Midterm Project</span>
        </h1>

        <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          A minimal web application built with React and TypeScript.
          Featuring clean architecture, dark UI, and interactive components.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate("profile")}
            className="group flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/10"
          >
            <Code2 className="size-4" />
            View Profile
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => onNavigate("game")}
            className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary hover:border-border/80"
          >
            Play Game
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 grid grid-cols-3 gap-8 text-center sm:gap-12"
      >
        {[
          { label: "Framework", value: "React 19" },
          { label: "Language", value: "TypeScript" },
          { label: "Styling", value: "Tailwind CSS" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="font-mono text-lg font-semibold text-foreground">{value}</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
