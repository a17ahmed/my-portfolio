"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Skill {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  details: string[];
  tools: string[];
  order: number;
}

const emptySkill: Omit<Skill, "_id"> = {
  title: "",
  description: "",
  icon: "Code",
  color: "text-cyan-400",
  bgGradient: "from-cyan-500/20 to-blue-500/20",
  details: [],
  tools: [],
  order: 0,
};

const iconOptions = [
  "Code",
  "Zap",
  "Shield",
  "Database",
  "Globe",
  "Smartphone",
  "Server",
  "Cloud",
  "Lock",
  "Cpu",
  "Terminal",
  "GitBranch",
];

const colorOptions = [
  { label: "Cyan", value: "text-cyan-400" },
  { label: "Purple", value: "text-purple-400" },
  { label: "Green", value: "text-green-400" },
  { label: "Orange", value: "text-orange-400" },
  { label: "Pink", value: "text-pink-400" },
  { label: "Blue", value: "text-blue-400" },
];

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, "_id">>(emptySkill);
  const [saving, setSaving] = useState(false);
  const [detailsInput, setDetailsInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  function openModal(skill?: Skill) {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        title: skill.title,
        description: skill.description,
        icon: skill.icon,
        color: skill.color,
        bgGradient: skill.bgGradient,
        details: skill.details,
        tools: skill.tools,
        order: skill.order,
      });
      setDetailsInput(skill.details.join("\n"));
      setToolsInput(skill.tools.join(", "));
    } else {
      setEditingSkill(null);
      setFormData(emptySkill);
      setDetailsInput("");
      setToolsInput("");
    }
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const details = detailsInput
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d);
    const tools = toolsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const payload = { ...formData, details, tools };

    try {
      const url = editingSkill
        ? `/api/skills/${editingSkill._id}`
        : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save skill");

      toast.success(editingSkill ? "Skill updated!" : "Skill created!");
      setModalOpen(false);
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error("Failed to save skill");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete skill");

      toast.success("Skill deleted!");
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
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
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-gray-400">Manage your skill domains</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <motion.div
            key={skill._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card rounded-2xl p-6 border border-white/10 bg-gradient-to-br ${skill.bgGradient}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${skill.color}`}
              >
                <span className="text-2xl">{skill.icon}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(skill)}
                  className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {skill.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {skill.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {skill.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                >
                  {tool}
                </span>
              ))}
              {skill.tools.length > 3 && (
                <span className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded">
                  +{skill.tools.length - 3}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No skills yet</p>
          <Button
            onClick={() => openModal()}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Skill
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
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
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
                    placeholder="e.g., Animation & Motion"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {colorOptions.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Details (one per line)
                  </label>
                  <textarea
                    value={detailsInput}
                    onChange={(e) => setDetailsInput(e.target.value)}
                    rows={4}
                    placeholder="Smooth transitions and micro-interactions&#10;Complex animation sequences&#10;Performance-optimized animations"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tools (comma separated)
                  </label>
                  <input
                    type="text"
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    placeholder="Framer Motion, GSAP, CSS Animations"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
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
                    ) : editingSkill ? (
                      "Update Skill"
                    ) : (
                      "Create Skill"
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
