import PageHead from '@/components/shared/page-head';
import { useGetCourses } from './queries/queries';
import CoursesTable from './components/courses-table';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function StudentPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;
  const { data, isLoading } = useGetCourses(offset, pageLimit, search);
  const courses = data?.courses;
  const totalCourses = data?.total_courses; //1000
  const pageCount = Math.ceil(totalCourses / pageLimit);

  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <PageHead title="Courses | App" />
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/app' },
          { title: 'Courses', link: '/app/courses' }
        ]}
      />
      <CoursesTable
        users={courses}
        page={page}
        totalUsers={totalCourses}
        pageCount={pageCount}
      />
    </div>
  );
}
