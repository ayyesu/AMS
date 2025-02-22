import React, {createContext, useContext, useState, ReactNode} from 'react';
import {courseApi} from '@/lib/api';

interface Course {
    _id: string;
    course_name: string;
    course_code: string;
    lecturer: string;
    semester: '1' | '2' | '3';
    sessions: string[];
    academic_year: string;
    created_at: Date;
}

interface CourseContextType {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    filteredCourses: Course[];
    setFilteredCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    selectedCourse: Course | null;
    setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    fetchCourses: () => Promise<void>;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({children}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseApi.getAll();
            setCourses(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch courses';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        courses,
        setCourses,
        selectedCourse,
        filteredCourses,
        setFilteredCourses,
        setSelectedCourse,
        loading,
        setLoading,
        error,
        setError,
        fetchCourses,
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
    children: ReactNode;
}

export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error(
            'useCourseContext must be used within a CourseProvider',
        );
    }
    return context;
};
