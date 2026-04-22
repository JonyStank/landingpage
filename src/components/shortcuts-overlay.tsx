"use client";

import { motion } from "framer-motion";
import { X, HelpCircle } from "lucide-react";

interface ShortcutsOverlayProps {
  onClose: () => void;
}

const shortcuts = [
  { keys: "1 – 9", description: "Place mark in cell" },
  { keys: "↑ ↓ ← →", description: "Navigate cells" },
  { keys: "Enter / Space", description: "Confirm selection" },
  { keys: "Ctrl+Z", description: "Undo last move" },
  { keys: "?", description: "Toggle this help" },
  { keys: "N", description: "New game" },
  { keys: "T", description: "Toggle theme" },
];

export default function ShortcutsOverlay({ onClose }: ShortcutsOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md rounded-xl border border-border/40 bg-card/80 p-6 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
            aria-label="Close shortcuts"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-1">
          {shortcuts.map(({ keys, description }) => (
            <div
              key={keys}
              className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-secondary/20"
            >
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
              <kbd className="rounded-md border border-border/40 bg-secondary/30 px-2 py-0.5 font-mono text-xs text-foreground/80">
                {keys}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground/40">
          Press <kbd className="rounded border border-border/30 px-1 py-0.5 text-[10px]">?</kbd> or{" "}
          <kbd className="rounded border border-border/30 px-1 py-0.5 text-[10px]">Esc</kbd> to close
        </p>
      </motion.div>
    </motion.div>
  );
}
