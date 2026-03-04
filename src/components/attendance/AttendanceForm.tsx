import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { EmployeeSelect } from './EmployeeSelect';
import type { AttendanceFormData } from '../../types';

const STATUS_OPTIONS: { value: 'Present' | 'Absent'; label: string }[] = [
  { value: 'Present', label: 'Present' },
  { value: 'Absent', label: 'Absent' },
];

interface AttendanceFormProps {
  onSubmit: (data: AttendanceFormData) => void | Promise<void>;
  loading?: boolean;
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AttendanceForm({
  onSubmit,
  loading = false,
}: AttendanceFormProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [status, setStatus] = useState<'Present' | 'Absent'>('Present');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    try {
      await onSubmit({ employeeId, date, status });
      setEmployeeId('');
      setDate(getTodayISO());
      setStatus('Present');
    } catch {
      // Caller handles error
    }
  };

  return (
    <Card title="Mark Attendance">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <EmployeeSelect
          label="Employee"
          value={employeeId}
          onChange={setEmployeeId}
          required
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'Present' | 'Absent')
          }
        />
        <Button type="submit" loading={loading} disabled={loading || !employeeId}>
          Mark Attendance
        </Button>
      </form>
    </Card>
  );
}
