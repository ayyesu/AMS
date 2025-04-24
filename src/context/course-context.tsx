import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback, // Import useCallback
    useMemo, // Import useMemo
} from 'react';
import {courseApi} from '@/lib/api'; // Assuming you have a courseApi

interface Course {
    _id: string;
    course_code: string;
    course_name: string;
    lecturer: string;
    semester: '1' | '2' | '3';
    sessions: string[];
    academic_year: string;
    created_at: Date;
}

interface CourseContextType {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    fetchCourses: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
    children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({children}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize the fetchCourses function
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseApi.getAll();
            setCourses(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to fetch courses';
            setError(message);
            setCourses([]); // Clear courses on error
            console.error('Fetch Courses Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoize the context value object
    const value = useMemo(
        () => ({
            courses,
            setCourses,
            loading,
            setLoading,
            error,
            setError,
            fetchCourses,
        }),
        [
            courses,
            loading,
            error,
            fetchCourses,
            setCourses,
            setLoading,
            setError,
        ],
    );

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error(
            'useCourseContext must be used within a CourseProvider',
        );
    }
    return context;
};
