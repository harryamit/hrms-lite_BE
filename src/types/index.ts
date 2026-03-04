export interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
}

export interface EmployeeFormData {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
}

export interface Attendance {
  _id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface AttendanceFormData {
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface DashboardStats {
  totalEmployees: number;
  totalAttendanceRecords: number;
  todayPresentCount: number;
}

/** API error body (backend can extend with code, errors for field-level). */
export interface ApiErrorBody {
  message: string;
  code?: string;
  errors?: Record<string, string>;
}
