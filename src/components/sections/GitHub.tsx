"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  Users,
  GitCommit,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

interface GitHubStats {
  totalContributions: number;
  publicRepos: number;
  totalStars: number;
  followers: number;
}

interface FeaturedRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubData {
  stats: GitHubStats;
  featuredRepos: FeaturedRepo[];
  contributionWeeks: ContributionWeek[];
  username: string;
  profileUrl: string;
}

// Fallback data in case API fails
const fallbackStats: GitHubStats = {
  totalContributions: 500,
  publicRepos: 20,
  totalStars: 50,
  followers: 30,
};

const fallbackRepos: FeaturedRepo[] = [
  {
    name: "portfolio-app",
    description: "My personal portfolio built with Next.js",
    stars: 5,
    forks: 2,
    language: "TypeScript",
    languageColor: "#3178C6",
    url: "https://github.com/a17ahmed",
  },
];

// Get contribution level color (Cyan style)
function getContributionColor(level: string): string {
  switch (level) {
    case "NONE":
      return "bg-muted/30";
    case "FIRST_QUARTILE":
      return "bg-cyan-500/30";
    case "SECOND_QUARTILE":
      return "bg-cyan-500/50";
    case "THIRD_QUARTILE":
      return "bg-cyan-500/70";
    case "FOURTH_QUARTILE":
      return "bg-cyan-500";
    default:
      return "bg-muted/30";
  }
}

function ContributionGraph({ weeks }: { weeks: ContributionWeek[] }) {
  if (!weeks || weeks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No contribution data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.contributionDays.map((day, dayIndex) => (
              <motion.div
                key={dayIndex}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: (weekIndex * 7 + dayIndex) * 0.001,
                  duration: 0.2,
                }}
                className={`w-3 h-3 rounded-sm ${getContributionColor(day.contributionLevel)} hover:ring-1 hover:ring-cyan-500/50 transition-all cursor-pointer`}
                title={`${day.contributionCount} contributions on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-muted/30" />
        <div className="w-3 h-3 rounded-sm bg-cyan-500/30" />
        <div className="w-3 h-3 rounded-sm bg-cyan-500/50" />
        <div className="w-3 h-3 rounded-sm bg-cyan-500/70" />
        <div className="w-3 h-3 rounded-sm bg-cyan-500" />
        <span>More</span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  index,
}: {
  icon: typeof Github;
  value: number | string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="glass-card glass-hover rounded-xl p-4 text-center"
    >
      <Icon className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
      <p className="text-2xl font-bold gradient-text">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function RepoCard({ repo, index }: { repo: FeaturedRepo; index: number }) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-hover rounded-xl p-5 block group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold group-hover:gradient-text transition-all">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {repo.description}
      </p>

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: repo.languageColor }}
          />
          {repo.language}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Star className="h-4 w-4" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <GitFork className="h-4 w-4" />
          {repo.forks}
        </span>
      </div>
    </motion.a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center">
            <div className="h-6 w-6 mx-auto mb-2 bg-muted/30 rounded" />
            <div className="h-8 w-16 mx-auto mb-1 bg-muted/30 rounded" />
            <div className="h-4 w-20 mx-auto bg-muted/20 rounded" />
          </div>
        ))}
      </div>

      {/* Graph skeleton */}
      <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto">
        <div className="h-6 w-40 mb-4 bg-muted/30 rounded" />
        <div className="h-24 bg-muted/20 rounded" />
      </div>
    </div>
  );
}

export function GitHub() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch");
        const githubData = await res.json();
        setData(githubData);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(true);
        // Use fallback data
        setData({
          stats: fallbackStats,
          featuredRepos: fallbackRepos,
          contributionWeeks: [],
          username: "a17ahmed",
          profileUrl: "https://github.com/a17ahmed",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  const stats = data?.stats || fallbackStats;
  const repos = data?.featuredRepos || fallbackRepos;
  const username = data?.username || "a17ahmed";
  const profileUrl = data?.profileUrl || "https://github.com/a17ahmed";

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My open source contributions and projects
          </p>
        </FadeIn>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Stats Grid */}
            <FadeIn delay={0.1} className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <StatCard
                  icon={GitCommit}
                  value={stats.totalContributions}
                  label="Contributions"
                  index={0}
                />
                <StatCard
                  icon={Github}
                  value={stats.publicRepos}
                  label="Repositories"
                  index={1}
                />
                <StatCard
                  icon={Star}
                  value={stats.totalStars}
                  label="Stars Earned"
                  index={2}
                />
                <StatCard
                  icon={Users}
                  value={stats.followers}
                  label="Followers"
                  index={3}
                />
              </div>
            </FadeIn>

            {/* Contribution Graph */}
            <FadeIn delay={0.2} className="mb-12">
              <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                  Contribution Graph
                </h3>
                <ContributionGraph weeks={data?.contributionWeeks || []} />
              </div>
            </FadeIn>

          </>
        )}

        {/* View Profile Button */}
        <FadeIn delay={0.4} className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="glass glass-hover rounded-full"
            asChild
          >
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              View GitHub Profile
            </a>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
