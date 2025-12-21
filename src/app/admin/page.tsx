"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Sparkles,
  Mail,
  Eye,
  TrendingUp,
} from "lucide-react";

interface Stats {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, skillsRes, messagesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/contact/messages"),
        ]);

        const projects = await projectsRes.json();
        const skills = await skillsRes.json();
        const messages = await messagesRes.json();

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          unreadMessages: Array.isArray(messages)
            ? messages.filter((m: { read: boolean }) => !m.read).length
            : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "from-cyan-500 to-blue-500",
      href: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      href: "/admin/skills",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: Mail,
      color: "from-green-500 to-emerald-500",
      href: "/admin/messages",
    },
    {
      label: "Unread",
      value: stats.unreadMessages,
      icon: Eye,
      color: "from-orange-500 to-red-500",
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <motion.a
            key={stat.label}
            href={stat.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {loading ? "..." : stat.value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/projects"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              <span className="text-white">Add New Project</span>
            </a>
            <a
              href="/admin/skills"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-white">Manage Skills</span>
            </a>
            <a
              href="/admin/messages"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5 text-green-400" />
              <span className="text-white">View Messages</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              Welcome to your portfolio admin panel. Here you can manage all
              aspects of your portfolio website.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Update your Hero section content
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Add and manage your projects
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Customize your skills showcase
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Respond to contact messages
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
