import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/app',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Course',
    href: '/app/courses',
    icon: 'user',
    label: 'course'
  },
  {
    title: 'Logout',
    href: '/',
    icon: 'login',
    label: 'Login'
  }
];

export const courses = [
  {
    id: 1,
    course_code: 'DCIT308',
    path: '/course-detail/DCIT308',
    name: 'Data Structures and Algorithm II',
    semester: '2',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 2,
    course_code: 'DCIT309',
    path: '/course-detail/DCIT309',
    name: 'Database Programming',
    semester: '1',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 3,
    course_code: 'DCIT202',
    path: '/course-detail/DCIT202',
    name: 'Mobile Application Development',
    semester: '2',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 4,
    course_code: 'DCIT201',
    path: '/course-detail/DCIT201',
    name: 'Operating Systems',
    semester: '1',
    academic_year: '2022/2023',
    status: 'Inactive'
  },
  {
    id: 5,
    course_code: 'DCIT203',
    path: '/course-detail/DCIT203',
    name: 'Computer Networks',
    semester: '2',
    academic_year: '2022/2023',
    status: 'Active'
  },
  {
    id: 6,
    course_code: 'DCIT204',
    path: '/course-detail/DCIT204',
    name: 'Machine Learning',
    semester: '1',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 7,
    course_code: 'DCIT205',
    path: '/course-detail/DCIT205',
    name: 'Network Security',
    semester: '1',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 8,
    course_code: 'DCIT208',
    path: '/course-detail/DCIT208',
    name: 'Software Engineering',
    semester: '2',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 9,
    course_code: 'DCIT207',
    path: '/course-detail/DCIT207',
    name: 'Web Development',
    semester: '1',
    academic_year: '2023/2024',
    status: 'Active'
  },
  {
    id: 10,
    course_code: 'DCIT206',
    path: '/course-detail/DCIT206',
    name: 'Data Science',
    semester: '1',
    academic_year: '2022/2023',
    status: 'Inactive'
  }
];


export const dashboardCard = [
  {
    date: 'Today',
    total: 2000,
    role: 'Students',
    color: 'bg-[#EC4D61] bg-opacity-40'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Teachers',
    color: 'bg-[#FFEB95] bg-opacity-100'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Parents',
    color: 'bg-[#84BD47] bg-opacity-30'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Schools',
    color: 'bg-[#D289FF] bg-opacity-30'
  }
];

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};
