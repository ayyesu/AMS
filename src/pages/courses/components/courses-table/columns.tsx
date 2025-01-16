import {Checkbox} from '@/components/ui/checkbox';
import {ColumnDef} from '@tanstack/react-table';
import {CellAction} from './cell-action';

export const columns = [
    {
        accessorKey: 'course_code',
        header: 'COURSE CODE',
    },
    {
        accessorKey: 'name',
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
        accessorKey: 'status',
        header: 'STATUS',
    },
    {
        id: 'actions',
        cell: ({row}: any) => <CellAction data={row.original} />,
    },
];
