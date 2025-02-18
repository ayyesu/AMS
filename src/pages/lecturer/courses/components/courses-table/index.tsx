import DataTable from '@/components/shared/data-table';
import {columns} from './columns';
import CourseTableActions from './course-table-action';
import {useCourseContext} from '@/context/course-context';

type TCoursesTableProps = {
    courses: Array<{
        _id: string;
        course_name: string;
        course_code: string;
        // ...other course properties
    }>;
    page: number;
    totalUsers: number;
};

export default function CoursesTable({courses}: TCoursesTableProps) {
    console.log(courses);
    return (
        <>
            <CourseTableActions />
            {courses && (
                <DataTable
                    columns={columns}
                    path={(row) => `/app/courses/${row._id}/sessions`}
                    data={courses}
                />
            )}
        </>
    );
}
