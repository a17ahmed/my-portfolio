"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Play, X, Send, Loader2, Video, Upload, Camera, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

interface Review {
  id: string;
  _id?: string;
  userName: string;
  userImage?: string;
  company: string;
  rating: number;
  text: string;
  videoUrl?: string;
}

// Static reviews as fallback
const staticReviews: Review[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    company: "TechStartup Inc.",
    rating: 5,
    text: "Ahmed delivered an exceptional e-commerce platform for our business. His attention to detail and technical expertise exceeded our expectations. The website is fast, beautiful, and our sales have increased by 40%!",
  },
  {
    id: "2",
    userName: "Michael Chen",
    company: "Digital Agency",
    rating: 5,
    text: "Working with Ahmed was a fantastic experience. He understood our requirements perfectly and delivered a stunning dashboard that our clients love. His communication and professionalism are top-notch.",
  },
  {
    id: "3",
    userName: "Emily Rodriguez",
    company: "HealthTech Solutions",
    rating: 5,
    text: "Ahmed built our mobile app from scratch and it turned out amazing. He was always available to discuss features and made sure everything worked perfectly. Highly recommend his services!",
  },
  {
    id: "4",
    userName: "David Kim",
    company: "Creative Studios",
    rating: 4,
    text: "Great developer with excellent problem-solving skills. Ahmed helped us revamp our entire web presence and the results speak for themselves. Would definitely work with him again.",
  },
  {
    id: "5",
    userName: "Lisa Thompson",
    company: "E-Learn Platform",
    rating: 5,
    text: "Ahmed created a beautiful learning management system for us. His expertise in React and Node.js really showed in the quality of the code. The platform handles thousands of users without any issues.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, isActive }: { review: Review; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1 : 0.9,
      }}
      transition={{ duration: 0.4 }}
      className={`glass-card rounded-2xl p-6 md:p-8 ${
        isActive ? "ring-2 ring-cyan-500/50" : ""
      }`}
    >
      {/* Quote icon */}
      <Quote className="h-10 w-10 text-cyan-500/30 mb-4" />

      {/* Review text */}
      <p className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
          {review.userImage ? (
            <Image
              src={review.userImage}
              alt={review.userName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-xl font-bold gradient-text">
              {review.userName.charAt(0)}
            </span>
          )}
        </div>

        {/* Name and company */}
        <div className="flex-1">
          <p className="font-semibold">{review.userName}</p>
          <p className="text-sm text-muted-foreground">{review.company}</p>
        </div>

        {/* Rating */}
        <StarRating rating={review.rating} />
      </div>

      {/* Video button if available */}
      {review.videoUrl && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 glass glass-hover"
        >
          <Play className="h-4 w-4 mr-2" />
          Watch Video Review
        </Button>
      )}
    </motion.div>
  );
}

// Interactive Star Rating for form
function StarRatingInput({ rating, setRating }: { rating: number; setRating: (r: number) => void }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// Review Form Modal with Video Recording/Upload
function ReviewFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    company: "",
    rating: 5,
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Video states
  const [videoMode, setVideoMode] = useState<"none" | "record" | "upload">("none");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) await startCamera();
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setRecordedUrl(URL.createObjectURL(blob));
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 120) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video file is too large. Maximum size is 100MB");
      return;
    }

    setRecordedBlob(file);
    setRecordedUrl(URL.createObjectURL(file));
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!recordedBlob) return null;

    setIsUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", recordedBlob, "review-video.webm");

      const res = await fetch("/api/upload/review-video", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedVideoUrl(data.url);
        return data.url;
      }
      return null;
    } catch (err) {
      console.error("Video upload error:", err);
      return null;
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const clearVideo = () => {
    setRecordedBlob(null);
    setRecordedUrl(null);
    setUploadedVideoUrl(null);
    setVideoMode("none");
    setRecordingTime(0);
    stopCamera();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Upload video if exists
      let videoUrl = uploadedVideoUrl;
      if (recordedBlob && !uploadedVideoUrl) {
        videoUrl = await uploadVideo();
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          videoUrl,
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ userName: "", email: "", company: "", rating: 5, text: "" });
        clearVideo();
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    clearVideo();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[90vh] overflow-y-auto z-50"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-bold mb-2">Leave a Review</h3>
              <p className="text-muted-foreground mb-6">
                Share your experience working with me
              </p>

              {/* Success State */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Star className="h-8 w-8 text-green-500 fill-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
                  <p className="text-muted-foreground">
                    Your review has been submitted and will be visible after approval.
                  </p>
                </motion.div>
              )}

              {/* Review Form */}
              {submitStatus !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <StarRatingInput
                      rating={formData.rating}
                      setRating={(r) => setFormData({ ...formData, rating: r })}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="TechStartup Inc."
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>

                  {/* Video Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video Review <span className="text-muted-foreground">(Optional)</span>
                    </label>

                    {videoMode === "none" && !recordedUrl && (
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setVideoMode("record");
                            startCamera();
                          }}
                          className="flex-1 glass glass-hover rounded-xl py-6"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Record Video
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setVideoMode("upload");
                            fileInputRef.current?.click();
                          }}
                          className="flex-1 glass glass-hover rounded-xl py-6"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Upload Video
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    )}

                    {/* Camera/Recording View */}
                    {videoMode === "record" && !recordedUrl && (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover mirror"
                            style={{ transform: "scaleX(-1)" }}
                          />
                          {isRecording && (
                            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-sm font-medium">
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              {formatTime(recordingTime)} / 2:00
                            </div>
                          )}
                          {cameraError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400 text-center p-4">
                              {cameraError}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {!isRecording ? (
                            <Button
                              type="button"
                              onClick={startRecording}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            >
                              <Camera className="h-5 w-5 mr-2" />
                              Start Recording
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={stopRecording}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            >
                              <Square className="h-5 w-5 mr-2" />
                              Stop Recording
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={clearVideo}
                            className="glass glass-hover rounded-xl"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Video Preview */}
                    {recordedUrl && (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                          <video
                            src={recordedUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                          {isUploadingVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                                <span className="text-sm">Uploading video...</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearVideo}
                          className="w-full glass glass-hover rounded-xl"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Video
                        </Button>
                      </div>
                    )}
                  </div>

                  {submitStatus === "error" && (
                    <p className="text-red-400 text-sm">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isUploadingVideo}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {recordedBlob && !uploadedVideoUrl ? "Uploading Video..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(staticReviews);

  // Fetch reviews from database
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const transformedReviews = data.map((r: any) => ({
            id: r._id,
            _id: r._id,
            userName: r.userName,
            userImage: r.userImage,
            company: r.company,
            rating: r.rating,
            text: r.text,
            videoUrl: r.videoUrl,
          }));
          setReviews(transformedReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Keep using static reviews on error
      }
    }

    fetchReviews();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section id="reviews" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="gradient-text">Reviews</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What my clients say about working with me
          </p>
        </FadeIn>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.2}>
            {/* Main review */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <ReviewCard
                  key={reviews[currentIndex].id}
                  review={reviews[currentIndex]}
                  isActive={true}
                />
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                className="glass glass-hover rounded-full"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-gradient-to-r from-cyan-500 to-purple-500"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="glass glass-hover rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Leave Review CTA */}
        <FadeIn delay={0.3} className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Had a great experience working with me?
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-full"
          >
            Leave a Review
          </Button>
        </FadeIn>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
