"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Navbar from "@/components/navbar";
import Home from "@/components/home";
import Profile from "@/components/profile";
import TicTacToe from "@/components/tic-tac-toe";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import ShortcutsOverlay from "@/components/shortcuts-overlay";
import LoadingSkeleton from "@/components/loading-skeleton";

type Page = "home" | "profile" | "game";

const VALID_PAGES: Page[] = ["home", "profile", "game"];

const pageComponents: Record<Page, React.ComponentType<{ onNavigate: (page: Page) => void }>> = {
  home: Home,
  profile: Profile,
  game: TicTacToe,
};

function getPageFromHash(): Page {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace("#", "");
  if (VALID_PAGES.includes(hash as Page)) return hash as Page;
  return "home";
}

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export default function App() {
  const currentPage = useSyncExternalStore(subscribeToHash, getPageFromHash, () => "home" as Page);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
      if (e.key === "Escape") setShowShortcuts(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const PageComponent = pageComponents[currentPage];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex min-h-[calc(100vh-3.5rem)]"
          >
            <PageComponent onNavigate={handleNavigate} />
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="mt-auto py-5">
        <div className="mx-auto max-w-4xl px-6">
          <div className="diamond-divider mb-4">
            <span className="text-muted-foreground/20 text-xs select-none">◆</span>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="font-mono text-[11px] text-muted-foreground/50">
              &copy; {new Date().getFullYear()} 陳家盛
            </span>
            <div className="flex items-center gap-4">
              <button onClick={() => handleNavigate("home")} className="font-mono text-[11px] text-muted-foreground/40 transition-colors hover:text-muted-foreground/80">Home</button>
              <button onClick={() => handleNavigate("profile")} className="font-mono text-[11px] text-muted-foreground/40 transition-colors hover:text-muted-foreground/80">Profile</button>
              <button onClick={() => handleNavigate("game")} className="font-mono text-[11px] text-muted-foreground/40 transition-colors hover:text-muted-foreground/80">Game</button>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground/30">
              React + TypeScript
            </span>
          </div>
        </div>
      </footer>

      {/* Scroll-to-top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-border/40 bg-background/80 backdrop-blur-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-background"
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Keyboard shortcuts overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <ShortcutsOverlay onClose={() => setShowShortcuts(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
