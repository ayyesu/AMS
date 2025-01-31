import NotFound from '@/pages/not-found';
import {Suspense, lazy} from 'react';
import {Navigate, Outlet, useRoutes} from 'react-router-dom';

const DashboardLayout = lazy(
    () => import('@/components/layout/dashboard-layout'),
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const CoursePage = lazy(() => import('@/pages/courses'));
const CourseDetailPage = lazy(() => import('@/pages/courses/SessionMgtPage'));
const AttendanceManagementPage = lazy(() => import('@/pages/attendance'));

// Student Pages
const StudentDashboard = lazy(() => import('@/pages/student/dashboard'));
const StudentProfile = lazy(() => import('@/pages/student/profile'));
const StudentCourses = lazy(() => import('@/pages/student/courses'));
const StudentAttendance = lazy(() => import('@/pages/student/attendance'));

// ----------------------------------------------------------------------

export default function AppRouter() {
    const dashboardRoutes = [
        {
            path: '/app',
            element: (
                <DashboardLayout>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                {
                    element: <DashboardPage />,
                    index: true,
                },
                {
                    path: 'courses',
                    element: <CoursePage />,
                },
                {
                    path: 'courses/:id',
                    element: <CourseDetailPage />,
                },
                {
                    path: 'attendance',
                    element: <AttendanceManagementPage />,
                },
            ],
        },
    ];

    const studentRoutes = [
        {
            path: '/student',
            element: (
                <DashboardLayout>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                {
                    element: <StudentDashboard />,
                    index: true,
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

    const publicRoutes = [
        {
            path: '/',
            element: <SignInPage />,
        },
    ];

    const routes = [...publicRoutes, ...dashboardRoutes, ...studentRoutes];

    return useRoutes([
        ...routes,
        {path: '*', element: <NotFound />},
    ]);
}
