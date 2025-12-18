"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  X,
  Smartphone,
  Monitor,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations";

type ProjectCategory = "all" | "web" | "mobile" | "fullstack";
type ProjectType = "web" | "mobile" | "fullstack";

interface Screenshot {
  src: string;
  alt: string;
  type: "desktop" | "mobile";
}

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  techStack: string[];
  category: ProjectType;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  // For modal display
  allowIframe: boolean;
  screenshots: Screenshot[];
  // Colors for theming
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

// STATIC DATA - kept as fallback (fetched from DB when available)
const staticProjects: Project[] = [
  {
    id: "sellout",
    title: "Sellout",
    shortDescription: "Full-stack e-commerce platform with web and mobile apps",
    fullDescription: "Sellout is a comprehensive e-commerce platform featuring a modern web application and mobile apps for iOS and Android. Built with scalability in mind, it handles thousands of products, real-time inventory management, secure payments, and seamless user experiences across all devices.",
    thumbnail: "/projects/sellout/thumbnail.png",
    techStack: ["Next.js", "React Native", "Node.js", "MongoDB", "Stripe", "TypeScript"],
    category: "fullstack",
    liveUrl: "https://www.selloutweb.com",
    githubUrl: "https://github.com",
    featured: true,
    allowIframe: true,
    screenshots: [
      { src: "/projects/sellout/desktop-1.png", alt: "Sellout Homepage", type: "desktop" },
      { src: "/projects/sellout/desktop-2.png", alt: "Product Listing", type: "desktop" },
      { src: "/projects/sellout/mobile-1.png", alt: "Mobile App Home", type: "mobile" },
      { src: "/projects/sellout/mobile-2.png", alt: "Mobile App Cart", type: "mobile" },
      { src: "/projects/sellout/mobile-3.png", alt: "Mobile App Profile", type: "mobile" },
    ],
    accentColor: "cyan",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
  },
  {
    id: "taskflow",
    title: "TaskFlow",
    shortDescription: "Collaborative task management with real-time updates",
    fullDescription: "TaskFlow is a powerful project management tool designed for modern teams. Features include real-time collaboration, Kanban boards, Gantt charts, time tracking, and integrations with popular tools like Slack and GitHub.",
    thumbnail: "/projects/taskflow/thumbnail.png",
    techStack: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
    category: "web",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    allowIframe: false,
    screenshots: [
      { src: "/projects/taskflow/desktop-1.png", alt: "Dashboard", type: "desktop" },
      { src: "/projects/taskflow/desktop-2.png", alt: "Kanban Board", type: "desktop" },
      { src: "/projects/taskflow/desktop-3.png", alt: "Analytics", type: "desktop" },
    ],
    accentColor: "purple",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
  },
  {
    id: "fittrack",
    title: "FitTrack",
    shortDescription: "Mobile fitness app for tracking workouts and nutrition",
    fullDescription: "FitTrack is a comprehensive fitness companion app that helps users track their workouts, monitor nutrition, set goals, and analyze progress. Features AI-powered workout recommendations and integration with popular fitness devices.",
    thumbnail: "/projects/fittrack/thumbnail.png",
    techStack: ["React Native", "Firebase", "Redux", "TensorFlow Lite"],
    category: "mobile",
    featured: true,
    allowIframe: false,
    screenshots: [
      { src: "/projects/fittrack/mobile-1.png", alt: "Home Screen", type: "mobile" },
      { src: "/projects/fittrack/mobile-2.png", alt: "Workout Tracker", type: "mobile" },
      { src: "/projects/fittrack/mobile-3.png", alt: "Progress Charts", type: "mobile" },
      { src: "/projects/fittrack/mobile-4.png", alt: "Nutrition Log", type: "mobile" },
    ],
    accentColor: "emerald",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-500",
  },
  {
    id: "aiwriter",
    title: "AI Content Writer",
    shortDescription: "AI-powered platform for generating marketing content",
    fullDescription: "An intelligent content generation platform that uses advanced AI to create high-quality marketing copy, blog posts, social media content, and more. Features multiple AI models, tone customization, and team collaboration tools.",
    thumbnail: "/projects/aiwriter/thumbnail.png",
    techStack: ["Next.js", "OpenAI", "Tailwind", "Prisma", "PostgreSQL"],
    category: "fullstack",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    allowIframe: false,
    screenshots: [
      { src: "/projects/aiwriter/desktop-1.png", alt: "Content Editor", type: "desktop" },
      { src: "/projects/aiwriter/desktop-2.png", alt: "Templates", type: "desktop" },
    ],
    accentColor: "amber",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
  },
];

