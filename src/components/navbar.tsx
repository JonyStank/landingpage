"use client";

import { cn } from "@/lib/utils";
import { Home, User, Gamepad2 } from "lucide-react";

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <button
          onClick={() => onNavigate("home")}
          className="font-mono text-sm font-medium tracking-wider text-foreground transition-opacity hover:opacity-70"
        >
          &lt;CJS /&gt;
        </button>
        <div className="flex items-center gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                currentPage === key
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
