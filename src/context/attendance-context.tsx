import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from 'react';
import {attendanceApi, faceRecognitionApi} from '@/lib/api';
import {useAuth} from './auth-context';
import {AxiosError} from 'axios';
import {
    AttendanceContextType,
    AttendanceProviderProps,
    AttendanceRecord,
    SessionAttendanceResponse,
} from '@/types/attendance';

const AttendanceContext = createContext<AttendanceContextType | undefined>(
    undefined,
);

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
        if (!sessionId) {
            setAttendanceRecords([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response: SessionAttendanceResponse =
                await attendanceApi.getSessionAttendance(sessionId);

            console.log('Fetched Attendance Response:', response);

            // Extract the attendance_details array
            const records = response?.data?.attendance_details ?? [];

            if (!Array.isArray(records)) {
                console.error(
                    "API response's data.attendance_details is not an array:",
                    records,
                );
                throw new Error(
                    'Invalid attendance data format received from server.',
                );
            }

            setAttendanceRecords(records);
        } catch (err) {
            // Keep the 404 handling as before
            if (err instanceof AxiosError && err.response?.status === 404) {
                setAttendanceRecords([]);
                console.log(
                    `No attendance records found for session ${sessionId} (404).`,
                );
            } else {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch attendance';
                setError(message);
                setAttendanceRecords([]);
                console.error('Fetch Attendance Error:', err);
            }
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
            setLoading,
            error,
            setError,
            fetchAttendanceBySession,
            markAttendanceWithFace,
        }),
        [
            attendanceRecords,
            loading,
            error,
            fetchAttendanceBySession,
            markAttendanceWithFace,
            setAttendanceRecords,
            setLoading,
            setError,
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
