import { Router, Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import { Employee, notDeletedFilter } from '../models/Employee';
import { validateAttendanceBody, validateDateQuery } from '../validation';
import { sendError } from '../middleware/errorHandler';
import { ErrorCodes } from '../types/api';
import { ListResponse } from '../types/api';

const router = Router();

function toAttendanceJson(r: { _id: { toString(): string }; employeeId: string; date: string; status: string }) {
  return { _id: r._id.toString(), employeeId: r.employeeId, date: r.date, status: r.status };
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId.trim() || undefined : undefined;
    const dateParam = typeof req.query.date === 'string' ? req.query.date.trim() : undefined;

    if (dateParam) {
      const dateValidation = validateDateQuery(dateParam);
      if (!dateValidation.valid) {
        return sendError(res, 400, dateValidation.message!, ErrorCodes.INVALID_DATE);
      }
    }

    const filter: { employeeId?: string; date?: string } = {};
    if (employeeId) filter.employeeId = employeeId;
    if (dateParam) filter.date = dateParam;

    const records = await Attendance.find(filter).lean();
    const list = records.map((r) => toAttendanceJson(r as Parameters<typeof toAttendanceJson>[0]));
    const payload: ListResponse<ReturnType<typeof toAttendanceJson>> = { data: list, total: list.length };
    res.status(200).json(payload);
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to list attendance.', ErrorCodes.INTERNAL);
  }
});

router.post('/', async (req: Request, res: Response) => {
  const validation = validateAttendanceBody(req.body);
  if (!validation.ok) {
    return sendError(res, 400, validation.message, validation.code, validation.errors);
  }
  const { employeeId, date, status } = validation.data;
  try {
    const employeeExists = await Employee.exists({ employeeId, ...notDeletedFilter });
    if (!employeeExists) {
      return sendError(res, 400, `No employee found with employeeId "${employeeId}". Create the employee first.`, ErrorCodes.ATTENDANCE_EMPLOYEE_NOT_FOUND);
    }

    const existing = await Attendance.findOne({ employeeId, date }).lean();
    const record = await Attendance.findOneAndUpdate(
      { employeeId, date },
      { $set: { status } },
      { new: true, upsert: true }
    ).lean();
    if (!record) {
      return sendError(res, 500, 'Failed to save attendance.', ErrorCodes.INTERNAL);
    }
    if (!existing) {
      return res.status(201).json(toAttendanceJson(record as Parameters<typeof toAttendanceJson>[0]));
    }
    res.status(200).json(toAttendanceJson(record as Parameters<typeof toAttendanceJson>[0]));
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to mark attendance.', ErrorCodes.INTERNAL);
  }
});

export default router;
