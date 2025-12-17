"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn } from "@/components/animations";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "a17irfan@gmail.com",
    href: "mailto:a17irfan@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Available Worldwide",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 307 0019031",
    href: "tel:+923070019031",
  },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
];

const subjects = [
  "General Inquiry",
  "Project Collaboration",
  "Job Opportunity",
  "Freelance Work",
  "Other",
];

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! I'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s work together to create something
            amazing.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <FadeIn direction="left" delay={0.2}>
            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-6">
                  Let&apos;s Connect
                </h3>
                <p className="text-muted-foreground mb-8">
                  I&apos;m always open to discussing new projects, creative
                  ideas, or opportunities to be part of your vision. Feel free
                  to reach out!
                </p>

                {/* Contact details */}
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4"
                    >
                      <div className="h-12 w-12 rounded-xl glass flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium hover:gradient-text transition-all"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social links & Resume */}
              <div className="glass-card rounded-2xl p-6">
                <h4 className="font-semibold mb-4">Find me on</h4>
                <div className="flex gap-3 mb-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-xl glass glass-hover flex items-center justify-center text-muted-foreground hover:text-cyan-400 transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full glass glass-hover"
                  asChild
                >
                  <a href="/resume.pdf" download>
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn direction="right" delay={0.3}>
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border/50 focus:border-cyan-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border/50 focus:border-cyan-500"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 rounded-md bg-background/50 border border-border/50 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-foreground"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-background/50 border-border/50 focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
