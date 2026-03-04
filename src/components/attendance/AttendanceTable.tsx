import { Card } from '../ui/Card';
import { EmptyState } from '../common/EmptyState';
import type { Attendance } from '../../types';

interface AttendanceTableProps {
  records: Attendance[];
  filterByEmployeeId?: string;
}

export function AttendanceTable({
  records,
  filterByEmployeeId,
}: AttendanceTableProps) {
  const filtered =
    filterByEmployeeId === undefined || filterByEmployeeId === ''
      ? records
      : records.filter((r) => r.employeeId === filterByEmployeeId);

  if (filtered.length === 0) {
    return (
      <Card title="Attendance Records">
        <EmptyState
          message={
            filterByEmployeeId
              ? 'No attendance records for this employee.'
              : 'No attendance records yet. Mark attendance above.'
          }
        />
      </Card>
    );
  }

  return (
    <Card title="Attendance Records">
      <div className="overflow-x-auto rounded-lg border border-(--color-border)">
        <table
          className="w-full border-collapse text-left text-sm"
          aria-label="Attendance records"
        >
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface)">
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">
                Employee ID
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">Date</th>
              <th scope="col" className="px-4 py-3 font-semibold text-(--color-text)">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec) => (
              <tr
                key={rec._id}
                className="border-b border-(--color-border)/50 transition-colors last:border-0 hover:bg-(--color-surface)"
              >
                <td className="px-4 py-3 text-(--color-muted)">{rec.employeeId}</td>
                <td className="px-4 py-3 text-(--color-text)">{rec.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      rec.status === 'Present'
                        ? 'bg-(--color-success-muted) text-(--color-success)'
                        : 'bg-(--color-danger-muted) text-(--color-danger)'
                    }`}
                  >
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
