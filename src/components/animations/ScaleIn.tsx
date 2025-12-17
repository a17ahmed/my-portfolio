"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  once = false,
}: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px", once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, scale: 1 });
    } else if (!once) {
      controls.start({ opacity: 0, scale: 0.8 });
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
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
