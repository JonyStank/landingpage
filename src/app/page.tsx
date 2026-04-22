"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Home from "@/components/home";
import Profile from "@/components/profile";
import TicTacToe from "@/components/tic-tac-toe";
import { AnimatePresence, motion } from "framer-motion";

type Page = "home" | "profile" | "game";

const VALID_PAGES: Page[] = ["home", "profile", "game"];

const pageComponents: Record<Page, React.ComponentType<{ onNavigate: (page: Page) => void }>> = {
  home: Home,
  profile: Profile,
  game: TicTacToe,
};

function getInitialPage(): Page {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.replace("#", "");
    if (VALID_PAGES.includes(hash as Page)) {
      return hash as Page;
    }
  }
  return "home";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PageComponent = pageComponents[currentPage];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex min-h-[calc(100vh-3.5rem)]"
          >
            <PageComponent onNavigate={handleNavigate} />
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="border-t border-border/30 py-4 text-center text-xs text-muted-foreground">
        <span className="font-mono">&copy; {new Date().getFullYear()} 陳家盛 &middot; React + TypeScript Midterm</span>
      </footer>
    </div>
  );
}
