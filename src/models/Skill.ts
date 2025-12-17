import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  details: string[];
  tools: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Icon name from lucide-react
    color: { type: String, default: "text-cyan-400" },
    bgGradient: { type: String, default: "from-cyan-500/20 to-blue-500/20" },
    details: [{ type: String }],
    tools: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
