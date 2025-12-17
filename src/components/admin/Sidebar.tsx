"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  User,
  Home,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Section", icon: Home },
  { href: "/admin/about", label: "About Section", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900/50 border-r border-white/10 p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold">Portfolio</h1>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
