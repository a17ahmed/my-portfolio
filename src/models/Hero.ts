import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface IHero extends Document {
  greeting: string;
  name: string;
  title: string;
  taglines: string[];
  description: string;
  backgroundImage: string;
  socialLinks: ISocialLink[];
  resumeUrl: string;
  githubUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>({
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String, required: true },
});

const HeroSchema = new Schema<IHero>(
  {
    greeting: { type: String, default: "Hello World, I'm" },
    name: { type: String, required: true },
    title: { type: String, required: true },
    taglines: [{ type: String }],
    description: { type: String, required: true },
    backgroundImage: { type: String, required: true },
    socialLinks: [SocialLinkSchema],
    resumeUrl: { type: String, default: "" },
    githubUsername: { type: String, default: "" },
  },
  { timestamps: true }
);

const Hero: Model<IHero> =
  mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
