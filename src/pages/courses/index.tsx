import PageHead from '@/components/shared/page-head';
import CoursesTable from './components/courses-table';
import {useSearchParams} from 'react-router-dom';
import {Breadcrumbs} from '@/components/shared/breadcrumbs';
import {courses} from '@/constants/data';

export default function CoursesPage() {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page') || 1);
    const pageLimit = Number(searchParams.get('limit') || 10);

    return (
        <div className='p-4 md:p-8'>
            <PageHead title='Courses | App' />
            <Breadcrumbs
                items={[
                    {title: 'Dashboard', link: '/app'},
                    {title: 'Courses', link: '/app/courses'},
                ]}
            />
            <CoursesTable
                courses={courses}
                page={page}
                totalUsers={courses.length}
            />
        </div>
    );
}
