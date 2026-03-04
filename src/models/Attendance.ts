import mongoose, { Schema, Document, Model } from 'mongoose';

export type AttendanceStatus = 'Present' | 'Absent';

export interface IAttendanceDoc extends Document {
  employeeId: string;
  date: string;
  status: AttendanceStatus;
}

const attendanceSchema = new Schema<IAttendanceDoc>(
  {
    employeeId: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true, enum: ['Present', 'Absent'] },
  },
  {
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret._id = (ret._id as { toString(): string }).toString();
        return ret;
      },
    },
  }
);

attendanceSchema.index({ employeeId: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance: Model<IAttendanceDoc> =
  mongoose.models.Attendance ?? mongoose.model<IAttendanceDoc>('Attendance', attendanceSchema);
