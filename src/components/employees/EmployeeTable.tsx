import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmptyState } from '../common/EmptyState';
import type { Employee } from '../../types';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
  deletingId?: string | null;
}

export function EmployeeTable({ employees, onDelete, deletingId = null }: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <Card title="Employees">
        <EmptyState message="No employees yet. Add one above." />
      </Card>
    );
  }

  return (
    <Card title="Employees">
      <div className="overflow-x-auto rounded-lg border border-(--color-border)">
        <table
          className="w-full border-collapse text-left text-sm"
          aria-label="Employees list"
        >
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">
                Employee ID
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">
                Full Name
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">Email</th>
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">
                Department
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const isDeleting = deletingId === emp._id;
              return (
                <tr
                  key={emp._id}
                  className="border-b border-(--color-border)/50 transition-colors last:border-0 hover:bg-(--color-surface)"
                >
                  <td className="px-4 py-3 text-(--color-muted)">{emp.employeeId}</td>
                  <td className="px-4 py-3 text-(--color-text)">{emp.fullName}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{emp.email}</td>
                  <td className="px-4 py-3 text-(--color-muted)">{emp.department}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => onDelete(emp)}
                      disabled={isDeleting}
                      loading={isDeleting}
                    >
                      {isDeleting ? '' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
