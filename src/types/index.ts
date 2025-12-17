// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  image?: string;
  createdAt: Date;
}

// Project Types
export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  category: "web" | "mobile" | "fullstack";
  liveUrl?: string;
  githubUrl?: string;
  iframeAllowed: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  company?: string;
  rating: number;
  text: string;
  videoUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

// Skill Types
export interface Skill {
  _id: string;
  name: string;
  category: "frontend" | "backend" | "devops" | "tools";
  icon: string;
  proficiency: number;
  yearsUsed: number;
  order: number;
}

// About Types
export interface About {
  _id: string;
  bio: string;
  shortBio: string;
  profileImage: string;
  yearsExperience: number;
  projectsCompleted: number;
  clientsServed: number;
  resumeUrl?: string;
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

// Message Types
export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Settings Types
export interface Settings {
  _id: string;
  siteName: string;
  siteDescription: string;
  chatbotEnabled: boolean;
  chatbotContext?: string;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// GitHub Stats Types
export interface GitHubStats {
  totalContributions: number;
  publicRepos: number;
  totalStars: number;
  followers: number;
  topLanguages: { name: string; percentage: number }[];
  featuredRepos: GitHubRepo[];
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ReviewFormData {
  rating: number;
  text: string;
  company?: string;
  video?: File;
}

// Navigation Types
export interface NavLink {
  name: string;
  href: string;
}
