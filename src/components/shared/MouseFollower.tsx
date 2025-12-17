"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MouseFollowerProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export function MouseFollower({
  children,
  intensity = 0.1,
  className = "",
}: MouseFollowerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });

  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const updateElementCenter = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setElementCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateElementCenter();
    window.addEventListener("resize", updateElementCenter);
    window.addEventListener("scroll", updateElementCenter);

    return () => {
      window.removeEventListener("resize", updateElementCenter);
      window.removeEventListener("scroll", updateElementCenter);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const deltaX = (mousePosition.x - elementCenter.x) * intensity;
    const deltaY = (mousePosition.y - elementCenter.y) * intensity;
    x.set(deltaX);
    y.set(deltaY);
  }, [mousePosition, elementCenter, intensity, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating element that follows mouse with parallax effect
export function ParallaxElement({
  children,
  depth = 1,
  className = "",
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      x.set(deltaX * 30 * depth);
      y.set(deltaY * 30 * depth);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [depth, x, y]);

  return (
    <motion.div
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
