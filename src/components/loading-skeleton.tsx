"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-secondary/20 ${className || ""}`}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 gap-6">
      <Skeleton className="h-6 w-40 rounded-full" />
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-12 w-72 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
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
