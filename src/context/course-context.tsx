import React, {createContext, useContext, useState, ReactNode} from 'react';

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
    selectedCourse: Course | null;
    setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
    children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({children}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const value = {
        courses,
        setCourses,
        selectedCourse,
        setSelectedCourse,
        loading,
        setLoading,
        error,
        setError,
    };

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
