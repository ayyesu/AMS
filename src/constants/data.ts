import {NavItem} from '@/types';

export const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/app',
        icon: 'dashboard',
        label: 'Dashboard',
    },
    {
        title: 'Course',
        href: '/app/courses',
        icon: 'user',
        label: 'course',
    },
    {
        title: 'Attendance Management',
        href: '/app/attendance',
        icon: 'user',
        label: 'attendance',
    },
    {
        title: 'Logout',
        href: '/',
        icon: 'login',
        label: 'Login',
    },
];

export const courses = [
    {
        id: 1,
        course_code: 'DCIT308',
        path: '/course-detail/DCIT308',
        name: 'Data Structures and Algorithm II',
        semester: '2',
        academic_year: '2023/2024',
        status: 'Active',
    },
    {
        id: 2,
        course_code: 'DCIT309',
        path: '/course-detail/DCIT309',
        name: 'Database Programming',
        semester: '1',
        academic_year: '2023/2024',
        status: 'Active',
    },
    {
        id: 3,
        course_code: 'DCIT202',
        path: '/course-detail/DCIT202',
        name: 'Mobile Application Development',
        semester: '2',
        academic_year: '2023/2024',
        status: 'Active',
    },
    {
        id: 4,
        course_code: 'DCIT201',
        path: '/course-detail/DCIT201',
        name: 'Operating Systems',
        semester: '1',
        academic_year: '2022/2023',
        status: 'Inactive',
    },
    {
        id: 5,
        course_code: 'DCIT203',
        path: '/course-detail/DCIT203',
        name: 'Computer Networks',
        semester: '2',
        academic_year: '2022/2023',
        status: 'Active',
    },
];
