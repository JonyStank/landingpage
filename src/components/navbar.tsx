"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Home, User, Gamepad2, Sun, Moon, HelpCircle, Bell, Menu, X, Trophy, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Page = "home" | "profile" | "game";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface Notification {
  id: number;
  icon: typeof Trophy;
  text: string;
  time: string;
  color: string;
}

const navItems: { key: Page; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "profile", label: "Profile", icon: User },
  { key: "game", label: "Game", icon: Gamepad2 },
];

const notifications: Notification[] = [
  { id: 1, icon: Sparkles, text: "AI game update released", time: "2m ago", color: "text-emerald-400" },
  { id: 2, icon: Eye, text: "Profile viewed 12 times", time: "1h ago", color: "text-teal-400" },
  { id: 3, icon: Trophy, text: "New achievement unlocked", time: "3h ago", color: "text-amber-400" },
];

function getInitialTheme(): "dark" | "light" {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("theme") as "dark" | "light") ?? "dark";
  }
  return "dark";
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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
      setScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border/40 bg-background/70 backdrop-blur-2xl shadow-[0_1px_3px_oklch(0_0_0/8%)]"
            : "border-b border-border/20 bg-background/60 backdrop-blur-xl"
        )}
      >
        {/* Top scroll progress bar (1px, emerald) */}
        <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          {/* Left side: Logo + Theme toggle */}
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

          {/* Right side: Desktop nav pills + Notification + Shortcuts */}
          <div className="hidden sm:flex items-center gap-1.5">
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
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(prev => !prev)}
                className="relative flex size-8 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
                aria-label="Notifications"
              >
                <Bell className="size-3.5" />
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              {/* Notification dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-border/40 bg-card/90 shadow-xl backdrop-blur-xl"
                  >
                    <div className="border-b border-border/30 px-4 py-2.5">
                      <h3 className="text-xs font-semibold tracking-wide text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/20"
                          onClick={() => setNotifOpen(false)}
                        >
                          <div className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary/30", notif.color)}>
                            <notif.icon className="size-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug text-foreground">{notif.text}</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground/60">{notif.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-border/30 px-4 py-2">
                      <button className="text-[11px] text-muted-foreground/50 transition-colors hover:text-muted-foreground">
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shortcuts button */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
              className="flex size-7 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
              aria-label="Keyboard shortcuts (?)"
            >
              <HelpCircle className="size-3.5" />
            </button>
          </div>

          {/* Mobile: Hamburger + Notification */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Mobile notification bell (compact) */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(prev => !prev)}
                className="relative flex size-8 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
                aria-label="Notifications"
              >
                <Bell className="size-3.5" />
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              {/* Mobile notification dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-border/40 bg-card/90 shadow-xl backdrop-blur-xl sm:hidden"
                  >
                    <div className="border-b border-border/30 px-4 py-2.5">
                      <h3 className="text-xs font-semibold tracking-wide text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-secondary/20"
                          onClick={() => setNotifOpen(false)}
                        >
                          <div className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary/30", notif.color)}>
                            <notif.icon className="size-3" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] leading-snug text-foreground">{notif.text}</p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground/60">{notif.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex size-8 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mobileMenuOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen nav overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <nav className="flex flex-col items-center gap-2">
              {navItems.map(({ key, label, icon: Icon }, index) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.07,
                    ease: "easeOut",
                  }}
                  onClick={() => handleNavClick(key)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-8 py-4 text-lg font-medium transition-all duration-200",
                    currentPage === key
                      ? "bg-secondary/60 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </motion.button>
              ))}

              {/* Shortcuts button in mobile nav */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, delay: navItems.length * 0.07, ease: "easeOut" }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
                }}
                className="mt-4 flex items-center gap-4 rounded-xl px-8 py-4 text-lg font-medium text-muted-foreground/50 transition-all duration-200 hover:text-muted-foreground hover:bg-secondary/20"
              >
                <HelpCircle className="size-5" />
                Shortcuts
              </motion.button>
            </nav>

            {/* Decorative bottom label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="absolute bottom-12 font-mono text-[11px] text-muted-foreground/25"
            >
              Press <kbd className="rounded border border-border/20 px-1 py-0.5 text-[10px]">?</kbd> for shortcuts
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
