import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { EmployeeFormData } from '../../types';

const DEPARTMENT_OPTIONS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' },
];

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void | Promise<void>;
  loading?: boolean;
}

const initialForm: EmployeeFormData = {
  employeeId: '',
  fullName: '',
  email: '',
  department: 'Engineering',
};

export function EmployeeForm({ onSubmit, loading = false }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormData>(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch {
      // Caller handles error; form keeps values for retry
    }
  };

  return (
    <Card title="Add Employee">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Employee ID"
          value={form.employeeId}
          onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
          placeholder="e.g. EMP001"
          required
        />
        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
          placeholder="Full name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="email@example.com"
          required
        />
        <Select
          label="Department"
          options={DEPARTMENT_OPTIONS}
          value={form.department}
          onChange={(e) =>
            setForm((p) => ({ ...p, department: e.target.value }))
          }
        />
        <Button type="submit" loading={loading} disabled={loading}>
          Add Employee
        </Button>
      </form>
    </Card>
  );
}
