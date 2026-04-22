"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, User, Gamepad2, Sun, Moon, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Page = "home" | "profile" | "game";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { key: Page; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "profile", label: "Profile", icon: User },
  { key: "game", label: "Game", icon: Gamepad2 },
];

function getInitialTheme(): "dark" | "light" {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("theme") as "dark" | "light") ?? "dark";
  }
  return "dark";
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollTop / docHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="font-mono text-sm font-semibold tracking-wider text-foreground transition-all duration-300 hover:text-muted-foreground"
          >
            <span className="text-muted-foreground/60">&lt;</span>
            CJS
            <span className="text-muted-foreground/60"> /&gt;</span>
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex size-8 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 rounded-lg border border-border/30 bg-secondary/20 p-0.5">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={cn(
                "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300",
                currentPage === key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              {currentPage === key && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-md bg-secondary/60"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          </div>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
            className="flex size-7 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
            aria-label="Keyboard shortcuts (?)"
          >
            <HelpCircle className="size-3.5" />
          </button>
        </div>
      </nav>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-foreground/20 transition-opacity duration-300"
        style={{
          width: `${scrollProgress}%`,
          opacity: scrollProgress > 0 ? 1 : 0,
        }}
      />
    </header>
  );
}
