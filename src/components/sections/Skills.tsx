"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Globe,
  Palette,
  Database,
  Cloud,
  TestTube,
  Accessibility,
  Cpu,
  GitBranch,
  X
} from "lucide-react";

// STATIC DATA - kept as fallback (fetched from DB when available)
const staticSkillDomains = [
  {
    id: "animation",
    title: "Animation & Motion",
    description: "Crafting fluid, performant animations that bring interfaces to life",
    fullDescription: "I create immersive user experiences through carefully crafted animations. From micro-interactions to complex page transitions, I ensure every motion serves a purpose and enhances usability.",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    bgGlow: "bg-pink-500/20",
    skills: ["Framer Motion", "GSAP", "Three.js", "CSS Animations", "Lottie", "React Spring", "SVG Animations", "Scroll Animations"],
    highlights: ["60fps smooth animations", "GPU-accelerated transforms", "Accessibility-friendly motion"],
  },
  {
    id: "performance",
    title: "Performance",
    description: "Optimizing for speed, efficiency, and smooth user experiences",
    fullDescription: "Performance is not an afterthought—it's built into every decision. I optimize applications to load fast, run smoothly, and provide instant feedback to users.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    bgGlow: "bg-yellow-500/20",
    skills: ["Code Splitting", "Lazy Loading", "Caching Strategies", "Bundle Optimization", "Core Web Vitals", "Image Optimization", "Tree Shaking", "Memoization"],
    highlights: ["Sub-second load times", "90+ Lighthouse scores", "Optimized bundle sizes"],
  },
  {
    id: "security",
    title: "Security",
    description: "Implementing robust authentication and data protection",
    fullDescription: "Security is paramount in every application I build. I implement industry-standard security practices to protect user data and prevent vulnerabilities.",
    icon: Shield,
    color: "from-emerald-500 to-green-500",
    bgGlow: "bg-emerald-500/20",
    skills: ["OAuth 2.0", "JWT", "Encryption", "OWASP Top 10", "Security Audits", "HTTPS/TLS", "CSRF Protection", "XSS Prevention", "Rate Limiting"],
    highlights: ["Zero security breaches", "OWASP compliance", "Secure by default"],
  },
  {
    id: "state",
    title: "State Management",
    description: "Architecting scalable and predictable application state",
    fullDescription: "Complex applications need well-organized state. I design state architectures that are predictable, debuggable, and scale with your application's needs.",
    icon: Layers,
    color: "from-purple-500 to-violet-500",
    bgGlow: "bg-purple-500/20",
    skills: ["Redux Toolkit", "Zustand", "React Query", "Context API", "Recoil", "Jotai", "MobX", "Server State", "Optimistic Updates"],
    highlights: ["Predictable data flow", "Optimistic UI updates", "Efficient re-renders"],
  },
  {
    id: "api",
    title: "API Architecture",
    description: "Designing clean, efficient, and scalable API systems",
    fullDescription: "APIs are the backbone of modern applications. I design and implement APIs that are intuitive, well-documented, and built to handle scale.",
    icon: Globe,
    color: "from-cyan-500 to-blue-500",
    bgGlow: "bg-cyan-500/20",
    skills: ["REST APIs", "GraphQL", "WebSockets", "tRPC", "API Gateway", "OpenAPI/Swagger", "Rate Limiting", "Versioning", "Error Handling"],
    highlights: ["Type-safe APIs", "Real-time capabilities", "Comprehensive documentation"],
  },
  {
    id: "ui",
    title: "UI Engineering",
    description: "Building beautiful, responsive, and accessible interfaces",
    fullDescription: "Great UI is invisible—it just works. I build interfaces that are visually stunning, responsive across devices, and accessible to everyone.",
    icon: Palette,
    color: "from-indigo-500 to-purple-500",
    bgGlow: "bg-indigo-500/20",
    skills: ["Design Systems", "Responsive Design", "CSS Architecture", "Component Libraries", "Figma to Code", "Tailwind CSS", "CSS-in-JS", "Atomic Design"],
    highlights: ["Pixel-perfect implementation", "Mobile-first approach", "Consistent design language"],
  },
  {
    id: "database",
    title: "Database Design",
    description: "Modeling efficient data structures and relationships",
    fullDescription: "Data is the foundation of every application. I design database schemas that are normalized, efficient, and optimized for your specific query patterns.",
    icon: Database,
    color: "from-teal-500 to-cyan-500",
    bgGlow: "bg-teal-500/20",
    skills: ["Schema Design", "Query Optimization", "Indexing", "Data Modeling", "Migrations", "PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
    highlights: ["Optimized queries", "Scalable schemas", "Data integrity"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "Deploying and scaling applications in the cloud",
    fullDescription: "Modern applications need modern infrastructure. I set up cloud environments that are scalable, cost-effective, and automated for continuous deployment.",
    icon: Cloud,
    color: "from-sky-500 to-blue-500",
    bgGlow: "bg-sky-500/20",
    skills: ["AWS", "Docker", "CI/CD", "Kubernetes", "Infrastructure as Code", "Terraform", "GitHub Actions", "Vercel", "Serverless"],
    highlights: ["Zero-downtime deployments", "Auto-scaling", "Infrastructure as Code"],
  },
  {
    id: "testing",
    title: "Testing & QA",
    description: "Ensuring reliability through comprehensive testing",
    fullDescription: "Quality is non-negotiable. I implement testing strategies that catch bugs early, ensure reliability, and give confidence in every deployment.",
    icon: TestTube,
    color: "from-lime-500 to-green-500",
    bgGlow: "bg-lime-500/20",
    skills: ["Unit Testing", "E2E Testing", "TDD", "Jest", "Playwright", "Cypress", "Testing Library", "Coverage Reports", "Visual Regression"],
    highlights: ["High test coverage", "Automated testing", "Continuous integration"],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description: "Creating inclusive experiences for all users",
    fullDescription: "The web should be for everyone. I build applications that are accessible to users of all abilities, following WCAG guidelines and best practices.",
    icon: Accessibility,
    color: "from-amber-500 to-yellow-500",
    bgGlow: "bg-amber-500/20",
    skills: ["WCAG 2.1", "Screen Readers", "Keyboard Navigation", "ARIA Labels", "Color Contrast", "Focus Management", "Semantic HTML", "A11y Testing"],
    highlights: ["WCAG AA compliant", "Screen reader tested", "Keyboard accessible"],
  },
  {
    id: "architecture",
    title: "System Architecture",
    description: "Designing scalable and maintainable systems",
    fullDescription: "Great software starts with great architecture. I design systems using proven patterns—whether microservices, modular monoliths, or serverless—choosing the right approach for each project.",
    icon: Cpu,
    color: "from-red-500 to-pink-500",
    bgGlow: "bg-red-500/20",
    skills: ["Microservices", "Modular Monolith", "Monorepos", "Design Patterns", "Clean Architecture", "DDD", "Event-Driven", "CQRS", "Hexagonal Architecture"],
    highlights: ["Scalable by design", "Maintainable codebases", "Future-proof architecture"],
  },
  {
    id: "version",
    title: "Version Control",
    description: "Managing code collaboration and deployment workflows",
    fullDescription: "Effective collaboration requires disciplined version control. I establish workflows that enable teams to work together efficiently while maintaining code quality.",
    icon: GitBranch,
    color: "from-orange-500 to-red-500",
    bgGlow: "bg-orange-500/20",
    skills: ["Git Flow", "Code Reviews", "Branch Strategy", "Merge Conflicts", "Release Management", "Conventional Commits", "Semantic Versioning", "PR Templates"],
    highlights: ["Clean git history", "Efficient code reviews", "Automated releases"],
  },
];

// Skill Detail Modal
function SkillModal({
  domain,
  isOpen,
  onClose
}: {
  domain: typeof staticSkillDomains[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!domain) return null;

  const Icon = domain.icon;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl z-50"
          >
            {/* Glow effect - positioned behind */}
            <div className={`absolute -inset-2 ${domain.bgGlow} rounded-3xl blur-3xl opacity-50 pointer-events-none`} />

            {/* Modal Content */}
            <div className="relative rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md bg-white/5">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-10 pointer-events-none`} />

              {/* Scrollable content wrapper */}
              <div className="relative max-h-[85vh] overflow-y-auto">

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <div className="p-8 pb-0">
                <div className="flex items-center gap-5 mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center shadow-2xl`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-3xl font-bold text-white mb-2"
                    >
                      {domain.title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-muted-foreground"
                    >
                      {domain.description}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 pt-4 space-y-6">
                {/* Full Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {domain.fullDescription}
                  </p>
                </motion.div>

                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                    Key Highlights
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {domain.highlights.map((highlight, i) => (
                      <motion.span
                        key={highlight}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className={`px-4 py-2 rounded-full bg-gradient-to-r ${domain.color} text-white font-medium text-sm shadow-lg`}
                      >
                        {highlight}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Divider */}
                <div className={`h-px bg-gradient-to-r ${domain.color} opacity-30`} />

                {/* All Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    Technologies & Skills I Use
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {domain.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 + i * 0.03 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-default text-sm border border-white/5"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>

              </div>

              {/* Footer decoration - outside scrollable area */}
              <div className={`absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br ${domain.color} rounded-full blur-3xl opacity-20 pointer-events-none`} />
              <div className={`absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br ${domain.color} rounded-full blur-3xl opacity-10 pointer-events-none`} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 3D Tilt Card Component with performance optimizations
function TiltCard({
  domain,
  index,
  onClick
}: {
  domain: typeof staticSkillDomains[0];
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Reduced stiffness and damping for smoother performance
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const Icon = domain.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative cursor-pointer group"
    >
      {/* Glow effect - only show on hover for performance */}
      {isHovered && (
        <div className={`absolute -inset-1 ${domain.bgGlow} rounded-2xl blur-xl opacity-80`} />
      )}

      {/* Card */}
      <div
        className="relative rounded-2xl p-6 h-full border border-white/10 overflow-hidden backdrop-blur-md bg-white/5 transition-transform duration-200"
        style={{ transform: isHovered ? "scale(1.02)" : "scale(1)" }}
      >
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${domain.color} transition-opacity duration-300`}
          style={{ opacity: isHovered ? 0.1 : 0 }}
        />

        {/* Content */}
        <div style={{ transform: "translateZ(50px)" }} className="relative">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 shadow-lg transition-transform duration-200`}
            style={{ transform: isHovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)" }}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
            {domain.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {domain.description}
          </p>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-2">
            {domain.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted-foreground group-hover:bg-white/10 transition-colors"
              >
                {skill}
              </span>
            ))}
            {domain.skills.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                +{domain.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Hover hint */}
        {isHovered && (
          <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <p className="mb-5 text-white text-sm font-medium tracking-wide">
              Tap to discover more
            </p>
          </div>
        )}

        {/* Corner accent */}
        <div
          className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${domain.color} rounded-full blur-2xl transition-opacity duration-300`}
          style={{ opacity: isHovered ? 0.3 : 0.1 }}
        />
      </div>
    </motion.div>
  );
}

// Floating 3D Orbit Animation - optimized with CSS animations
function FloatingOrbit({ isMobile }: { isMobile: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on mobile or until mounted
  if (!mounted || isMobile) return null;

  // Reduced to 4 items for better performance
  const orbitItems = [
    { icon: "⚛️", size: 300, duration: "20s" },
    { icon: "🚀", size: 400, duration: "25s" },
    { icon: "💡", size: 500, duration: "30s" },
    { icon: "⚡", size: 600, duration: "35s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central glow - reduced blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Orbiting elements using CSS animations */}
      {orbitItems.map((item, index) => (
        <div
          key={index}
          className="absolute top-1/2 left-1/2 animate-spin"
          style={{
            width: item.size,
            height: item.size,
            marginLeft: -item.size / 2,
            marginTop: -item.size / 2,
            animationDuration: item.duration,
            animationTimingFunction: "linear",
          }}
        >
          <span
            className="absolute text-2xl"
            style={{
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {item.icon}
          </span>
        </div>
      ))}
    </div>
  );
}

// 3D Sphere Background - static SVG for performance
function SphereBackground({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-spin"
        style={{ animationDuration: "60s" }}
        viewBox="0 0 200 200"
      >
        {/* Static latitude lines */}
        {[...Array(6)].map((_, i) => (
          <ellipse
            key={`lat-${i}`}
            cx="100"
            cy="100"
            rx={80}
            ry={80 * Math.cos((i * Math.PI) / 6)}
            fill="none"
            stroke="url(#sphereGradient)"
            strokeWidth="0.3"
            opacity={0.5}
          />
        ))}
        {/* Static longitude lines */}
        {[...Array(8)].map((_, i) => (
          <ellipse
            key={`long-${i}`}
            cx="100"
            cy="100"
            rx={80 * Math.cos((i * Math.PI) / 8)}
            ry={80}
            fill="none"
            stroke="url(#sphereGradient)"
            strokeWidth="0.3"
            opacity={0.3}
          />
        ))}
        <defs>
          <linearGradient id="sphereGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Icon mapping for database skills
const skillIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Globe,
  Palette,
  Database,
  Cloud,
  TestTube,
  Accessibility,
  Cpu,
  GitBranch,
};

export function Skills() {
  const [selectedDomain, setSelectedDomain] = useState<typeof staticSkillDomains[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillDomains, setSkillDomains] = useState(staticSkillDomains);
  const [isMobile, setIsMobile] = useState(true); // Default true to prevent flash on mobile

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch skills from database
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Transform DB data to match component's structure
          const transformedSkills = data.map((s: any) => ({
            id: s._id,
            title: s.title,
            description: s.description,
            fullDescription: s.description,
            icon: skillIconMap[s.icon] || Sparkles,
            color: s.bgGradient?.replace("/20", "") || "from-cyan-500 to-blue-500",
            bgGlow: `bg-${s.color?.replace("text-", "")?.replace("-400", "-500")}/20` || "bg-cyan-500/20",
            skills: s.tools || [],
            highlights: s.details || [],
          })) as typeof staticSkillDomains;
          setSkillDomains(transformedSkills);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        // Keep using static data on error
      }
    }

    fetchSkills();
  }, []);

  const openModal = (domain: typeof staticSkillDomains[0]) => {
    setSelectedDomain(domain);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden min-h-screen">
      {/* 3D Background Elements - disabled on mobile */}
      <SphereBackground isMobile={isMobile} />
      <FloatingOrbit isMobile={isMobile} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium">What I Bring to the Table</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            My <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Beyond just knowing technologies — these are the domains where I create real impact
          </p>
        </motion.div>

        {/* 3D Skills Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          style={{ perspective: "1000px" }}
        >
          {skillDomains.map((domain, index) => (
            <TiltCard
              key={domain.id}
              domain={domain}
              index={index}
              onClick={() => openModal(domain)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Interested in how these skills can help your project?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold"
          >
            Let's Discuss
            <Zap className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>

      {/* Skill Detail Modal */}
      <SkillModal
        domain={selectedDomain}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
