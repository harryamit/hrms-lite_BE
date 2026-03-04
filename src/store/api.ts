import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Employee,
  EmployeeFormData,
  Attendance,
  AttendanceFormData,
  DashboardStats,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export const hrmsApi = createApi({
  reducerPath: 'hrmsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Employees', 'Attendance', 'DashboardStats'],
  endpoints: (builder) => ({
    // Employees (optional search: GET /api/employees?search=...)
    getEmployees: builder.query<Employee[], string | void>({
      query: (search) => ({
        url: '/employees',
        params: search && search.trim() ? { search: search.trim() } : undefined,
      }),
      transformResponse: (
        response: Employee[] | { data: Employee[]; total?: number },
      ): Employee[] => (Array.isArray(response) ? response : response.data ?? []),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Employees' as const, id: _id })),
              { type: 'Employees', id: 'LIST' },
            ]
          : [{ type: 'Employees', id: 'LIST' }],
    }),
    createEmployee: builder.mutation<Employee, EmployeeFormData>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Employees', id: 'LIST' }, 'DashboardStats'],
    }),
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Employees', id },
        { type: 'Employees', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    // Attendance
    getAttendance: builder.query<Attendance[], string | void>({
      query: (employeeId) => {
        const params =
          employeeId && employeeId.trim() !== ''
            ? { employeeId: employeeId.trim() }
            : undefined;
        return { url: '/attendance', params };
      },
      transformResponse: (
        response: Attendance[] | { data: Attendance[]; total?: number },
      ): Attendance[] => (Array.isArray(response) ? response : response.data ?? []),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Attendance' as const, id: _id })),
              { type: 'Attendance', id: 'LIST' },
            ]
          : [{ type: 'Attendance', id: 'LIST' }],
    }),
    createAttendance: builder.mutation<Attendance, AttendanceFormData>({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Attendance', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    // Dashboard
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['DashboardStats'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAttendanceQuery,
  useCreateAttendanceMutation,
  useGetDashboardStatsQuery,
} = hrmsApi;
