"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  User,
  GraduationCap,
  Code2,
  TrendingUp,
  BookOpen,
  Github,
  Mail,
  MapPin,
  Calendar,
  BarChart3,
  ExternalLink,
  GitBranch,
  Send,
  CheckCircle2,
  Linkedin,
  Twitter,
  FolderGit2,
  Star,
  GitCommitHorizontal,
  Trophy,
  Zap,
} from "lucide-react";

const skills = [
  { name: "Python", level: 85, description: "Data analysis, automation, algorithmic trading" },
  { name: "JavaScript", level: 80, description: "React, Node.js, web development" },
  { name: "TypeScript", level: 75, description: "Type-safe applications, interfaces" },
  { name: "SQL", level: 70, description: "Database design, queries, optimization" },
];

const interests = [
  { name: "Crypto Market Analysis", icon: TrendingUp, description: "Price patterns, on-chain metrics, sentiment analysis" },
  { name: "Algorithmic Trading", icon: Code2, description: "Strategy development, backtesting, execution" },
  { name: "Financial Analysis", icon: BarChart3, description: "Fundamental analysis, risk assessment, valuation" },
];

const projects = [
  {
    name: "CryptoTracker",
    description: "Real-time cryptocurrency portfolio tracker with price alerts and performance analytics.",
    tech: ["Python", "JavaScript", "API"],
    link: "#",
    status: "active" as const,
  },
  {
    name: "AlgoTrade Bot",
    description: "Automated trading bot implementing momentum and mean-reversion strategies.",
    tech: ["Python", "Pandas", "CCXT"],
    link: "#",
    status: "development" as const,
  },
  {
    name: "FinDash",
    description: "Interactive financial dashboard with candlestick charts and technical indicators.",
    tech: ["TypeScript", "React", "Recharts"],
    link: "#",
    status: "active" as const,
  },
];

const timeline = [
  { year: "2022", event: "Enrolled in Computer Science" },
  { year: "2023", event: "Started exploring crypto & algorithmic trading" },
  { year: "2024", event: "Built first trading bot prototype" },
  { year: "2025", event: "3rd Year — React + TypeScript midterm project" },
];

const contributionData = [
  [0.3, 0.1, 0.5, 0.7, 0.1, 0.3, 0.9, 0.5, 0.1, 0.3, 0.7, 0.5, 0.1, 0.3, 0.5],
  [0.1, 0.5, 0.3, 0.9, 0.7, 0.1, 0.5, 0.3, 0.7, 0.9, 0.1, 0.3, 0.5, 0.7, 0.3],
  [0.5, 0.3, 0.1, 0.3, 0.5, 0.9, 0.7, 0.1, 0.5, 0.3, 0.7, 0.9, 0.3, 0.1, 0.7],
  [0.7, 0.9, 0.3, 0.1, 0.3, 0.5, 0.1, 0.7, 0.9, 0.5, 0.3, 0.1, 0.7, 0.5, 0.9],
  [0.1, 0.7, 0.5, 0.5, 0.9, 0.7, 0.3, 0.5, 0.3, 0.1, 0.5, 0.7, 0.9, 0.3, 0.1],
  [0.3, 0.5, 0.7, 0.9, 0.1, 0.3, 0.5, 0.9, 0.7, 0.5, 0.1, 0.5, 0.3, 0.9, 0.5],
  [0.5, 0.1, 0.9, 0.3, 0.7, 0.5, 0.9, 0.3, 0.1, 0.7, 0.9, 0.3, 0.1, 0.7, 0.3],
];

const statsData = [
  { label: "Projects", value: 3, icon: FolderGit2 },
  { label: "Experience", value: 2, suffix: "yr", icon: Trophy },
  { label: "Technologies", value: 8, icon: Zap },
  { label: "GPA", value: 3.7, decimals: 1, icon: BarChart3 },
];

