"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className = "",
  once = false,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once });
  const controls = useAnimation();

  const directions = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
    none: {},
  };

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, x: 0, y: 0 });
    } else if (!once) {
      controls.start({ opacity: 0, ...directions[direction] });
    }
  }, [isInView, controls, direction, once]);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={controls}
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
