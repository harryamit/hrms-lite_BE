import { Router, Request, Response } from 'express';
import { Employee, notDeletedFilter } from '../models/Employee';
import { validateEmployeeBody, validateEmployeePatchBody, validateSearch } from '../validation';
import { sendError } from '../middleware/errorHandler';
import { ErrorCodes } from '../types/api';
import { ListResponse } from '../types/api';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toEmployeeJson(e: { _id: { toString(): string }; employeeId: string; fullName: string; email: string; department: string }) {
  return {
    _id: e._id.toString(),
    employeeId: e.employeeId,
    fullName: e.fullName,
    email: e.email,
    department: e.department,
  };
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const rawSearch = typeof req.query.search === 'string' ? req.query.search : '';
    const searchValidation = validateSearch(rawSearch);
    if (!searchValidation.valid) {
      return sendError(res, 400, searchValidation.message!, ErrorCodes.VALIDATION);
    }
    const search = rawSearch.trim();
    const baseFilter = search === ''
      ? {}
      : {
          $or: [
            { employeeId: new RegExp(escapeRegex(search), 'i') },
            { fullName: new RegExp(escapeRegex(search), 'i') },
          ],
        };
    const filter = { ...baseFilter, ...notDeletedFilter };
    const employees = await Employee.find(filter).lean();
    const list = employees.map((e) => toEmployeeJson(e as Parameters<typeof toEmployeeJson>[0]));
    const payload: ListResponse<ReturnType<typeof toEmployeeJson>> = { data: list, total: list.length };
    res.status(200).json(payload);
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to list employees.', ErrorCodes.INTERNAL);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ _id: id, ...notDeletedFilter }).lean();
    if (!employee) {
      return sendError(res, 404, 'No employee found with that _id.', ErrorCodes.EMPLOYEE_NOT_FOUND);
    }
    res.status(200).json(toEmployeeJson(employee as Parameters<typeof toEmployeeJson>[0]));
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to get employee.', ErrorCodes.INTERNAL);
  }
});

router.post('/', async (req: Request, res: Response) => {
  const validation = validateEmployeeBody(req.body);
  if (!validation.ok) {
    return sendError(res, 400, validation.message, validation.code, validation.errors);
  }
  const { employeeId, fullName, email, department } = validation.data;
  try {
    const existing = await Employee.findOne({ employeeId, ...notDeletedFilter });
    if (existing) {
      return sendError(res, 400, `An employee with employeeId "${employeeId}" already exists.`, ErrorCodes.EMPLOYEE_ID_EXISTS);
    }
    const employee = await Employee.create({ employeeId, fullName, email, department });
    res.status(201).json({
      _id: employee._id.toString(),
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      email: employee.email,
      department: employee.department,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
      return sendError(res, 400, `An employee with employeeId "${employeeId}" already exists.`, ErrorCodes.EMPLOYEE_ID_EXISTS);
    }
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to add employee.', ErrorCodes.INTERNAL);
  }
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  const validation = validateEmployeePatchBody(req.body);
  if (!validation.ok) {
    return sendError(res, 400, validation.message, validation.code, validation.errors);
  }
  const { id } = req.params;
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: id, ...notDeletedFilter },
      { $set: validation.data },
      { new: true }
    ).lean();
    if (!employee) {
      return sendError(res, 404, 'No employee found with that _id.', ErrorCodes.EMPLOYEE_NOT_FOUND);
    }
    res.status(200).json(toEmployeeJson(employee as Parameters<typeof toEmployeeJson>[0]));
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to update employee.', ErrorCodes.INTERNAL);
  }
});

router.delete('/:id', authMiddleware, requireRole('admin', 'hr'), async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Employee.findOneAndUpdate(
      { _id: id, ...notDeletedFilter },
      { $set: { deletedAt: new Date() } },
      { new: false }
    );
    if (!result) {
      return sendError(res, 404, 'No employee found with that _id.', ErrorCodes.EMPLOYEE_NOT_FOUND);
    }
    res.status(204).send();
  } catch (err) {
    sendError(res, 500, err instanceof Error ? err.message : 'Failed to delete employee.', ErrorCodes.INTERNAL);
  }
});

export default router;