const githubStats = [
  { label: "Repositories", value: 12, icon: FolderGit2 },
  { label: "Stars", value: 48, icon: Star },
  { label: "Contributions", value: 342, icon: GitCommitHorizontal },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/chenjiasheng" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:cs111210554@example.edu" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function StatusBadge({ status }: { status: "active" | "development" }) {
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-[10px] font-medium ${
        status === "active"
          ? "border-emerald-500/30 text-emerald-400"
          : "border-amber-500/30 text-amber-400"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          status === "active" ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />
      {status === "active" ? "Active" : "In Development"}
    </Badge>
  );
}

function CountUp({ target, decimals = 0, duration = 1.5 }: { target: number; decimals?: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Number((eased * target).toFixed(decimals)));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimals, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

export default function Profile() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: "", email: "", message: "" });
    }, 3000);
  }

  return (
    <main className="relative flex flex-1 items-start justify-center px-4 py-16 sm:px-6">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-30" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-2xl space-y-5"
      >
        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-secondary/80 via-secondary/40 to-secondary/80" />
            <CardHeader className="-mt-8">
              <CardTitle className="flex items-center gap-4 text-xl">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full animate-spin-slow opacity-70 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 blur-[2px]" />
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 animate-spin-slow" />
                  <div className="relative flex size-16 items-center justify-center rounded-full border-2 border-background bg-secondary text-lg font-bold text-foreground shadow-lg">
                    CJS
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span>陳家盛</span>
                  <span className="text-sm font-normal text-muted-foreground">Chen Jia-Sheng</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5 border-0">
                  <GraduationCap className="size-3" />
                  Computer Science
                </Badge>
                <Badge variant="secondary" className="gap-1.5 border-0">
                  <BookOpen className="size-3" />
                  3rd Year
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  ID: 111210554
                </Badge>
              </div>
              <Separator className="bg-border/40" />
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground/60" />
                  <span>cs111210554@example.edu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="size-3.5 text-muted-foreground/60" />
                  <span>github.com/chenjiasheng</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-muted-foreground/60" />
                  <span>Taiwan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-muted-foreground/60" />
                  <span>Expected Graduation: 2027</span>
                </div>
              </div>
              <Separator className="bg-border/40" />
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-lg border border-border/30 bg-secondary/10 text-muted-foreground transition-all duration-200 hover:border-border/60 hover:bg-secondary/30 hover:text-foreground hover:shadow-sm"
                  >
                    <link.icon className="size-4" />
                    <span className="sr-only">{link.label}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="size-4 text-muted-foreground" />
                Stats Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {statsData.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border/30 bg-secondary/5 p-3 transition-all duration-300 hover:border-border/50 hover:bg-secondary/10"
                  >
                    <stat.icon className="size-4 text-emerald-400/70" />
                    <span className="text-xl font-bold text-foreground">
                      <CountUp
                        target={stat.value}
                        decimals={stat.decimals ?? 0}
                        duration={1.2}
                      />
                      {stat.suffix ? (
                        <span className="text-sm font-normal text-muted-foreground">
                          {stat.suffix}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code2 className="size-4 text-muted-foreground" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {skills.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 + idx * 0.15 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>
                      <span className="font-mono font-medium">{skill.level}%</span>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs text-muted-foreground/70">{skill.description}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="size-4 text-muted-foreground" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {interests.map((interest, idx) => (
                  <motion.div
                    key={interest.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.3 }}
                    className="group relative flex items-start gap-3 rounded-lg border border-border/30 bg-secondary/10 px-3 py-3 transition-all duration-300 hover:border-border/60 hover:bg-gradient-to-br hover:from-emerald-500/5 hover:via-teal-500/5 hover:to-cyan-500/5"
                  >
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-foreground/20 via-foreground/50 to-foreground/20 transition-all duration-300 group-hover:from-emerald-400/60 group-hover:via-teal-400/80 group-hover:to-cyan-400/60" />
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition-colors duration-300 group-hover:bg-foreground/10 group-hover:text-foreground">
                      <interest.icon className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-medium text-foreground/90 leading-tight">
                        {interest.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 leading-snug">
                        {interest.description}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GitBranch className="size-4 text-muted-foreground" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.3 }}
                  className="group rounded-lg border border-border/30 bg-secondary/5 p-4 transition-all duration-300 hover:border-border/60 hover:bg-white/[0.03] hover:backdrop-blur-md dark:hover:bg-white/[0.03] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground/90">{project.name}</h4>
                        <StatusBadge status={project.status} />
                      </div>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <a
                      href={project.link}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/30 text-muted-foreground/50 transition-all duration-200 hover:border-border/60 hover:text-foreground"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Github className="size-4 text-muted-foreground" />
                GitHub Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {githubStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-border/30 bg-secondary/5 p-4 transition-all duration-300 hover:border-border/50 hover:bg-secondary/10"
                  >
                    <stat.icon className="size-5 text-muted-foreground/50" />
                    <span className="text-lg font-bold text-foreground tabular-nums">
                      <CountUp target={stat.value} duration={1.5} />
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="size-4 text-muted-foreground" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <AnimatePresence>
                  {contactSent && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 mb-4">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                        <span className="text-sm text-emerald-400">Message sent successfully! I&apos;ll get back to you soon.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="border-border/30 bg-secondary/10 text-sm placeholder:text-muted-foreground/50 rounded-lg"
                  />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="border-border/30 bg-secondary/10 text-sm placeholder:text-muted-foreground/50 rounded-lg"
                  />
                  <Textarea
                    placeholder="Your message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    required
                    rows={4}
                    className="border-border/30 bg-secondary/10 text-sm placeholder:text-muted-foreground/50 rounded-lg resize-none"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full gap-2"
                    disabled={contactSent}
                  >
                    {contactSent ? (
                      <>
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/40 bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="size-4 text-muted-foreground" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                  Activity
                </p>
                <div className="flex flex-col gap-[3px]">
                  {contributionData.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-[3px]">
                      {row.map((level, colIdx) => (
                        <motion.div
                          key={`${rowIdx}-${colIdx}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 1.0 + (rowIdx * 15 + colIdx) * 0.003,
                            duration: 0.15,
                          }}
                          className="size-[10px] rounded-[2px] bg-foreground"
                          style={{ opacity: level }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-muted-foreground/40">Less</span>
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((l) => (
                    <div
                      key={l}
                      className="size-[10px] rounded-[2px] bg-foreground"
                      style={{ opacity: l }}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground/40">More</span>
                </div>
              </div>

              <Separator className="bg-border/40" />

              <div className="relative">
                <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border/30 md:left-1/2 md:-translate-x-px" />
                <div className="space-y-0">
                  {timeline.map((entry, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                      <motion.div
                        key={entry.year}
                        initial={{ opacity: 0, x: isLeft ? -12 : 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + idx * 0.12, duration: 0.35 }}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        <div className="hidden md:flex md:w-1/2 md:justify-end md:pr-8">
                          {isLeft ? (
                            <div className="flex flex-col items-end text-right">
                              <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                              <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                            </div>
                          ) : null}
                        </div>
                        <div className="relative z-10 flex shrink-0">
                          <div className="flex size-6 items-center justify-center rounded-full border border-border/50 bg-card shadow-sm">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground">
                              {entry.year.slice(2)}
                            </span>
                          </div>
                        </div>
                        <div className="md:hidden flex-1">
                          <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                          <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                        </div>
                        <div className="hidden md:flex md:w-1/2 md:pl-8">
                          {!isLeft ? (
                            <div className="flex flex-col">
                              <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                              <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
