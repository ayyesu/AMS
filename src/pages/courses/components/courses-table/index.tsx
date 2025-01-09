import DataTable from '@/components/shared/data-table';
import {columns} from './columns';
import CourseTableActions from './course-table-action';
import {courses} from '@/constants/data';

type TCoursesTableProps = {
    courses: any;
    page: number;
    totalUsers: number;
    pageCount: number;
};

export default function CoursesTable({courses, pageCount}: TCoursesTableProps) {
    return (
        <>
            <CourseTableActions />
            {courses && (
                <DataTable
                    columns={columns}
                    path='/app/courses'
                    data={courses}
                    pageCount={pageCount}
                />
            )}
        </>
    );
}
