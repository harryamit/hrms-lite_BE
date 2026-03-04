import { useState } from 'react';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { ErrorState } from '../components/common/ErrorState';
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
} from '../store/api';
import { getErrorMessage } from '../utils/error';
import type { EmployeeFormData } from '../types';
import type { Employee } from '../types';

export function Employees() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: employees = [], isLoading, isError, error, refetch } = useGetEmployeesQuery();
  const [createEmployee, { isLoading: isCreating, isError: isCreateError, error: createError, reset: resetCreate }] = useCreateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const loading = isCreating || isDeleting;

  const handleAdd = async (data: EmployeeFormData) => {
    setDeleteError(null);
    resetCreate();
    await createEmployee(data).unwrap();
  };

  const handleDelete = async (emp: Employee) => {
    const confirmed = window.confirm(
      `Delete ${emp.fullName} (${emp.employeeId})? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeleteError(null);
    setDeletingId(emp._id);
    try {
      await deleteEmployee(emp._id).unwrap();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-(--color-text)">Employees</h1>
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-(--color-text)">Employees</h1>
      {isCreateError && createError && (
        <div className="rounded-lg border border-(--color-danger)/30 bg-(--color-danger-muted) px-4 py-3 text-sm text-(--color-danger)">
          {getErrorMessage(createError)}
        </div>
      )}
      {deleteError && (
        <div className="rounded-lg border border-(--color-danger)/30 bg-(--color-danger-muted) px-4 py-3 text-sm text-(--color-danger)">
          {deleteError}
        </div>
      )}
      <EmployeeForm onSubmit={handleAdd} loading={loading} />
      {isLoading ? (
        <div className="rounded-lg bg-(--color-surface-elevated) p-6 shadow-md">
          <div className="h-32 animate-pulse rounded bg-(--color-border)" />
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}
