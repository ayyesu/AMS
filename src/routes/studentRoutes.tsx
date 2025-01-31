import { RouteObject } from 'react-router-dom';
import StudentDashboard from '../pages/student/dashboard';
import StudentProfile from '../pages/student/profile';
import StudentCourses from '../pages/student/courses';
import StudentAttendance from '../pages/student/attendance';

export const studentRoutes: RouteObject[] = [
  {
    path: '/student',
    children: [
      {
        path: 'dashboard',
        element: <StudentDashboard />,
      },
      {
        path: 'profile',
        element: <StudentProfile />,
      },
      {
        path: 'courses',
        element: <StudentCourses />,
      },
      {
        path: 'attendance',
        element: <StudentAttendance />,
      },
    ],
  },
];

export default studentRoutes;
