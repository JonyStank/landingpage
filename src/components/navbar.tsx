"use client";

import { cn } from "@/lib/utils";
import { Home, User, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <button
          onClick={() => onNavigate("home")}
          className="font-mono text-sm font-semibold tracking-wider text-foreground transition-all duration-300 hover:text-muted-foreground"
        >
          <span className="text-muted-foreground/60">&lt;</span>
          CJS
          <span className="text-muted-foreground/60"> /&gt;</span>
        </button>
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
      </nav>
    </header>
  );
}
