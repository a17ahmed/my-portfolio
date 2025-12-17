"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Code2, Briefcase, Users, Coffee, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Code2, value: "50+", label: "Projects Completed" },
  { icon: Briefcase, value: "5+", label: "Years Experience" },
  { icon: Users, value: "30+", label: "Happy Clients" },
  { icon: Coffee, value: "1000+", label: "Cups of Coffee" },
];

const techStack = [
  "React", "Next.js", "TypeScript", "Node.js",
  "MongoDB", "PostgreSQL", "Tailwind CSS", "Three.js"
];

// STATIC DATA - kept as fallback (fetched from DB when available)
const staticAboutContent = [
  {
    src: "/images/about-image.png",
    label: "Creative Vision",
    title: "Turning ideas into",
    highlight: "reality",
    highlightColor: "text-cyan-400",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS", "Three.js"],
    skillsTitle: "Technologies I work with",
    skillHoverColor: "hover:border-cyan-500/50",
    description: [
      "I'm a passionate Full Stack Developer with a love for creating beautiful, functional, and user-friendly applications. With expertise in both frontend and backend technologies, I bring ideas to life through clean code and intuitive design.",
      "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.",
    ],
    cta: { text: "Download CV", href: "/resume.pdf", download: true },
    ctaColor: "bg-cyan-500 hover:bg-cyan-600 text-black",
  },
  {
    src: "/images/about-image2.png",
    label: "Architectural Design",
    title: "Building scalable",
    highlight: "architecture",
    highlightColor: "text-purple-400",
    skills: ["Microservices", "REST APIs", "GraphQL", "System Design", "CI/CD", "Cloud Architecture", "Docker", "Kubernetes"],
    skillsTitle: "Architecture Expertise",
    skillHoverColor: "hover:border-purple-500/50",
    description: [
      "I design robust system architectures that scale with your business. From microservices to monoliths, I craft solutions that are maintainable, efficient, and built for growth.",
      "My approach combines clean architecture principles with practical implementation, ensuring your codebase remains flexible and easy to evolve over time.",
    ],
    cta: { text: "View Projects", href: "#projects", download: false },
    ctaColor: "bg-purple-500 hover:bg-purple-600 text-white",
  },
  {
    src: "/images/about-image3.png",
    label: "Collaborative Development",
    title: "Empowering teams through",
    highlight: "collaboration",
    highlightColor: "text-emerald-400",
    skills: ["Code Reviews", "Pair Programming", "Mentoring", "Agile/Scrum", "Technical Leadership", "Knowledge Sharing", "Team Building", "Documentation"],
    skillsTitle: "Collaboration Skills",
    skillHoverColor: "hover:border-emerald-500/50",
    description: [
      "I believe the best software is built by empowered teams. I thrive in collaborative environments where knowledge sharing and mentorship drive innovation and growth.",
      "Whether it's conducting code reviews, pair programming sessions, or leading technical discussions, I'm committed to elevating the entire team's capabilities.",
    ],
    cta: { text: "Let's Collaborate", href: "#contact", download: false },
    ctaColor: "bg-emerald-500 hover:bg-emerald-600 text-black",
  },
];

