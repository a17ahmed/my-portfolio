import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactInfo extends Document {
  email: string;
  phone?: string;
  location?: string;
  availability: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    availability: { type: String, default: "Available for freelance" },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
    },
  },
  { timestamps: true }
);

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactInfo: Model<IContactInfo> =
  mongoose.models.ContactInfo ||
  mongoose.model<IContactInfo>("ContactInfo", ContactInfoSchema);

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
