import { Router, Request, Response } from 'express';
import { Employee, notDeletedFilter } from '../models/Employee';
import { Attendance } from '../models/Attendance';
import { sendError } from '../middleware/errorHandler';
import { ErrorCodes } from '../types/api';

const router = Router();

/** Server date in YYYY-MM-DD (use for todayPresentCount; frontend should not rely on client timezone for "today"). */
function getTodayYYYYMMDD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const today = getTodayYYYYMMDD();
    const [totalEmployees, totalAttendanceRecords, todayPresentCount] = await Promise.all([
      Employee.countDocuments(notDeletedFilter),
      Attendance.countDocuments(),
      Attendance.countDocuments({ date: today, status: 'Present' }),
    ]);
    res.status(200).json({
      totalEmployees,
      totalAttendanceRecords,
      todayPresentCount,
    });
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to get dashboard stats.', ErrorCodes.INTERNAL);
  }
});

export default router;
