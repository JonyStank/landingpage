"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, GraduationCap, Code2, TrendingUp, BookOpen } from "lucide-react";

const skills = [
  { name: "Python", level: 85 },
  { name: "JavaScript", level: 80 },
];

const interests = [
  "Crypto market analysis",
  "Algorithmic trading",
  "Financial analysis",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Profile() {
  return (
    <main className="flex flex-1 items-start justify-center px-6 py-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl space-y-6"
      >
        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <User className="size-5 text-foreground" />
                </div>
                <div className="flex flex-col">
                  <span>陳家盛</span>
                  <span className="text-sm font-normal text-muted-foreground">Chen Jia-Sheng</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <GraduationCap className="size-3" />
                  Computer Science
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <BookOpen className="size-3" />
                  3rd Year
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  111210554
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code2 className="size-4 text-muted-foreground" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                      className="h-full rounded-full bg-foreground"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="size-4 text-muted-foreground" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {interests.map((interest, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="size-1 rounded-full bg-foreground/40" />
                    {interest}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
