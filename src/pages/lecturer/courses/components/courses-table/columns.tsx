import {Checkbox} from '@/components/ui/checkbox';
import {ColumnDef} from '@tanstack/react-table';
import {CellAction} from './cell-action';

export const columns = [
    {
        accessorKey: 'course_code',
        header: 'COURSE CODE',
    },
    {
        accessorKey: 'course_name',
        header: 'NAME',
    },
    {
        accessorKey: 'semester',
        header: 'SEMESTER',
    },
    {
        accessorKey: 'academic_year',
        header: 'ACADEMIC YEAR',
    },
    {
        accessorKey: 'isEnrollmentOpen',
        header: 'Enrollment',
        cell: ({row}: any) => {
            const isOpen = row.getValue('isEnrollmentOpen');
            return isOpen ? 'Open' : 'Closed';
        },
    },
    {
        id: 'actions',
        cell: ({row}: any) => <CellAction data={row.original} />,
    },
];
