import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployeeDoc extends Document {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  deletedAt?: Date | null;
}

const employeeSchema = new Schema<IEmployeeDoc>(
  {
    employeeId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret._id = (ret._id as { toString(): string }).toString();
        if (ret.createdAt) ret.createdAt = (ret.createdAt as Date).toISOString();
        if (ret.updatedAt) ret.updatedAt = (ret.updatedAt as Date).toISOString();
        if (ret.deletedAt) ret.deletedAt = (ret.deletedAt as Date).toISOString();
        return ret;
      },
    },
  }
);

/** Filter for non–soft-deleted employees (use in find/countDocuments). */
export const notDeletedFilter: { $or: Array<{ deletedAt: null | { $exists: false } }> } = {
  $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
};

employeeSchema.index({ department: 1 });
employeeSchema.index({ deletedAt: 1 });

export const Employee: Model<IEmployeeDoc> =
  mongoose.models.Employee ?? mongoose.model<IEmployeeDoc>('Employee', employeeSchema);
