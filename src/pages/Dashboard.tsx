import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card } from '../components/ui/Card';
import {
  useGetDashboardStatsQuery,
  useGetEmployeesQuery,
  useGetAttendanceQuery,
} from '../store/api';

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function Dashboard() {
  const today = getTodayISO();

  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useGetDashboardStatsQuery();
  const { data: employees = [], isLoading: isEmployeesLoading } = useGetEmployeesQuery();
  const { data: attendance = [], isLoading: isAttendanceLoading } = useGetAttendanceQuery();

  const loading = isStatsLoading || isEmployeesLoading || isAttendanceLoading;

  const todayPresentCount = stats?.todayPresentCount ?? 0;
  const todayAbsentCount = useMemo(() => {
    return attendance.filter(
      (r) => r.date === today && r.status === 'Absent'
    ).length;
  }, [attendance, today]);

  const departmentData = useMemo((): Array<{ name: string; count: number }> => {
    const map = new Map<string, number>();
    employees.forEach((e) => {
      map.set(e.department, (map.get(e.department) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [employees]);

  const todayAttendancePie = useMemo(
    (): Array<{ name: string; value: number; color: string }> => [
      { name: 'Present', value: todayPresentCount, color: 'var(--color-success)' },
      { name: 'Absent', value: todayAbsentCount, color: 'var(--color-danger)' },
    ],
    [todayPresentCount, todayAbsentCount]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-(--color-text)">
          Dashboard
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="h-16 animate-pulse rounded bg-(--color-border)" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isStatsError || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-(--color-text)">Dashboard</h1>
        <div className="rounded-lg border border-(--color-danger)/30 bg-(--color-danger-muted) py-12 px-6 text-center text-(--color-danger)">
          Failed to load dashboard. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-(--color-text)">
        Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-(--color-muted)">
            Total Employees
          </p>
          <p className="mt-1 text-3xl font-semibold text-(--color-text)">
            {stats.totalEmployees}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-(--color-muted)">
            Total Attendance Records
          </p>
          <p className="mt-1 text-3xl font-semibold text-(--color-text)">
            {stats.totalAttendanceRecords}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-(--color-muted)">
            Today Present
          </p>
          <p className="mt-1 text-3xl font-semibold text-(--color-text)">
            {stats.todayPresentCount}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Employees by Department">
          <div className="h-64">
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                    stroke="var(--color-border)"
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                    stroke="var(--color-border)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-text)' }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-(--color-muted)">
                No department data
              </p>
            )}
          </div>
        </Card>

        <Card title="Today's Attendance">
          <div className="h-64">
            {todayAttendancePie.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={todayAttendancePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }: { name?: string; value?: number }) => `${name ?? ''}: ${value ?? 0}`}
                  >
                    {todayAttendancePie.map((_, index) => (
                      <Cell key={index} fill={todayAttendancePie[index].color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-(--color-muted)">
                No attendance recorded today
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
