import PageHead from '@/components/shared/page-head';
import CoursesTable from './components/courses-table';
import {useSearchParams} from 'react-router-dom';
import {Breadcrumbs} from '@/components/shared/breadcrumbs';
import {useCourseContext} from '@/context/course-context';
import {useEffect} from 'react';
import {courseApi} from '@/lib/api';

export default function CoursesPage() {
    const [searchParams] = useSearchParams();
    const {courses, setCourses, loading, setLoading, setError} =
        useCourseContext();
    const page = Number(searchParams.get('page') || 1);
    const pageLimit = Number(searchParams.get('limit') || 10);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await courseApi.getAll();
                setCourses(response.data);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch courses';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [setCourses, setLoading, setError]);

    return (
        <div className='h-full flex-1 space-y-4 overflow-y-auto p-4 md:p-8'>
            <PageHead title='Courses | App' />
            <Breadcrumbs
                items={[
                    {title: 'Dashboard', link: '/app'},
                    {title: 'Courses', link: '/app/courses'},
                ]}
            />
            {loading ? (
                <div>Loading courses...</div>
            ) : (
                <CoursesTable
                    courses={courses}
                    page={page}
                    totalUsers={courses.length}
                />
            )}
        </div>
    );
}
