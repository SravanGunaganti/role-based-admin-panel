import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  isDeleted:boolean;
}


const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  isDeleted: { type: Boolean, default:false},
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);

