import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScreenshot {
  src: string;
  alt: string;
}

export interface IProject extends Document {
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
  desktopScreenshots: IScreenshot[];
  mobileScreenshots: IScreenshot[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScreenshotSchema = new Schema<IScreenshot>({
  src: { type: String, required: true },
  alt: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    image: { type: String, required: true },
    tags: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    allowIframe: { type: Boolean, default: false },
    gradientFrom: { type: String, default: "from-cyan-500" },
    gradientTo: { type: String, default: "to-blue-500" },
    desktopScreenshots: [ScreenshotSchema],
    mobileScreenshots: [ScreenshotSchema],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
