import { useState } from 'react';
import { AttendanceForm } from '../components/attendance/AttendanceForm';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { Select } from '../components/ui/Select';
import { ErrorState } from '../components/common/ErrorState';
import {
  useGetEmployeesQuery,
  useGetAttendanceQuery,
  useCreateAttendanceMutation,
} from '../store/api';
import { getErrorMessage } from '../utils/error';
import type { AttendanceFormData } from '../types';

export function Attendance() {
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>('');

  const { data: employees = [], isError: isEmployeesError, error: employeesError, refetch: refetchEmployees } = useGetEmployeesQuery();
  const { data: attendance = [], isLoading: isAttendanceLoading, isError: isAttendanceError, error: attendanceError, refetch: refetchAttendance } = useGetAttendanceQuery(
    filterEmployeeId.trim() || undefined
  );
  const [createAttendance, { isLoading: isCreating, isError: isCreateError, error: createError, reset: resetCreate }] = useCreateAttendanceMutation();

  const loading = isCreating;

  const employeeOptions = [
    { value: '', label: 'All employees' },
    ...employees.map((e) => ({
      value: e.employeeId,
      label: `${e.employeeId} - ${e.fullName}`,
    })),
  ];

  const handleMarkAttendance = async (data: AttendanceFormData) => {
    resetCreate();
    await createAttendance(data).unwrap();
  };

  const isError = isEmployeesError || isAttendanceError;
  const error = isEmployeesError ? employeesError : attendanceError;

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-(--color-text)">Attendance</h1>
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => {
            refetchEmployees();
            refetchAttendance();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-(--color-text)">Attendance</h1>
      {isCreateError && createError && (
        <div className="rounded-lg border border-(--color-danger)/30 bg-(--color-danger-muted) px-4 py-3 text-sm text-(--color-danger)">
          {getErrorMessage(createError)}
        </div>
      )}
      <AttendanceForm onSubmit={handleMarkAttendance} loading={loading} />
      <div className="rounded-lg bg-(--color-surface-elevated) p-6 shadow-md">
        <Select
          label="Filter by employee"
          options={employeeOptions}
          value={filterEmployeeId}
          onChange={(e) => setFilterEmployeeId(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {isAttendanceLoading ? (
        <div className="rounded-lg bg-(--color-surface-elevated) p-6 shadow-md">
          <div className="h-32 animate-pulse rounded bg-(--color-border)" />
        </div>
      ) : (
        <AttendanceTable
          records={attendance}
          filterByEmployeeId={filterEmployeeId.trim() || undefined}
        />
      )}
    </div>
  );
}
