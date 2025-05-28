import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  managerId?: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;

  product: {
    name: string;
    price: number;
    image?: string;
  };

  manager?: {
    name: string;
    email: string;
  };

  employee: {
    name: string;
    email: string;
  };

  customer: {
    name: string;
    email: string;
    address?: string;
    mobileNumber?: string;
  };

  status: 'Pending' | 'Delivered' | 'Cancelled';

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'User',index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  product: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String,required:true },
  },

  manager: {
    name: { type: String},
    email: { type: String},
  },

  employee: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },

  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    mobileNumber: { type: String },
  },

  status: {
    type: String,
    enum: ['Pending', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },

}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
