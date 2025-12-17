import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAboutSlide {
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

export interface IAbout extends Document {
  slides: IAboutSlide[];
  createdAt: Date;
  updatedAt: Date;
}

const AboutSlideSchema = new Schema<IAboutSlide>({
  src: { type: String, required: true },
  label: { type: String, required: true },
  title: { type: String, required: true },
  highlight: { type: String, required: true },
  highlightColor: { type: String, default: "text-cyan-400" },
  description: { type: String, required: true },
  skills: [{ type: String }],
  ctaText: { type: String, required: true },
  ctaLink: { type: String, required: true },
  ctaColor: { type: String, default: "bg-cyan-500 hover:bg-cyan-600" },
});

const AboutSchema = new Schema<IAbout>(
  {
    slides: [AboutSlideSchema],
  },
  { timestamps: true }
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
