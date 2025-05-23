import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  _id:mongoose.Types.ObjectId;
  customerName: string;
  productId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  orderId?:string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
}

const OrderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: false, unique: true },
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