// Type for about content slide
interface AboutSlide {
  src: string;
  label: string;
  title: string;
  highlight: string;
  highlightColor: string;
  skills: string[];
  skillsTitle: string;
  skillHoverColor: string;
  description: string[];
  cta: { text: string; href: string; download: boolean };
  ctaColor: string;
}

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aboutContent, setAboutContent] = useState<AboutSlide[]>(staticAboutContent);

  // Fetch about data from database
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data && data.slides && data.slides.length > 0) {
          // Transform DB data to match component's structure
          const transformedSlides = data.slides.map((slide: any, index: number) => {
            // Derive skillHoverColor from highlightColor
            const colorMap: { [key: string]: string } = {
              "text-cyan-400": "hover:border-cyan-500/50",
              "text-purple-400": "hover:border-purple-500/50",
              "text-emerald-400": "hover:border-emerald-500/50",
            };
            // Derive skillsTitle based on index or label
            const skillsTitles = ["Technologies I work with", "Architecture Expertise", "Collaboration Skills"];

            return {
              src: slide.src,
              label: slide.label,
              title: slide.title,
              highlight: slide.highlight,
              highlightColor: slide.highlightColor || staticAboutContent[index]?.highlightColor,
              skills: slide.skills || [],
              skillsTitle: skillsTitles[index] || "Skills",
              skillHoverColor: colorMap[slide.highlightColor] || staticAboutContent[index]?.skillHoverColor,
              description: typeof slide.description === "string"
                ? slide.description.split("\n\n").filter((p: string) => p.trim())
                : [slide.description],
              cta: {
                text: slide.ctaText,
                href: slide.ctaLink,
                download: slide.ctaLink?.endsWith(".pdf") || false,
              },
              ctaColor: slide.ctaColor || staticAboutContent[index]?.ctaColor,
            };
          });
          setAboutContent(transformedSlides);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        // Keep using static data on error
      }
    }

    fetchAboutData();
  }, []);

  // Scroll progress for the scroll container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // First image: visible from 0% to 33% scroll
  const image1Opacity = useTransform(smoothProgress, [0, 0.05, 0.28, 0.33], [0, 1, 1, 0]);
  const image1Scale = useTransform(smoothProgress, [0, 0.05, 0.28, 0.33], [1.1, 1, 1, 0.95]);

  // Second image: visible from 33% to 66% scroll
  const image2Opacity = useTransform(smoothProgress, [0.28, 0.33, 0.61, 0.66], [0, 1, 1, 0]);
  const image2Scale = useTransform(smoothProgress, [0.28, 0.33, 0.61, 0.66], [1.1, 1, 1, 0.95]);

  // Third image: visible from 66% to 100% scroll
  const image3Opacity = useTransform(smoothProgress, [0.61, 0.66, 0.95, 1], [0, 1, 1, 0]);
  const image3Scale = useTransform(smoothProgress, [0.61, 0.66, 0.95, 1], [1.1, 1, 1, 0.95]);

  // Label transitions
  const label1Opacity = useTransform(smoothProgress, [0.02, 0.08, 0.25, 0.31], [0, 1, 1, 0]);
  const label2Opacity = useTransform(smoothProgress, [0.30, 0.36, 0.58, 0.64], [0, 1, 1, 0]);
  const label3Opacity = useTransform(smoothProgress, [0.63, 0.69, 0.92, 0.98], [0, 1, 1, 0]);

  // Content section transitions (matches image transitions)
  const content1Opacity = useTransform(smoothProgress, [0, 0.05, 0.28, 0.33], [0, 1, 1, 0]);
  const content2Opacity = useTransform(smoothProgress, [0.28, 0.33, 0.61, 0.66], [0, 1, 1, 0]);
  const content3Opacity = useTransform(smoothProgress, [0.61, 0.66, 0.95, 1], [0, 1, 1, 0]);

  // Content fade in
  const contentOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Image slide in from right
  const imageX = useTransform(smoothProgress, [0, 0.15], [100, 0]);

  // Content slide in from left
  const contentX = useTransform(smoothProgress, [0, 0.15], [-100, 0]);

  return (
    <section>
      {/* Scroll container - this creates the scroll space */}
      <div ref={containerRef} className="h-[400vh] relative">
        {/* Anchor target positioned where animations are visible (10% into the scroll) */}
        <div id="about" className="absolute top-[10%]" />
        {/* Sticky content - stays fixed while scrolling through container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 h-full flex flex-col justify-center py-20">
            {/* Section Header */}
            <motion.div
              style={{ opacity: contentOpacity }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                About <span className="gradient-text">Me</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Passionate developer crafting digital experiences
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center flex-1 max-h-[70vh]">
              {/* Image Side - Pinned with scroll-linked image swap */}
              <motion.div
                style={{
                  x: imageX,
                  opacity: contentOpacity,
                }}
                className="relative order-2 lg:order-1 h-full flex items-center"
              >
                <div className="relative w-full">
                  {/* Glow effect behind */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

                  {/* Image container - both images stacked */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden glass-card">
                    {/* First Image */}
                    <motion.div
                      style={{
                        opacity: image1Opacity,
                        scale: image1Scale,
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={aboutContent[0].src}
                        alt={aboutContent[0].label}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Second Image */}
                    <motion.div
                      style={{
                        opacity: image2Opacity,
                        scale: image2Scale,
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={aboutContent[1].src}
                        alt={aboutContent[1].label}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Third Image */}
                    <motion.div
                      style={{
                        opacity: image3Opacity,
                        scale: image3Scale,
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={aboutContent[2].src}
                        alt={aboutContent[2].label}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                    {/* Image Labels */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <motion.div
                        style={{ opacity: label1Opacity }}
                        className="absolute bottom-0 left-0"
                      >
                        <span className="px-4 py-2 rounded-full glass text-sm font-medium text-cyan-400">
                          {aboutContent[0].label}
                        </span>
                      </motion.div>
                      <motion.div
                        style={{ opacity: label2Opacity }}
                        className="absolute bottom-0 left-0"
                      >
                        <span className="px-4 py-2 rounded-full glass text-sm font-medium text-purple-400">
                          {aboutContent[1].label}
                        </span>
                      </motion.div>
                      <motion.div
                        style={{ opacity: label3Opacity }}
                        className="absolute bottom-0 left-0"
                      >
                        <span className="px-4 py-2 rounded-full glass text-sm font-medium text-emerald-400">
                          {aboutContent[2].label}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating experience badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 -right-6 glass-card rounded-2xl p-4 shadow-xl"
                  >
                    <p className="text-3xl font-bold gradient-text">5+</p>
                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                  </motion.div>

                  {/* Floating tech badge */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-4 glass-card rounded-xl px-4 py-2 shadow-xl"
                  >
                    <p className="text-sm font-medium text-cyan-400">Full Stack Dev</p>
                  </motion.div>

                  {/* Scroll progress indicator */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                    <motion.div
                      style={{
                        opacity: image1Opacity,
                        scaleX: useTransform(smoothProgress, [0, 0.33], [0, 1])
                      }}
                      className="w-8 h-1 rounded-full bg-cyan-500 origin-left"
                    />
                    <motion.div
                      style={{
                        opacity: image2Opacity,
                        scaleX: useTransform(smoothProgress, [0.33, 0.66], [0, 1])
                      }}
                      className="w-8 h-1 rounded-full bg-purple-500 origin-left"
                    />
                    <motion.div
                      style={{
                        opacity: image3Opacity,
                        scaleX: useTransform(smoothProgress, [0.66, 1], [0, 1])
                      }}
                      className="w-8 h-1 rounded-full bg-emerald-500 origin-left"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Content Side - Three stacked content sections that swap */}
              <motion.div
                style={{
                  x: contentX,
                  opacity: contentOpacity,
                }}
                className="order-1 lg:order-2 relative"
              >
                {/* First Content - Creative Vision */}
                <motion.div
                  style={{ opacity: content1Opacity }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-semibold">
                      {aboutContent[0].title} <span className={aboutContent[0].highlightColor}>{aboutContent[0].highlight}</span>
                    </h3>
                    {aboutContent[0].description.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">{aboutContent[0].skillsTitle}</h4>
                    <div className="flex flex-wrap gap-2">
                      {aboutContent[0].skills.map((skill) => (
                        <motion.span
                          key={skill}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className={`px-3 py-1.5 rounded-full glass text-sm font-medium cursor-default ${aboutContent[0].skillHoverColor} transition-colors`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      className={`${aboutContent[0].ctaColor} font-semibold rounded-full`}
                      asChild
                    >
                      <a href={aboutContent[0].cta.href} download={aboutContent[0].cta.download || undefined}>
                        <Download className="mr-2 h-4 w-4" />
                        {aboutContent[0].cta.text}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="glass glass-hover rounded-full"
                      asChild
                    >
                      <a href="#contact">Let's Talk</a>
                    </Button>
                  </div>
                </motion.div>

                {/* Second Content - Architectural Design */}
                <motion.div
                  style={{ opacity: content2Opacity }}
                  className="absolute inset-0 space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-semibold">
                      {aboutContent[1].title} <span className={aboutContent[1].highlightColor}>{aboutContent[1].highlight}</span>
                    </h3>
                    {aboutContent[1].description.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">{aboutContent[1].skillsTitle}</h4>
                    <div className="flex flex-wrap gap-2">
                      {aboutContent[1].skills.map((skill) => (
                        <motion.span
                          key={skill}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className={`px-3 py-1.5 rounded-full glass text-sm font-medium cursor-default ${aboutContent[1].skillHoverColor} transition-colors`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      className={`${aboutContent[1].ctaColor} font-semibold rounded-full`}
                      asChild
                    >
                      <a href={aboutContent[1].cta.href}>
                        {aboutContent[1].cta.text}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="glass glass-hover rounded-full"
                      asChild
                    >
                      <a href="#contact">Discuss Architecture</a>
                    </Button>
                  </div>
                </motion.div>

                {/* Third Content - Collaborative Development */}
                <motion.div
                  style={{ opacity: content3Opacity }}
                  className="absolute inset-0 space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-semibold">
                      {aboutContent[2].title} <span className={aboutContent[2].highlightColor}>{aboutContent[2].highlight}</span>
                    </h3>
                    {aboutContent[2].description.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">{aboutContent[2].skillsTitle}</h4>
                    <div className="flex flex-wrap gap-2">
                      {aboutContent[2].skills.map((skill) => (
                        <motion.span
                          key={skill}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className={`px-3 py-1.5 rounded-full glass text-sm font-medium cursor-default ${aboutContent[2].skillHoverColor} transition-colors`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      className={`${aboutContent[2].ctaColor} font-semibold rounded-full`}
                      asChild
                    >
                      <a href={aboutContent[2].cta.href}>
                        {aboutContent[2].cta.text}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="glass glass-hover rounded-full"
                      asChild
                    >
                      <a href="#contact">Get In Touch</a>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
              style={{ opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 1]) }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">Scroll to explore</p>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-8 mx-auto rounded-full bg-gradient-to-b from-cyan-500 to-transparent"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section - After the pinned scroll */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card rounded-2xl p-6 text-center group cursor-default"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
