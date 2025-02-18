import {Button} from '@/components/ui/button';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import React from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';

interface Identifiable {
    id?: string | number;
    _id?: string | number;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    path: (row: TData) => string;
    pageSizeOptions?: number[];
}

export default function DataTable<TData extends Identifiable, TValue>({
    columns,
    data,
    path,
    pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TData, TValue>) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    // Search params
    const page = searchParams?.get('page') ?? '1';
    const pageAsNumber = Number(page);
    const fallbackPage =
        isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    const per_page = searchParams?.get('limit') ?? '10';
    const perPageAsNumber = Number(per_page);
    const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

    // Handle server-side pagination
    const [{pageIndex, pageSize}, setPagination] = React.useState({
        pageIndex: fallbackPage - 1,
        pageSize: fallbackPerPage,
    });

    React.useEffect(() => {
        // Update the URL with the new page number and limit
        setSearchParams({
            ...Object.fromEntries(searchParams), // Spread the existing search params
            page: (pageIndex + 1).toString(), // Update the page number (assuming pageIndex is 0-based)
            limit: pageSize.toString(), // Update the limit
        });
        // if search is there setting filter value
    }, [pageIndex, pageSize, searchParams, setSearchParams]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination: {pageIndex, pageSize},
        },
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualFiltering: true,
    });

    return (
        <div className='space-y-4'>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.original._id || row.original.id} // Updated to handle both id types
                                onClick={() => navigate(path(row.original))}
                                data-state={row.getIsSelected() && 'selected'}
                                className='hover:cursor-pointer'
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='h-24 text-center'
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
