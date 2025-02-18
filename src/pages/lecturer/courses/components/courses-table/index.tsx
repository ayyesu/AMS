import DataTable from '@/components/shared/data-table';
import {columns} from './columns';
import CourseTableActions from './course-table-action';

type TCoursesTableProps = {
    courses: any;
    page: number;
    totalUsers: number;
};

export default function CoursesTable({courses}: TCoursesTableProps) {
    return (
        <>
            <CourseTableActions />
            {courses && (
                <DataTable
                    columns={columns}
                    path='/app/courses'
                    data={courses}
                />
            )}
        </>
    );
}
