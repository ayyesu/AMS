import DataTable from '@/components/shared/data-table';
import { columns } from './columns';
import CourseTableActions from './course-table-action';

type TStudentsTableProps = {
  users: any;
  page: number;
  totalUsers: number;
  pageCount: number;
};

export default function StudentsTable({
  users,
  pageCount
}: TStudentsTableProps) {
  return (
    <>
      <CourseTableActions />
      {users && (
        <DataTable columns={columns} data={users} pageCount={pageCount} />
      )}
    </>
  );
}
