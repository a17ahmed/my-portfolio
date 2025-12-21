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
  const [isIdle, setIsIdle] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState<"none" | "wink" | "lookAround">("none");
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationRef = useRef<NodeJS.Timeout | null>(null);

  const startIdleAnimations = useCallback(() => {
    setIsIdle(true);

    const runIdleAnimation = () => {
      const animations = ["wink", "lookAround", "wink", "lookAround"] as const;
      let index = 0;

      const animate = () => {
        if (!isIdle) return;

        setIdleAnimation(animations[index % animations.length]);

        setTimeout(() => {
          setIdleAnimation("none");
        }, animations[index % animations.length] === "lookAround" ? 2000 : 300);

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

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (idleAnimationRef.current) {
      clearTimeout(idleAnimationRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      startIdleAnimations();
    }, 5000);
  }, [startIdleAnimations]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isIdle) {
        resetIdleTimer();
      }

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxMove = 6;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const clampedDistance = Math.min(distance, 200);
      const ratio = clampedDistance / 200;

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

  const lookAroundPositions = [
    { x: -6, y: -4 },
    { x: 6, y: -4 },
    { x: 6, y: 4 },
    { x: -6, y: 4 },
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 15, delay: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onChatOpen}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-20 right-0 px-4 py-3 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10 min-w-[200px]"
          >
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Chat with me!</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">I'll tell you more about Ahmed</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-800/95 border-r border-b border-cyan-500/30 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Container */}
      <motion.div
        className="relative w-20 h-20 md:w-24 md:h-24"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-purple-500/40 rounded-full blur-xl"
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered ? 0.8 : 0.5,
          }}
        />

        {/* Main body - cute blob shape */}
        <motion.div
          className="relative w-full h-full"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Body */}
          <div className="absolute inset-0 rounded-[40%_40%_45%_45%] bg-gradient-to-br from-cyan-400 via-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30">
            {/* Shine effect */}
            <div className="absolute top-2 left-3 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/40 blur-sm" />
            <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-white/60" />
          </div>

          {/* Face area */}
          <div className="absolute inset-2 flex flex-col items-center justify-center">
            {/* Eyes container */}
            <div className="flex items-center gap-3 md:gap-4 mb-1">
              {/* Left Eye */}
              <div className="relative">
                <motion.div
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden"
                  animate={{
                    scaleY: idleAnimation === "wink" ? 0.1 : 1,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <motion.div
                    className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-900 relative"
                    animate={{
                      x: currentEyePosition.x,
                      y: currentEyePosition.y,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                  </motion.div>
                </motion.div>

                {/* Cute eyelash */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <div className="w-0.5 h-1.5 bg-gray-800 rounded-full -rotate-12" />
                  <div className="w-0.5 h-2 bg-gray-800 rounded-full" />
                  <div className="w-0.5 h-1.5 bg-gray-800 rounded-full rotate-12" />
                </div>
              </div>

              {/* Right Eye */}
              <div className="relative">
                <motion.div
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden"
                  animate={{
                    scaleY: idleAnimation === "wink" ? 1 : 1,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  {idleAnimation === "wink" ? (
                    <motion.div
                      initial={{ scaleY: 1 }}
                      animate={{ scaleY: [1, 0.1, 1] }}
                      transition={{ duration: 0.3 }}
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-900 relative"
                    >
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-900 relative"
                      animate={{
                        x: currentEyePosition.x,
                        y: currentEyePosition.y,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Cute eyelash */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <div className="w-0.5 h-1.5 bg-gray-800 rounded-full -rotate-12" />
                  <div className="w-0.5 h-2 bg-gray-800 rounded-full" />
                  <div className="w-0.5 h-1.5 bg-gray-800 rounded-full rotate-12" />
                </div>
              </div>
            </div>

            {/* Blush spots */}
            <div className="flex justify-between w-full px-2 -mt-1">
              <div className="w-3 h-2 md:w-4 md:h-2 rounded-full bg-pink-400/50" />
              <div className="w-3 h-2 md:w-4 md:h-2 rounded-full bg-pink-400/50" />
            </div>

            {/* Mouth */}
            <motion.div
              className="mt-1"
              animate={{
                scale: isHovered ? 1.2 : 1,
              }}
            >
              {isHovered ? (
                <div className="w-4 h-3 md:w-5 md:h-4 rounded-b-full bg-gray-800 border-t-2 border-pink-300" />
              ) : (
                <svg width="16" height="8" viewBox="0 0 16 8" className="md:w-5 md:h-3">
                  <path
                    d="M2 2 Q8 8 14 2"
                    stroke="#1f2937"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              )}
            </motion.div>
          </div>

          {/* Waving hand */}
          <AnimatePresence>
            {(isWaving || isHovered) && (
              <motion.div
                className="absolute -right-4 bottom-2 text-2xl"
                initial={{ rotate: 0, scale: 0 }}
                animate={{
                  rotate: [0, 20, -10, 20, -10, 0],
                  scale: 1,
                }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.8 }}
              >
                👋
              </motion.div>
            )}
          </AnimatePresence>

          {/* Small antenna/hair tuft */}
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-1 h-4 bg-gradient-to-t from-cyan-500 to-purple-400 rounded-full" />
            <motion.div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-300"
              animate={{
                boxShadow: [
                  "0 0 4px rgba(253, 224, 71, 0.5)",
                  "0 0 12px rgba(253, 224, 71, 0.8)",
                  "0 0 4px rgba(253, 224, 71, 0.5)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Little feet */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-2">
            <motion.div
              className="w-3 h-2 rounded-full bg-cyan-600"
              animate={{ rotate: isHovered ? [-5, 5] : 0 }}
              transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
            />
            <motion.div
              className="w-3 h-2 rounded-full bg-cyan-600"
              animate={{ rotate: isHovered ? [5, -5] : 0 }}
              transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
            />
          </div>
        </motion.div>

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
            style={{
              top: `${10 + i * 25}%`,
              left: i % 2 === 0 ? "-15%" : "105%",
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.4,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
