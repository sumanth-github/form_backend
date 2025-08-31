import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  answer: string;
  createdAt?: Date;
}

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  questions: IQuestion[];
  submitted: boolean;
  reportUrl?: string; // URL/path to PDF report
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] },
  submitted: { type: Boolean, default: false },
  reportUrl: { type: String },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
