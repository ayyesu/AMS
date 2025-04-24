import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';
import {attendanceApi, faceRecognitionApi} from '@/lib/api';
import {useAuth} from './auth-context';

interface AttendanceRecord {
    _id: string;
    student: {
        _id: string;
        fullName: string;
        userIdentifier: string;
    };
    session: string;
    check_in_time?: Date;
    status: 'present' | 'absent' | 'late';
    location_status?: 'within_range' | 'outside_range' | 'not_verified';
    verification_method?: 'manual' | 'face_recognition' | 'location';
    created_at: Date;
}

interface AttendanceContextType {
    attendanceRecords: AttendanceRecord[];
    setAttendanceRecords: React.Dispatch<
        React.SetStateAction<AttendanceRecord[]>
    >;
    loading: boolean;
    error: string | null;
    fetchAttendanceBySession: (sessionId: string) => Promise<void>;
    markAttendanceWithFace: (
        sessionId: string,
        imageData: Blob,
    ) => Promise<void>;
}

// Create the context
const AttendanceContext = createContext<AttendanceContextType | undefined>(
    undefined,
);

// Define props for the provider
interface AttendanceProviderProps {
    children: ReactNode;
}

// Create the provider component
export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({
    children,
}) => {
    const [attendanceRecords, setAttendanceRecords] = useState<
        AttendanceRecord[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();

    // Fetch attendance records for a specific session
    const fetchAttendanceBySession = useCallback(async (sessionId: string) => {
        if (!sessionId) return;
        setLoading(true);
        setError(null);
        try {
            const response =
                await attendanceApi.getSessionAttendance(sessionId);
            setAttendanceRecords(
                Array.isArray(response.data) ? response.data : [],
            );
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch attendance';
            setError(message);
            setAttendanceRecords([]);
            console.error('Fetch Attendance Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Mark attendance using facial recognition
    const markAttendanceWithFace = useCallback(
        async (sessionId: string, imageBlob: Blob) => {
            if (!sessionId || !imageBlob) return;
            setLoading(true);
            setError(null);
            try {
                const formData = new FormData();
                formData.append('image', imageBlob, 'attendance_face.jpg');

                // verifyFace returns student details upon successful verification
                const verificationResponse =
                    await faceRecognitionApi.verifyFace(formData);

                if (
                    !verificationResponse ||
                    !verificationResponse.data?.studentId
                ) {
                    throw new Error(
                        'Face verification failed or student not found.',
                    );
                }

                const studentId = verificationResponse.data.studentId;

                // 2. Mark attendance for the verified student
                const markData = {
                    studentId: studentId,
                    verificationMethod: 'face_recognition',
                    // Add other relevant data if your API expects it
                };
                await attendanceApi.markAttendance(sessionId, markData);

                // 3. Refresh attendance list after marking
                await fetchAttendanceBySession(sessionId);
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Failed to mark attendance via face recognition';
                setError(message);
                console.error('Mark Attendance Error:', err);
                throw new Error(message);
            } finally {
                setLoading(false);
            }
        },
        [fetchAttendanceBySession],
    );

    // Memoize the context value object
    const value = useMemo(
        () => ({
            attendanceRecords,
            setAttendanceRecords,
            loading,
            error,
            fetchAttendanceBySession,
            markAttendanceWithFace,
        }),
        [
            attendanceRecords,
            loading,
            error,
            fetchAttendanceBySession,
            markAttendanceWithFace,
        ],
    );

    return (
        <AttendanceContext.Provider value={value}>
            {children}
        </AttendanceContext.Provider>
    );
};

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (context === undefined) {
        throw new Error(
            'useAttendance must be used within an AttendanceProvider',
        );
    }
    return context;
};
