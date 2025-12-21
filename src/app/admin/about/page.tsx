"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Plus, X, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

interface AboutSlide {
  src: string;
  label: string;
  title: string;
  highlight: string;
  highlightColor: string;
  description: string;
  skills: string[];
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
}

interface AboutData {
  slides: AboutSlide[];
}

const emptySlide: AboutSlide = {
  src: "",
  label: "",
  title: "",
  highlight: "",
  highlightColor: "text-cyan-400",
  description: "",
  skills: [],
  ctaText: "Learn More",
  ctaLink: "#contact",
  ctaColor: "bg-cyan-500 hover:bg-cyan-600",
};

const colorOptions = [
  { label: "Cyan", value: "text-cyan-400", bg: "bg-cyan-500 hover:bg-cyan-600" },
  { label: "Purple", value: "text-purple-400", bg: "bg-purple-500 hover:bg-purple-600" },
  { label: "Emerald", value: "text-emerald-400", bg: "bg-emerald-500 hover:bg-emerald-600" },
  { label: "Orange", value: "text-orange-400", bg: "bg-orange-500 hover:bg-orange-600" },
];

export default function AboutAdmin() {
  const [formData, setFormData] = useState<AboutData>({ slides: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);
  const [skillInputs, setSkillInputs] = useState<string[]>([]);

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data && data.slides) {
        setFormData(data);
        setSkillInputs(data.slides.map((s: AboutSlide) => s.skills.join(", ")));
      }
    } catch (error) {
      console.error("Error fetching about:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Parse skills from inputs
    const slidesWithParsedSkills = formData.slides.map((slide, index) => ({
      ...slide,
      skills: skillInputs[index]
        ? skillInputs[index].split(",").map((s) => s.trim()).filter((s) => s)
        : [],
    }));

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: slidesWithParsedSkills }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("About section updated!");
    } catch (error) {
      console.error("Error saving about:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    slideIndex: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "portfolio/about");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      updateSlide(slideIndex, "src", url);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
  }

  function updateSlide(index: number, field: keyof AboutSlide, value: string | string[]) {
    const updated = [...formData.slides];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, slides: updated });
  }

  function addSlide() {
    setFormData({
      ...formData,
      slides: [...formData.slides, { ...emptySlide }],
    });
    setSkillInputs([...skillInputs, ""]);
    setExpandedSlide(formData.slides.length);
  }

  function removeSlide(index: number) {
    if (!confirm("Are you sure you want to remove this slide?")) return;
    setFormData({
      ...formData,
      slides: formData.slides.filter((_, i) => i !== index),
    });
    setSkillInputs(skillInputs.filter((_, i) => i !== index));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">About Section</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your about section slides
          </p>
        </div>
        <Button onClick={addSlide} className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Add Slide
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-white/10 overflow-hidden"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                setExpandedSlide(expandedSlide === index ? null : index)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setExpandedSlide(expandedSlide === index ? null : index);
                }
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {slide.src && (
                  <div className="w-16 h-12 rounded-lg overflow-hidden relative">
                    <Image
                      src={slide.src}
                      alt={slide.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-white">
                    {slide.label || `Slide ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-400">{slide.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(index);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
                {expandedSlide === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedSlide === index && (
              <div className="p-4 sm:p-6 pt-2 space-y-4 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={slide.label}
                      onChange={(e) => updateSlide(index, "label", e.target.value)}
                      placeholder="e.g., Creative Vision"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color Theme
                    </label>
                    <select
                      value={slide.highlightColor}
                      onChange={(e) => {
                        const selected = colorOptions.find(
                          (c) => c.value === e.target.value
                        );
                        updateSlide(index, "highlightColor", e.target.value);
                        if (selected) {
                          updateSlide(index, "ctaColor", selected.bg);
                        }
                      }}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    Image
                  </label>
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 border-dashed rounded-lg text-gray-400 hover:bg-white/10 transition-colors">
                      <Upload className="w-5 h-5" />
                      <span>Upload image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                    />
                  </label>
                  {slide.src && (
                    <div className="mt-2 relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={slide.src}
                        alt={slide.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateSlide(index, "title", e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Highlight Text
                    </label>
                    <input
                      type="text"
                      value={slide.highlight}
                      onChange={(e) =>
                        updateSlide(index, "highlight", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={slide.description}
                    onChange={(e) =>
                      updateSlide(index, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillInputs[index] || ""}
                    onChange={(e) => {
                      const updated = [...skillInputs];
                      updated[index] = e.target.value;
                      setSkillInputs(updated);
                    }}
                    placeholder="React, Next.js, TypeScript"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={slide.ctaText}
                      onChange={(e) =>
                        updateSlide(index, "ctaText", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={slide.ctaLink}
                      onChange={(e) =>
                        updateSlide(index, "ctaLink", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {formData.slides.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl border border-white/10">
            <p className="text-gray-400 mb-4">No slides yet</p>
            <Button
              type="button"
              onClick={addSlide}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Slide
            </Button>
          </div>
        )}

        {formData.slides.length > 0 && (
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
                Save All Changes
              </>
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
