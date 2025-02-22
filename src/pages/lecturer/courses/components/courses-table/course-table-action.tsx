import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import CourseCreateForm from '../course-forms/course-create-form';
import {useCourseContext} from '@/context/course-context';
import {useState, useEffect} from 'react';

export default function CourseTableActions() {
    const {courses, setCourses, fetchCourses} = useCourseContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [originalCourses, setOriginalCourses] = useState(courses);

    useEffect(() => {
        setOriginalCourses(courses);
    }, [courses]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query.trim()) {
            await fetchCourses(); // Fetch fresh data when search is empty
            return;
        }

        const filteredCourses = originalCourses.filter((course) => {
            const searchStr = query.toLowerCase();
            return (
                course.course_code.toLowerCase().includes(searchStr) ||
                course.course_name.toLowerCase().includes(searchStr) ||
                course.academic_year.toLowerCase().includes(searchStr)
            );
        });

        setCourses(filteredCourses);
    };

    const handleClear = async () => {
        setSearchQuery('');
        await fetchCourses(); // Fetch fresh data when cleared
    };

    return (
        <div className='flex items-center justify-between gap-2 py-5'>
            <div className='flex flex-1 gap-4'>
                <TableSearchInput
                    placeholder='Search Course Here'
                    value={searchQuery}
                    onChange={handleSearch}
                    onClear={handleClear}
                />
            </div>
            <div className='flex gap-3'>
                <PopupModal
                    renderModal={(onClose) => (
                        <CourseCreateForm modalClose={onClose} />
                    )}
                />
            </div>
        </div>
    );
}
