"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

interface Screenshot {
  src: string;
  alt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  allowIframe: boolean;
  gradientFrom: string;
  gradientTo: string;
  desktopScreenshots: Screenshot[];
  mobileScreenshots: Screenshot[];
  featured: boolean;
  order: number;
}

const emptyProject: Omit<Project, "_id"> = {
  title: "",
  description: "",
  longDescription: "",
  image: "",
  tags: [],
  liveUrl: "",
  githubUrl: "",
  allowIframe: false,
  gradientFrom: "from-cyan-500",
  gradientTo: "to-blue-500",
  desktopScreenshots: [],
  mobileScreenshots: [],
  featured: false,
  order: 0,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, "_id">>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  function openModal(project?: Project) {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || "",
        image: project.image,
        tags: project.tags,
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        allowIframe: project.allowIframe,
        gradientFrom: project.gradientFrom,
        gradientTo: project.gradientTo,
        desktopScreenshots: project.desktopScreenshots,
        mobileScreenshots: project.mobileScreenshots,
        featured: project.featured,
        order: project.order,
      });
      setTagsInput(project.tags.join(", "));
    } else {
      setEditingProject(null);
      setFormData(emptyProject);
      setTagsInput("");
    }
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const payload = { ...formData, tags };

    try {
      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save project");

      toast.success(
        editingProject ? "Project updated!" : "Project created!"
      );
      setModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");

      toast.success("Project deleted!");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "portfolio/projects");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="relative h-48">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradientFrom} ${project.gradientTo}`}
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
              {project.featured && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                  Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-300" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Github className="w-4 h-4 text-gray-300" />
                  </a>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => openModal(project)}
                  className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No projects yet</p>
          <Button
            onClick={() => openModal()}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
            >
              <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, longDescription: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-black file:font-medium"
                  />
                  {formData.image && (
                    <div className="mt-2 relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, Next.js, TypeScript"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, liveUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowIframe}
                      onChange={(e) =>
                        setFormData({ ...formData, allowIframe: e.target.checked })
                      }
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-300">Allow iframe preview</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-300">Featured project</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingProject ? (
                      "Update Project"
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
