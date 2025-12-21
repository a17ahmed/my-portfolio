"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Github, Linkedin, Twitter, Code, Sparkles } from "lucide-react";
import { CursorFollower } from "@/components/shared/CursorFollower";
import { Button } from "@/components/ui/button";

// STATIC DATA - kept as fallback (commented out when DB is working)
/*
const staticSocialLinks = [
  { name: "GitHub", href: "https://github.com", icon: "Github" },
  { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
  { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
];

const staticTaglines = [
  "I'm not a magician, but I can make bugs disappear ✨",
  "Turning caffeine into code since 2019 ☕",
  "I speak fluent JavaScript, Python & Sarcasm 💻",
  "404: Sleep not found 🌙",
  "Making the internet prettier, one pixel at a time 🎨",
];

const staticHeroData = {
  greeting: "Hello World, I'm",
  name: "Ahmed Irfan",
  title: "Full Stack Developer",
  description: "I craft beautiful, performant web experiences that users love. Specialized in React, Next.js, and modern web technologies.",
  backgroundImage: "/images/main-image.png",
  taglines: staticTaglines,
  socialLinks: staticSocialLinks,
};
*/

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Github,
  Linkedin,
  Twitter,
};

interface HeroData {
  greeting: string;
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  taglines: string[];
  socialLinks: { name: string; href: string; icon: string }[];
}

// Animated text character by character
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,
            delayChildren: delay,
          },
        },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
              },
            },
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Typewriter effect for taglines
function TypewriterTagline({ taglines }: { taglines: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <div className="h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl text-cyan-400 font-mono"
        >
          {taglines[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// Default fallback data
const defaultHeroData: HeroData = {
  greeting: "Hello World, I'm",
  name: "Ahmed Irfan",
  title: "Full Stack Developer",
  description: "I craft beautiful, performant web experiences that users love. Specialized in React, Next.js, and modern web technologies.",
  backgroundImage: "/images/main-image.png",
  taglines: [
    "I'm not a magician, but I can make bugs disappear ✨",
    "Turning caffeine into code since 2019 ☕",
    "I speak fluent JavaScript, Python & Sarcasm 💻",
    "404: Sleep not found 🌙",
    "Making the internet prettier, one pixel at a time 🎨",
  ],
  socialLinks: [
    { name: "GitHub", href: "https://github.com", icon: "Github" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
    { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
  ],
};

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);

  useEffect(() => {
    setMounted(true);

    // Fetch hero data from API
    async function fetchHeroData() {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        if (data && data.name) {
          setHeroData(data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        // Keep using default data on error
      }
    }

    fetchHeroData();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroData.backgroundImage}
          alt={`${heroData.name} - Developer`}
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Cute AI Assistant Character */}
      {mounted && <CursorFollower onChatOpen={() => console.log("Open AI Chat")} />}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Greeting with code bracket */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <Code className="h-5 w-5 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-lg">{heroData.greeting}</span>
          </motion.div>

          {/* Name - Big animated text */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
          >
            {mounted && <AnimatedText text={heroData.name} delay={0.5} />}
          </motion.h1>

          {/* Title with gradient */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6"
          >
            <span className="text-white">A </span>
            <span className="gradient-text">{heroData.title}</span>
          </motion.h2>

          {/* Rotating taglines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mb-8"
          >
            {mounted && <TypewriterTagline taglines={heroData.taglines} />}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed"
          >
            {heroData.description.split(/(\{cyan\}.*?\{\/cyan\}|\{purple\}.*?\{\/purple\})/).map((part, i) => {
              if (part.startsWith("{cyan}")) {
                return <span key={i} className="text-cyan-400 font-semibold">{part.replace("{cyan}", "").replace("{/cyan}", "")}</span>;
              }
              if (part.startsWith("{purple}")) {
                return <span key={i} className="text-purple-400 font-semibold">{part.replace("{purple}", "").replace("{/purple}", "")}</span>;
              }
              return part;
            })}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-6 text-lg rounded-full shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50 hover:scale-105"
              asChild
            >
              <a href="#projects">
                <Sparkles className="mr-2 h-5 w-5" />
                View My Work
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
              asChild
            >
              <a href="#contact">Let's Talk</a>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="flex gap-4"
          >
            {heroData.socialLinks.map((social, index) => {
              const IconComponent = iconMap[social.icon] || Github;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
                  aria-label={social.name}
                >
                  <IconComponent className="h-5 w-5" />
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/70 hover:text-cyan-400 transition-colors"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-current"
            />
          </div>
        </motion.a>
      </motion.div>
    </section>
  );
}
