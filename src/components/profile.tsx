"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, GraduationCap, Code2, TrendingUp, BookOpen, Github, Mail, MapPin, Calendar } from "lucide-react";

const skills = [
  { name: "Python", level: 85, description: "Data analysis, automation, algorithmic trading" },
  { name: "JavaScript", level: 80, description: "React, Node.js, web development" },
  { name: "TypeScript", level: 75, description: "Type-safe applications, interfaces" },
  { name: "SQL", level: 70, description: "Database design, queries, optimization" },
];

const interests = [
  { name: "Crypto Market Analysis", icon: TrendingUp },
  { name: "Algorithmic Trading", icon: Code2 },
  { name: "Financial Analysis", icon: TrendingUp },
];

const timeline = [
  { year: "2022", event: "Enrolled in Computer Science" },
  { year: "2023", event: "Started exploring crypto & algorithmic trading" },
  { year: "2024", event: "Built first trading bot prototype" },
  { year: "2025", event: "3rd Year — React + TypeScript midterm project" },
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

export default function Profile() {
  return (
    <main className="relative flex flex-1 items-start justify-center px-6 py-16">
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
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-background bg-secondary text-lg font-bold text-foreground shadow-lg">
                  CJS
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
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 + idx * 0.15 }}
                      className="h-full rounded-full bg-foreground/80"
                    />
                  </div>
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {interests.map((interest, idx) => (
                  <motion.div
                    key={interest.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.3 }}
                    className="group flex items-center gap-3 rounded-lg border border-border/30 bg-secondary/10 px-3 py-2.5 transition-all duration-300 hover:border-border/60 hover:bg-secondary/20"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      <interest.icon className="size-3.5" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">{interest.name}</span>
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
                <Calendar className="size-4 text-muted-foreground" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {timeline.map((entry, idx) => (
                  <div key={entry.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary/30">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">{entry.year.slice(2)}</span>
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border/30" />
                      )}
                    </div>
                    <div className="pb-6">
                      <span className="font-mono text-xs text-muted-foreground">{entry.year}</span>
                      <p className="mt-0.5 text-sm text-foreground/90">{entry.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
