"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface CursorFollowerProps {
  onChatOpen?: () => void;
}

export function CursorFollower({ onChatOpen }: CursorFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState<"none" | "blink" | "lookAround">("none");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationRef = useRef<NodeJS.Timeout | null>(null);

  const startIdleAnimations = useCallback(() => {
    setIsIdle(true);

    const runIdleAnimation = () => {
      const animations = ["blink", "lookAround", "blink", "lookAround"] as const;
      let index = 0;

      const animate = () => {
        if (!isIdle) return;

        setIdleAnimation(animations[index % animations.length]);

        setTimeout(() => {
          setIdleAnimation("none");
        }, animations[index % animations.length] === "lookAround" ? 2000 : 150);

        index++;
        idleAnimationRef.current = setTimeout(animate, 3000);
      };

      animate();
    };

    runIdleAnimation();
  }, [isIdle]);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    setIdleAnimation("none");

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (idleAnimationRef.current) clearTimeout(idleAnimationRef.current);

    idleTimerRef.current = setTimeout(() => {
      startIdleAnimations();
    }, 5000);
  }, [startIdleAnimations]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxMove = 8;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const clampedDistance = Math.min(distance, 150);
      const ratio = clampedDistance / 150;

      const moveX = (deltaX / (distance || 1)) * maxMove * ratio;
      const moveY = (deltaY / (distance || 1)) * maxMove * ratio;

      setEyePosition({ x: moveX, y: moveY });
      resetIdleTimer();
    };

    window.addEventListener("mousemove", handleMouseMove);

    idleTimerRef.current = setTimeout(() => {
      startIdleAnimations();
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (idleAnimationRef.current) clearTimeout(idleAnimationRef.current);
    };
  }, [resetIdleTimer, startIdleAnimations]);

  // Look around animation positions
  const lookAroundPositions = [
    { x: -8, y: -5 },
    { x: 8, y: -5 },
    { x: 8, y: 5 },
    { x: -8, y: 5 },
    { x: 0, y: 0 },
  ];

  const [lookAroundIndex, setLookAroundIndex] = useState(0);

  useEffect(() => {
    if (idleAnimation === "lookAround") {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % lookAroundPositions.length;
        setLookAroundIndex(index);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [idleAnimation]);

  const currentEyePosition = idleAnimation === "lookAround"
    ? lookAroundPositions[lookAroundIndex]
    : eyePosition;

  const isBlinkingNow = idleAnimation === "blink";

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 15, delay: 2.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onChatOpen}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-16 right-0 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-sm text-white whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span>Ask AI about Ahmed</span>
            </div>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/10 border-r border-b border-white/20 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Container */}
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full blur-2xl"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.8 : 0.5,
          }}
        />

        {/* Head */}
        <motion.div
          className="relative w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/20 shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* Screen/Face area */}
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

            {/* Eyes container */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 md:gap-4">
              {/* Left Eye */}
              <motion.div
                className="relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                animate={{
                  scaleY: isBlinkingNow ? 0.1 : 1,
                }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                  animate={{
                    x: currentEyePosition.x,
                    y: currentEyePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {/* Pupil */}
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/80" />
                </motion.div>
              </motion.div>

              {/* Right Eye */}
              <motion.div
                className="relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                animate={{
                  scaleY: isBlinkingNow ? 0.1 : 1,
                }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                  animate={{
                    x: currentEyePosition.x,
                    y: currentEyePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {/* Pupil */}
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/80" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Antenna */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-4 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full">
            <motion.div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
              animate={{
                boxShadow: [
                  "0 0 8px rgba(34, 211, 238, 0.5)",
                  "0 0 16px rgba(34, 211, 238, 0.8)",
                  "0 0 8px rgba(34, 211, 238, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Side details */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-0.5 w-1.5 h-6 bg-gray-700 rounded-l-lg" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-0.5 w-1.5 h-6 bg-gray-700 rounded-r-lg" />
        </motion.div>

        {/* Floating particles around character */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/40"
            style={{
              top: `${20 + i * 30}%`,
              left: i % 2 === 0 ? "-20%" : "110%",
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
