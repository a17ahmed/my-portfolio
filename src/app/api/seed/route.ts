import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";
import About from "@/models/About";
import Skill from "@/models/Skill";
import Project from "@/models/Project";

// Static data from components - will be seeded to database
const heroData = {
  greeting: "Hello World, I'm",
  name: "Ahmed Irfan",
  title: "Full Stack Developer",
  taglines: [
    "I'm not a magician, but I can make bugs disappear ✨",
    "Turning caffeine into code since 2019 ☕",
    "I speak fluent JavaScript, Python & Sarcasm 💻",
    "404: Sleep not found 🌙",
    "Making the internet prettier, one pixel at a time 🎨",
  ],
  description:
    "I craft beautiful, performant web experiences that users love. Specialized in React, Next.js, and modern web technologies.",
  backgroundImage: "/images/main-image.png",
  socialLinks: [
    { name: "GitHub", href: "https://github.com", icon: "Github" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
    { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
  ],
};

const aboutData = {
  slides: [
    {
      src: "/images/about-image.png",
      label: "Creative Vision",
      title: "Turning ideas into",
      highlight: "reality",
      highlightColor: "text-cyan-400",
      description:
        "I'm a passionate Full Stack Developer with a love for creating beautiful, functional, and user-friendly applications. With expertise in both frontend and backend technologies, I bring ideas to life through clean code and intuitive design. When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Tailwind CSS",
        "Three.js",
      ],
      ctaText: "Download CV",
      ctaLink: "/resume.pdf",
      ctaColor: "bg-cyan-500 hover:bg-cyan-600 text-black",
    },
    {
      src: "/images/about-image2.png",
      label: "Architectural Design",
      title: "Building scalable",
      highlight: "architecture",
      highlightColor: "text-purple-400",
      description:
        "I design robust system architectures that scale with your business. From microservices to monoliths, I craft solutions that are maintainable, efficient, and built for growth. My approach combines clean architecture principles with practical implementation, ensuring your codebase remains flexible and easy to evolve over time.",
      skills: [
        "Microservices",
        "REST APIs",
        "GraphQL",
        "System Design",
        "CI/CD",
        "Cloud Architecture",
        "Docker",
        "Kubernetes",
      ],
      ctaText: "View Projects",
      ctaLink: "#projects",
      ctaColor: "bg-purple-500 hover:bg-purple-600 text-white",
    },
    {
      src: "/images/about-image3.png",
      label: "Collaborative Development",
      title: "Empowering teams through",
      highlight: "collaboration",
      highlightColor: "text-emerald-400",
      description:
        "I believe the best software is built by empowered teams. I thrive in collaborative environments where knowledge sharing and mentorship drive innovation and growth. Whether it's conducting code reviews, pair programming sessions, or leading technical discussions, I'm committed to elevating the entire team's capabilities.",
      skills: [
        "Code Reviews",
        "Pair Programming",
        "Mentoring",
        "Agile/Scrum",
        "Technical Leadership",
        "Knowledge Sharing",
        "Team Building",
        "Documentation",
      ],
      ctaText: "Let's Collaborate",
      ctaLink: "#contact",
      ctaColor: "bg-emerald-500 hover:bg-emerald-600 text-black",
    },
  ],
};

const skillsData = [
  {
    title: "Animation & Motion",
    description:
      "Crafting fluid, performant animations that bring interfaces to life",
    icon: "Sparkles",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/20",
    details: [
      "60fps smooth animations",
      "GPU-accelerated transforms",
      "Accessibility-friendly motion",
    ],
    tools: [
      "Framer Motion",
      "GSAP",
      "Three.js",
      "CSS Animations",
      "Lottie",
      "React Spring",
      "SVG Animations",
      "Scroll Animations",
    ],
    order: 0,
  },
  {
    title: "Performance",
    description:
      "Optimizing for speed, efficiency, and smooth user experiences",
    icon: "Zap",
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    details: [
      "Sub-second load times",
      "90+ Lighthouse scores",
      "Optimized bundle sizes",
    ],
    tools: [
      "Code Splitting",
      "Lazy Loading",
      "Caching Strategies",
      "Bundle Optimization",
      "Core Web Vitals",
      "Image Optimization",
      "Tree Shaking",
      "Memoization",
    ],
    order: 1,
  },
  {
    title: "Security",
    description: "Implementing robust authentication and data protection",
    icon: "Shield",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-green-500/20",
    details: [
      "Zero security breaches",
      "OWASP compliance",
      "Secure by default",
    ],
    tools: [
      "OAuth 2.0",
      "JWT",
      "Encryption",
      "OWASP Top 10",
      "Security Audits",
      "HTTPS/TLS",
      "CSRF Protection",
      "XSS Prevention",
      "Rate Limiting",
    ],
    order: 2,
  },
  {
    title: "State Management",
    description: "Architecting scalable and predictable application state",
    icon: "Layers",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-violet-500/20",
    details: [
      "Predictable data flow",
      "Optimistic UI updates",
      "Efficient re-renders",
    ],
    tools: [
      "Redux Toolkit",
      "Zustand",
      "React Query",
      "Context API",
      "Recoil",
      "Jotai",
      "MobX",
      "Server State",
      "Optimistic Updates",
    ],
    order: 3,
  },
  {
    title: "API Architecture",
    description: "Designing clean, efficient, and scalable API systems",
    icon: "Globe",
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    details: [
      "Type-safe APIs",
      "Real-time capabilities",
      "Comprehensive documentation",
    ],
    tools: [
      "REST APIs",
      "GraphQL",
      "WebSockets",
      "tRPC",
      "API Gateway",
      "OpenAPI/Swagger",
      "Rate Limiting",
      "Versioning",
      "Error Handling",
    ],
    order: 4,
  },
  {
    title: "UI Engineering",
    description: "Building beautiful, responsive, and accessible interfaces",
    icon: "Palette",
    color: "text-indigo-400",
    bgGradient: "from-indigo-500/20 to-purple-500/20",
    details: [
      "Pixel-perfect implementation",
      "Mobile-first approach",
      "Consistent design language",
    ],
    tools: [
      "Design Systems",
      "Responsive Design",
      "CSS Architecture",
      "Component Libraries",
      "Figma to Code",
      "Tailwind CSS",
      "CSS-in-JS",
      "Atomic Design",
    ],
    order: 5,
  },
  {
    title: "Database Design",
    description: "Modeling efficient data structures and relationships",
    icon: "Database",
    color: "text-teal-400",
    bgGradient: "from-teal-500/20 to-cyan-500/20",
    details: ["Optimized queries", "Scalable schemas", "Data integrity"],
    tools: [
      "Schema Design",
      "Query Optimization",
      "Indexing",
      "Data Modeling",
      "Migrations",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Prisma ORM",
    ],
    order: 6,
  },
  {
    title: "Cloud & DevOps",
    description: "Deploying and scaling applications in the cloud",
    icon: "Cloud",
    color: "text-sky-400",
    bgGradient: "from-sky-500/20 to-blue-500/20",
    details: [
      "Zero-downtime deployments",
      "Auto-scaling",
      "Infrastructure as Code",
    ],
    tools: [
      "AWS",
      "Docker",
      "CI/CD",
      "Kubernetes",
      "Infrastructure as Code",
      "Terraform",
      "GitHub Actions",
      "Vercel",
      "Serverless",
    ],
    order: 7,
  },
  {
    title: "Testing & QA",
    description: "Ensuring reliability through comprehensive testing",
    icon: "TestTube",
    color: "text-lime-400",
    bgGradient: "from-lime-500/20 to-green-500/20",
    details: [
      "High test coverage",
      "Automated testing",
      "Continuous integration",
    ],
    tools: [
      "Unit Testing",
      "E2E Testing",
      "TDD",
      "Jest",
      "Playwright",
      "Cypress",
      "Testing Library",
      "Coverage Reports",
      "Visual Regression",
    ],
    order: 8,
  },
  {
    title: "Accessibility",
    description: "Creating inclusive experiences for all users",
    icon: "Accessibility",
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-yellow-500/20",
    details: [
      "WCAG AA compliant",
      "Screen reader tested",
      "Keyboard accessible",
    ],
    tools: [
      "WCAG 2.1",
      "Screen Readers",
      "Keyboard Navigation",
      "ARIA Labels",
      "Color Contrast",
      "Focus Management",
      "Semantic HTML",
      "A11y Testing",
    ],
    order: 9,
  },
  {
    title: "System Architecture",
    description: "Designing scalable and maintainable systems",
    icon: "Cpu",
    color: "text-red-400",
    bgGradient: "from-red-500/20 to-pink-500/20",
    details: [
      "Scalable by design",
      "Maintainable codebases",
      "Future-proof architecture",
    ],
    tools: [
      "Microservices",
      "Modular Monolith",
      "Monorepos",
      "Design Patterns",
      "Clean Architecture",
      "DDD",
      "Event-Driven",
      "CQRS",
      "Hexagonal Architecture",
    ],
    order: 10,
  },
  {
    title: "Version Control",
    description: "Managing code collaboration and deployment workflows",
    icon: "GitBranch",
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-500/20",
    details: ["Clean git history", "Efficient code reviews", "Automated releases"],
    tools: [
      "Git Flow",
      "Code Reviews",
      "Branch Strategy",
      "Merge Conflicts",
      "Release Management",
      "Conventional Commits",
      "Semantic Versioning",
      "PR Templates",
    ],
    order: 11,
  },
];

const projectsData = [
  {
    title: "Sellout",
    description: "Full-stack e-commerce platform with web and mobile apps",
    longDescription:
      "Sellout is a comprehensive e-commerce platform featuring a modern web application and mobile apps for iOS and Android. Built with scalability in mind, it handles thousands of products, real-time inventory management, secure payments, and seamless user experiences across all devices.",
    image: "/projects/sellout/thumbnail.png",
    tags: ["Next.js", "React Native", "Node.js", "MongoDB", "Stripe", "TypeScript"],
    liveUrl: "https://www.selloutweb.com",
    githubUrl: "https://github.com",
    allowIframe: true,
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
    desktopScreenshots: [
      { src: "/projects/sellout/desktop-1.png", alt: "Sellout Homepage" },
      { src: "/projects/sellout/desktop-2.png", alt: "Product Listing" },
    ],
    mobileScreenshots: [
      { src: "/projects/sellout/mobile-1.png", alt: "Mobile App Home" },
      { src: "/projects/sellout/mobile-2.png", alt: "Mobile App Cart" },
      { src: "/projects/sellout/mobile-3.png", alt: "Mobile App Profile" },
    ],
    featured: true,
    order: 0,
  },
  {
    title: "TaskFlow",
    description: "Collaborative task management with real-time updates",
    longDescription:
      "TaskFlow is a powerful project management tool designed for modern teams. Features include real-time collaboration, Kanban boards, Gantt charts, time tracking, and integrations with popular tools like Slack and GitHub.",
    image: "/projects/taskflow/thumbnail.png",
    tags: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    allowIframe: false,
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    desktopScreenshots: [
      { src: "/projects/taskflow/desktop-1.png", alt: "Dashboard" },
      { src: "/projects/taskflow/desktop-2.png", alt: "Kanban Board" },
      { src: "/projects/taskflow/desktop-3.png", alt: "Analytics" },
    ],
    mobileScreenshots: [],
    featured: true,
    order: 1,
  },
  {
    title: "FitTrack",
    description: "Mobile fitness app for tracking workouts and nutrition",
    longDescription:
      "FitTrack is a comprehensive fitness companion app that helps users track their workouts, monitor nutrition, set goals, and analyze progress. Features AI-powered workout recommendations and integration with popular fitness devices.",
    image: "/projects/fittrack/thumbnail.png",
    tags: ["React Native", "Firebase", "Redux", "TensorFlow Lite"],
    liveUrl: "",
    githubUrl: "",
    allowIframe: false,
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-500",
    desktopScreenshots: [],
    mobileScreenshots: [
      { src: "/projects/fittrack/mobile-1.png", alt: "Home Screen" },
      { src: "/projects/fittrack/mobile-2.png", alt: "Workout Tracker" },
      { src: "/projects/fittrack/mobile-3.png", alt: "Progress Charts" },
      { src: "/projects/fittrack/mobile-4.png", alt: "Nutrition Log" },
    ],
    featured: true,
    order: 2,
  },
  {
    title: "AI Content Writer",
    description: "AI-powered platform for generating marketing content",
    longDescription:
      "An intelligent content generation platform that uses advanced AI to create high-quality marketing copy, blog posts, social media content, and more. Features multiple AI models, tone customization, and team collaboration tools.",
    image: "/projects/aiwriter/thumbnail.png",
    tags: ["Next.js", "OpenAI", "Tailwind", "Prisma", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    allowIframe: false,
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
    desktopScreenshots: [
      { src: "/projects/aiwriter/desktop-1.png", alt: "Content Editor" },
      { src: "/projects/aiwriter/desktop-2.png", alt: "Templates" },
    ],
    mobileScreenshots: [],
    featured: false,
    order: 3,
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data and seed fresh
    await Promise.all([
      Hero.deleteMany({}),
      About.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
    ]);

    // Seed all data
    await Promise.all([
      Hero.create(heroData),
      About.create(aboutData),
      Skill.insertMany(skillsData),
      Project.insertMany(projectsData),
    ]);

    return NextResponse.json({
      success: true,
      message: "All data seeded successfully!",
      seeded: {
        hero: 1,
        about: 1,
        skills: skillsData.length,
        projects: projectsData.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to seed the database with static data",
    endpoint: "/api/seed",
  });
}