const categories: { key: ProjectCategory; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "fullstack", label: "Full Stack" },
];

// Safe Image component with fallback
function SafeImage({
  src,
  alt,
  fill = false,
  className = "",
  fallback = null
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <>
      {isLoading && fallback}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
}

// Lightbox Component for fullscreen image viewing
function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onGoTo,
  gradientFrom,
  gradientTo
}: {
  images: Screenshot[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
  gradientFrom: string;
  gradientTo: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const isMobile = currentImage?.type === "mobile";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      {images.length > 1 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </motion.button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </motion.button>
      )}

      {/* Main image container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative ${isMobile ? "h-[80vh] w-auto aspect-[9/19]" : "w-[85vw] md:w-[75vw] aspect-video"} rounded-2xl overflow-hidden`}
          >
            {/* Glow effect */}
            <div className={`absolute -inset-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl blur-3xl opacity-30`} />

            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 bg-black/50">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image caption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm"
      >
        {currentImage.alt}
      </motion.div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl bg-black/50 backdrop-blur-sm"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onGoTo(idx);
              }}
              className={`relative ${img.type === "mobile" ? "w-8 h-14" : "w-16 h-10"} rounded-lg overflow-hidden transition-all ${
                idx === currentIndex ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// Project Detail Modal
function ProjectModal({
  project,
  isOpen,
  onClose
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
      setIframeError(false);
      setSelectedScreenshot(0);
      setLightboxOpen(false);
    }
  }, [isOpen, project]);

  if (!project) return null;

  const desktopScreenshots = project.screenshots.filter(s => s.type === "desktop");
  const mobileScreenshots = project.screenshots.filter(s => s.type === "mobile");
  const allScreenshots = project.screenshots;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % allScreenshots.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + allScreenshots.length) % allScreenshots.length);
  };

  const goToImage = (index: number) => {
    setLightboxIndex(index);
  };

  // Get index in allScreenshots array for a desktop screenshot
  const getDesktopIndex = (localIndex: number) => {
    return localIndex;
  };

  // Get index in allScreenshots array for a mobile screenshot
  const getMobileIndex = (localIndex: number) => {
    return desktopScreenshots.length + localIndex;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 overflow-hidden rounded-3xl"
          >
            {/* Glow effect */}
            <div className={`absolute -inset-2 bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} rounded-3xl blur-3xl opacity-20`} />

            {/* Modal Content */}
            <div className="relative h-full glass-card rounded-3xl border border-white/10 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradientFrom} ${project.gradientTo} flex items-center justify-center`}>
                    {project.category === "mobile" ? (
                      <Smartphone className="w-6 h-6 text-white" />
                    ) : (
                      <Monitor className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{project.title}</h2>
                    <p className="text-sm text-muted-foreground hidden md:block">{project.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Large Preview Section */}
                <div className="relative">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Live Preview
                  </h3>

                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                    {/* Show iframe if allowed and not errored */}
                    {project.allowIframe && !iframeError && project.liveUrl ? (
                      <>
                        {/* Loading state */}
                        {!iframeLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className={`w-8 h-8 border-2 border-transparent border-t-${project.accentColor}-500 rounded-full`}
                              />
                              <p className="text-sm text-muted-foreground">Loading preview...</p>
                            </div>
                          </div>
                        )}
                        <iframe
                          src={project.liveUrl}
                          className={`w-full h-full ${iframeLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                          onLoad={() => setIframeLoaded(true)}
                          onError={() => setIframeError(true)}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </>
                    ) : (
                      /* Show screenshot with click to open link */
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full relative group cursor-pointer"
                      >
                        {/* Placeholder gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradientFrom}/20 ${project.gradientTo}/20 flex items-center justify-center`}>
                          <div className="text-center">
                            <Monitor className="w-16 h-16 mx-auto mb-4 text-white/30" />
                            <p className="text-white/50">Click to view live site</p>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1 }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} text-white font-semibold`}
                          >
                            <Maximize2 className="w-5 h-5" />
                            Open Live Site
                          </motion.div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                    About This Project
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {project.fullDescription}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        className={`bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} text-white border-0`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Screenshots Gallery */}
                {(desktopScreenshots.length > 0 || mobileScreenshots.length > 0) && (
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Screenshots
                    </h3>

                    {/* Desktop Screenshots */}
                    {desktopScreenshots.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Desktop</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {desktopScreenshots.map((screenshot, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => openLightbox(getDesktopIndex(index))}
                              className="relative aspect-video rounded-xl overflow-hidden bg-black/30 border border-white/10 cursor-pointer group"
                            >
                              <SafeImage
                                src={screenshot.src}
                                alt={screenshot.alt}
                                fill
                                className="object-cover"
                                fallback={
                                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradientFrom}/10 ${project.gradientTo}/10 flex items-center justify-center`}>
                                    <Monitor className="w-8 h-8 text-white/20" />
                                  </div>
                                }
                              />
                              <p className="absolute bottom-2 left-2 text-xs text-white/60 bg-black/50 px-2 py-1 rounded">{screenshot.alt}</p>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-6 h-6 text-white" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mobile Screenshots */}
                    {mobileScreenshots.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Mobile App</p>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {mobileScreenshots.map((screenshot, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02, y: -5 }}
                              onClick={() => openLightbox(getMobileIndex(index))}
                              className="relative flex-shrink-0 w-32 aspect-[9/19] rounded-2xl overflow-hidden bg-black/30 border border-white/10 cursor-pointer group"
                            >
                              <SafeImage
                                src={screenshot.src}
                                alt={screenshot.alt}
                                fill
                                className="object-cover"
                                fallback={
                                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradientFrom}/10 ${project.gradientTo}/10 flex items-center justify-center`}>
                                    <Smartphone className="w-8 h-8 text-white/20" />
                                  </div>
                                }
                              />
                              <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/60 bg-black/50 mx-2 py-1 rounded">{screenshot.alt}</p>
                              {/* Phone notch decoration */}
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full z-10" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Links */}
                <div className="flex gap-3 md:hidden">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} text-white font-semibold`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white font-semibold"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lightbox for fullscreen image viewing */}
          <AnimatePresence>
            {lightboxOpen && (
              <Lightbox
                images={allScreenshots}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                onNext={nextImage}
                onPrev={prevImage}
                onGoTo={goToImage}
                gradientFrom={project.gradientFrom}
                gradientTo={project.gradientTo}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

// Project Card
function ProjectCard({
  project,
  index,
  onClick
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <motion.div
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="glass-card rounded-2xl overflow-hidden h-full flex flex-col border border-white/5 hover:border-white/10 transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {/* Gradient background as fallback */}
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradientFrom}/30 ${project.gradientTo}/30`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {project.category === "mobile" ? (
                <Smartphone className="w-12 h-12 text-white/20" />
              ) : (
                <Monitor className="w-12 h-12 text-white/20" />
              )}
            </div>
          </div>
          {/* Thumbnail image */}
          {project.thumbnail && (
            <SafeImage
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              fallback={null}
            />
          )}

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-white text-sm font-medium"
                >
                  Tap to view details
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3">
              <Badge className={`bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo} text-white border-0`}>
                Featured
              </Badge>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm border-0">
              {project.category === "mobile" && <Smartphone className="w-3 h-3 mr-1" />}
              {project.category === "web" && <Monitor className="w-3 h-3 mr-1" />}
              {project.category === "fullstack" && "🚀"}
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className={`text-xl font-semibold mb-2 group-hover:text-${project.accentColor}-400 transition-colors`}>
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
            {project.shortDescription}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs bg-white/5 hover:bg-white/10 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-white/5">
                +{project.techStack.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(staticProjects);

  // Fetch projects from database
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Transform DB data to match component's Project interface
          const transformedProjects: Project[] = data.map((p: any) => ({
            id: p._id,
            title: p.title,
            shortDescription: p.description,
            fullDescription: p.longDescription || p.description,
            thumbnail: p.image,
            techStack: p.tags || [],
            category: "fullstack" as ProjectType, // Default category
            liveUrl: p.liveUrl,
            githubUrl: p.githubUrl,
            featured: p.featured,
            allowIframe: p.allowIframe,
            screenshots: [
              ...(p.desktopScreenshots || []).map((s: any) => ({ ...s, type: "desktop" })),
              ...(p.mobileScreenshots || []).map((s: any) => ({ ...s, type: "mobile" })),
            ],
            accentColor: p.gradientFrom?.includes("cyan") ? "cyan" : p.gradientFrom?.includes("purple") ? "purple" : "cyan",
            gradientFrom: p.gradientFrom || "from-cyan-500",
            gradientTo: p.gradientTo || "to-blue-500",
          }));
          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Keep using static data on error
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <section id="projects" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <FadeIn className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of my recent work and personal projects
          </p>
        </FadeIn>

        {/* Filter Tabs */}
        <FadeIn delay={0.1} className="flex justify-center mb-12">
          <div className="inline-flex gap-2 p-1.5 glass rounded-full">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.key
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => openModal(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <FadeIn delay={0.3} className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="glass glass-hover rounded-full"
          >
            View All Projects
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </FadeIn>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
