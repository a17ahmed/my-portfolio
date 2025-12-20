"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "left" | "right";
  className?: string;
  once?: boolean;
}

export function SlideIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "left",
  className = "",
  once = true,
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const initialX = direction === "left" ? -60 : 60;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
