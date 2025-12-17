"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  slug: string;
}

// Demo blog posts - these will come from the database later
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications with Next.js 14",
    excerpt:
      "Learn how to structure large-scale React applications using the latest features in Next.js 14, including the App Router and Server Components.",
    featuredImage: "/blog/nextjs.jpg",
    category: "Development",
    publishedAt: "Dec 10, 2025",
    readingTime: "8 min read",
    slug: "building-scalable-react-apps",
  },
  {
    id: "2",
    title: "The Complete Guide to Three.js for Web Developers",
    excerpt:
      "Dive into the world of 3D web development with Three.js. From basic scenes to complex animations, this guide covers everything.",
    featuredImage: "/blog/threejs.jpg",
    category: "Tutorial",
    publishedAt: "Dec 5, 2025",
    readingTime: "12 min read",
    slug: "complete-guide-threejs",
  },
  {
    id: "3",
    title: "Mastering TypeScript: Advanced Types and Patterns",
    excerpt:
      "Take your TypeScript skills to the next level with advanced type patterns, utility types, and real-world examples.",
    featuredImage: "/blog/typescript.jpg",
    category: "TypeScript",
    publishedAt: "Nov 28, 2025",
    readingTime: "10 min read",
    slug: "mastering-typescript-advanced",
  },
];

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="glass-card glass-hover rounded-2xl overflow-hidden h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-cyan-500/20 to-purple-500/20 overflow-hidden">
            {/* Placeholder gradient - replace with actual image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-50">📝</span>
            </div>
            {/* Uncomment when you have actual images */}
            {/* <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            /> */}

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
                {post.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-all line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Read more */}
            <span className="inline-flex items-center text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
              Read More
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function Blog() {
  return (
    <section id="blog" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development
          </p>
        </FadeIn>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <FadeIn delay={0.3} className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="glass glass-hover rounded-full"
            asChild
          >
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
