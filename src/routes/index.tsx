import NotFound from '@/pages/not-found';
import {Suspense, lazy} from 'react';
import {Navigate, Outlet, useRoutes} from 'react-router-dom';
import {ErrorBoundary} from '@/components/error-boundary';
import AuthGuard from '@/components/auth/auth-guard';
import LecturerProfile from '@/pages/lecturer/profile';
import CourseSessionPage from '@/pages/lecturer/courses/SessionMgtPage';

const DashboardLayout = lazy(
    () => import('@/components/layout/dashboard-layout'),
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/lecturer/dashboard'));
const CoursePage = lazy(() => import('@/pages/lecturer/courses'));
const CourseDetailPage = lazy(
    () => import('@/pages/lecturer/courses/SessionMgtPage'),
);
const AttendanceManagementPage = lazy(() => import('@/pages/attendance'));

// ----------------------------------------------------------------------

export default function AppRouter() {
    const dashboardRoutes = [
        {
            path: '/app',
            element: (
                <AuthGuard allowedRoles={['admin', 'lecturer']}>
                    <ErrorBoundary>
                        <DashboardLayout>
                            <Suspense>
                                <Outlet />
                            </Suspense>
                        </DashboardLayout>
                    </ErrorBoundary>
                </AuthGuard>
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
                    path: 'courses/:courseId/sessions',
                    element: <CourseSessionPage />,
                },
                {
                    path: 'attendance',
                    element: <AttendanceManagementPage />,
                },
                {
                    path: 'profile/:id',
                    element: <LecturerProfile />,
                },
            ],
        },
    ];

    const publicRoutes = [
        {
            path: '/',
            element: <Navigate to='/app' />,
        },
        {
            path: 'login',
            element: <SignInPage />,
        },
    ];

    const routes = [...publicRoutes, ...dashboardRoutes];

    return useRoutes([...routes, {path: '*', element: <NotFound />}]);
}
