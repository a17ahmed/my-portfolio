"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Plus, X, Upload, FileText, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

interface HeroData {
  greeting: string;
  name: string;
  title: string;
  taglines: string[];
  description: string;
  backgroundImage: string;
  socialLinks: SocialLink[];
  resumeUrl: string;
  githubUsername: string;
}

const defaultHero: HeroData = {
  greeting: "Hello World, I'm",
  name: "Ahmed Irfan",
  title: "Full Stack Developer",
  taglines: [
    "I'm not a magician, but I can make bugs disappear",
    "Turning caffeine into code since 2019",
    "I speak fluent JavaScript, Python & Sarcasm",
  ],
  description:
    "I craft beautiful, performant web experiences that users love.",
  backgroundImage: "/images/main-image.png",
  socialLinks: [
    { name: "GitHub", href: "https://github.com", icon: "Github" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
    { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
  ],
  resumeUrl: "",
  githubUsername: "",
};

export default function HeroAdmin() {
  const [formData, setFormData] = useState<HeroData>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taglineInput, setTaglineInput] = useState("");

  useEffect(() => {
    fetchHero();
  }, []);

  async function fetchHero() {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data && data.name) {
        setFormData(data);
      }
    } catch (error) {
      console.error("Error fetching hero:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Hero section updated!");
    } catch (error) {
      console.error("Error saving hero:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "portfolio/hero");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setFormData({ ...formData, backgroundImage: url });
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "portfolio/resume");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setFormData({ ...formData, resumeUrl: url });
      toast.success("Resume uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload resume");
    }
  }

  function addTagline() {
    if (taglineInput.trim()) {
      setFormData({
        ...formData,
        taglines: [...formData.taglines, taglineInput.trim()],
      });
      setTaglineInput("");
    }
  }

  function removeTagline(index: number) {
    setFormData({
      ...formData,
      taglines: formData.taglines.filter((_, i) => i !== index),
    });
  }

  function updateSocialLink(
    index: number,
    field: keyof SocialLink,
    value: string
  ) {
    const updated = [...formData.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, socialLinks: updated });
  }

  function addSocialLink() {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { name: "", href: "", icon: "Github" },
      ],
    });
  }

  function removeSocialLink(index: number) {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
        <p className="text-gray-400">
          Customize your landing section content
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 border border-white/10 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Greeting
            </label>
            <input
              type="text"
              value={formData.greeting}
              onChange={(e) =>
                setFormData({ ...formData, greeting: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Image
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 border-dashed rounded-lg text-gray-400 hover:bg-white/10 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload new image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {formData.backgroundImage && (
            <div className="mt-3 relative h-40 rounded-lg overflow-hidden">
              <Image
                src={formData.backgroundImage}
                alt="Background preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Taglines (rotating text)
          </label>
          <div className="space-y-2 mb-3">
            {formData.taglines.map((tagline, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg"
              >
                <span className="flex-1 text-gray-300 text-sm">{tagline}</span>
                <button
                  type="button"
                  onClick={() => removeTagline(index)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={taglineInput}
              onChange={(e) => setTaglineInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTagline())}
              placeholder="Add a tagline..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Button type="button" onClick={addTagline} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Social Links
            </label>
            <Button
              type="button"
              onClick={addSocialLink}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-3 items-start">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) =>
                    updateSocialLink(index, "name", e.target.value)
                  }
                  placeholder="Name"
                  className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="url"
                  value={link.href}
                  onChange={(e) =>
                    updateSocialLink(index, "href", e.target.value)
                  }
                  placeholder="URL"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select
                  value={link.icon}
                  onChange={(e) =>
                    updateSocialLink(index, "icon", e.target.value)
                  }
                  className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Github">GitHub</option>
                  <option value="Linkedin">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Youtube">YouTube</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Username
              </div>
            </label>
            <input
              type="text"
              value={formData.githubUsername}
              onChange={(e) =>
                setFormData({ ...formData, githubUsername: e.target.value })
              }
              placeholder="e.g., a17ahmed"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used to fetch GitHub stats and repositories
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resume
              </div>
            </label>
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 border-dashed rounded-lg text-gray-400 hover:bg-white/10 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>{formData.resumeUrl ? "Change Resume" : "Upload Resume"}</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
            {formData.resumeUrl && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-cyan-400" />
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline truncate"
                >
                  View uploaded resume
                </a>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, resumeUrl: "" })}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-cyan-500 hover:bg-cyan-600"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
