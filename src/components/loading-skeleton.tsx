"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  delay?: number;
}

function Skeleton({ className, delay = 0 }: SkeletonProps) {
  return (
    <motion.div
      className={`animate-pulse rounded-md bg-secondary/20 ${className || ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 gap-6">
      {/* Pulsing logo with shimmer */}
      <motion.div
        className="font-mono text-lg font-semibold tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.4 }}
      >
        <span className="inline-block bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/40 to-muted-foreground/20 bg-[length:200%_100%] bg-clip-text text-transparent shimmer">
          {"<CJS />"}
        </span>
      </motion.div>

      {/* Hero area */}
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-12 w-72 rounded-lg" delay={100} />
        <Skeleton className="h-4 w-96 rounded-full" delay={150} />
        <Skeleton className="h-4 w-80 rounded-full" delay={200} />
        <Skeleton className="h-4 w-64 rounded-full" delay={250} />
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36 rounded-full" delay={300} />
        <Skeleton className="h-10 w-36 rounded-full" delay={350} />
      </div>

      {/* Feature cards — varied shapes */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-xl" delay={400} />
        <Skeleton className="h-32 rounded-2xl" delay={450} />
        <Skeleton className="h-32 rounded-xl" delay={500} />
        <Skeleton className="h-32 rounded-2xl" delay={550} />
      </div>

      {/* Additional varied skeleton shapes */}
      <div className="flex w-full max-w-2xl items-center gap-4">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full" delay={600} />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-3/4 rounded-full" delay={620} />
          <Skeleton className="h-3 w-1/2 rounded-full" delay={640} />
          <Skeleton className="h-3 w-2/3 rounded-full" delay={660} />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex w-full max-w-2xl gap-6">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" delay={700} />
          <Skeleton className="h-2 w-12 rounded-full" delay={720} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" delay={740} />
          <Skeleton className="h-2 w-12 rounded-full" delay={760} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" delay={780} />
          <Skeleton className="h-2 w-12 rounded-full" delay={800} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" delay={820} />
          <Skeleton className="h-2 w-12 rounded-full" delay={840} />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex min-h-[calc(100vh-3.5rem)]"
    >
      <PageSkeleton />
    </motion.div>
  );
}
