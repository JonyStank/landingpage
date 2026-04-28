"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { X, HelpCircle, Search, Navigation, Gamepad2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortcutsOverlayProps {
  onClose: () => void;
}

interface Shortcut {
  keys: string;
  description: string;
}

interface ShortcutGroup {
  category: string;
  icon: typeof Navigation;
  shortcuts: Shortcut[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    category: "Navigation",
    icon: Navigation,
    shortcuts: [
      { keys: "1 – 9", description: "Place mark in cell" },
      { keys: "↑ ↓ ← →", description: "Navigate cells" },
      { keys: "Enter / Space", description: "Confirm selection" },
    ],
  },
  {
    category: "Game Controls",
    icon: Gamepad2,
    shortcuts: [
      { keys: "Ctrl+Z", description: "Undo last move" },
      { keys: "N", description: "New game" },
      { keys: "T", description: "Toggle theme" },
    ],
  },
  {
    category: "General",
    icon: Settings2,
    shortcuts: [
      { keys: "?", description: "Toggle this help" },
      { keys: "Esc", description: "Close overlay / dialog" },
    ],
  },
];

export default function ShortcutsOverlay({ onClose }: ShortcutsOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter shortcuts based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return shortcutGroups;
    const q = searchQuery.toLowerCase();
    return shortcutGroups
      .map(group => ({
        ...group,
        shortcuts: group.shortcuts.filter(
          s => s.description.toLowerCase().includes(q) || s.keys.toLowerCase().includes(q)
        ),
      }))
      .filter(group => group.shortcuts.length > 0);
  }, [searchQuery]);

  // Total count of visible shortcuts for keyboard navigation
  const totalShortcuts = filteredGroups.reduce((sum, g) => sum + g.shortcuts.length, 0);

  // Flatten to a list for highlight index tracking
  const flatShortcuts = useMemo(
    () => filteredGroups.flatMap(g => g.shortcuts),
    [filteredGroups]
  );

  // Focus the search input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightIndex(0);
  }, [searchQuery]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll("[data-shortcut-index]");
      const target = items[highlightIndex] as HTMLElement | undefined;
      if (target) {
        target.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  // Keyboard navigation within overlay
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex(prev => (prev + 1) % totalShortcuts);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex(prev => (prev - 1 + totalShortcuts) % totalShortcuts);
      } else if (e.key === "Enter" && flatShortcuts[highlightIndex]) {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalShortcuts, flatShortcuts, highlightIndex, onClose]);

  let globalIndex = -1;

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
        className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-border/40 bg-card/80 p-6 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20 ring-focus"
            aria-label="Close shortcuts"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Filter shortcuts…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/30 bg-secondary/20 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-border/60 focus:bg-secondary/30 ring-focus"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Shortcuts list */}
        <div ref={listRef} className="max-h-72 space-y-4 overflow-y-auto pr-1">
          {filteredGroups.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground/50">No shortcuts found</p>
            </div>
          ) : (
            filteredGroups.map(group => {
              const GroupIcon = group.icon;
              return (
                <div key={group.category}>
                  {/* Group header */}
                  <div className="mb-2 flex items-center gap-2 px-3">
                    <GroupIcon className="size-3 text-muted-foreground/40" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                      {group.category}
                    </span>
                  </div>

                  {/* Shortcuts in group */}
                  <div className="space-y-0.5">
                    {group.shortcuts.map(shortcut => {
                      globalIndex++;
                      const currentIndex = globalIndex;
                      const isHighlighted = highlightIndex === currentIndex;
                      return (
                        <div
                          key={shortcut.keys}
                          data-shortcut-index={currentIndex}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
                            isHighlighted
                              ? "bg-secondary/40 text-foreground"
                              : "text-muted-foreground hover:bg-secondary/20"
                          )}
                        >
                          <span className="text-sm">
                            {shortcut.description}
                          </span>
                          <kbd className="rounded-md border border-border/40 bg-secondary/30 px-2 py-0.5 font-mono text-xs text-foreground/80 shrink-0 ml-3">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      );
                    })}
                  </div>

                  {/* Separator line (except after last group) */}
                  {filteredGroups.indexOf(group) < filteredGroups.length - 1 && (
                    <div className="my-3 mx-3 h-px bg-border/20" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground/40">
          Press <kbd className="rounded border border-border/30 px-1 py-0.5 text-[10px]">↑↓</kbd> navigate
          {" · "}
          <kbd className="rounded border border-border/30 px-1 py-0.5 text-[10px]">Enter</kbd> close
          {" · "}
          <kbd className="rounded border border-border/30 px-1 py-0.5 text-[10px]">Esc</kbd> dismiss
        </p>
      </motion.div>
    </motion.div>
  );
}
