"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

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
  once = false,
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once });
  const controls = useAnimation();

  const initialX = direction === "left" ? -100 : 100;

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, x: 0 });
    } else if (!once) {
      controls.start({ opacity: 0, x: initialX });
    }
  }, [isInView, controls, initialX, once]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX }}
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
