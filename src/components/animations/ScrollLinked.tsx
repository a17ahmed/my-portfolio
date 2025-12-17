"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollLinkedProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  fade?: boolean;
  scale?: boolean;
  rotate?: boolean;
}

// Scroll-linked animation - progress tied directly to scroll position
export function ScrollLinked({
  children,
  className = "",
  direction = "left",
  distance = 200,
  fade = true,
  scale = false,
  rotate = false,
}: ScrollLinkedProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth spring for natural feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform based on direction
  const getTransform = () => {
    switch (direction) {
      case "left":
        return useTransform(smoothProgress, [0, 0.3, 0.7, 1], [-distance, 0, 0, -distance]);
      case "right":
        return useTransform(smoothProgress, [0, 0.3, 0.7, 1], [distance, 0, 0, distance]);
      case "up":
        return useTransform(smoothProgress, [0, 0.3, 0.7, 1], [-distance, 0, 0, -distance]);
      case "down":
        return useTransform(smoothProgress, [0, 0.3, 0.7, 1], [distance, 0, 0, distance]);
    }
  };

  const x = direction === "left" || direction === "right" ? getTransform() : 0;
  const y = direction === "up" || direction === "down" ? getTransform() : 0;
  const opacity = fade
    ? useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    : 1;
  const scaleValue = scale
    ? useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
    : 1;
  const rotateValue = rotate
    ? useTransform(smoothProgress, [0, 0.3, 0.7, 1], [-10, 0, 0, 10])
    : 0;

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        opacity,
        scale: scaleValue,
        rotate: rotateValue,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax effect - moves at different speed than scroll
interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative = slower, positive = faster
  direction?: "vertical" | "horizontal";
}

export function Parallax({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const range = 100 * speed;
  const transform = useTransform(smoothProgress, [0, 1], [-range, range]);

  return (
    <motion.div
      ref={ref}
      style={{
        y: direction === "vertical" ? transform : 0,
        x: direction === "horizontal" ? transform : 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Reveal on scroll - appears as you scroll into view
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const directions = {
    left: { x: useTransform(smoothProgress, [0, 1], [-100, 0]), y: 0 },
    right: { x: useTransform(smoothProgress, [0, 1], [100, 0]), y: 0 },
    up: { x: 0, y: useTransform(smoothProgress, [0, 1], [100, 0]) },
    down: { x: 0, y: useTransform(smoothProgress, [0, 1], [-100, 0]) },
  };

  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        x: directions[direction].x,
        y: directions[direction].y,
        opacity,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
