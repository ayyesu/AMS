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
        async (
            courseId: string,
            sessionId: string,
            imageBlob: Blob,
            locationCoordinates: any = null,
        ): Promise<{success: boolean; message: string}> => {
            if (!sessionId || !imageBlob) {
                throw new Error('Missing required parameters');
            }
            setLoading(true);
            setError(null);
            try {
                console.log(
                    'Starting attendance marking with face recognition',
                );
                const formData = new FormData();
                formData.append(
                    'capturedImage',
                    imageBlob,
                    'captured_image.jpg',
                );

                if (locationCoordinates) {
                    formData.append(
                        'latitude',
                        locationCoordinates.latitude.toString(),
                    );
                    formData.append(
                        'longitude',
                        locationCoordinates.longitude.toString(),
                    );
                    formData.append(
                        'accuracy',
                        locationCoordinates.accuracy.toString(),
                    );
                }

                // Add timeout to ensure the request doesn't hang indefinitely
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

                try {
                    // Modified to not pass the signal in this way since the API doesn't support it
                    const response = await attendanceApi.markAttendance(
                        courseId,
                        sessionId,
                        formData,
                    );

                    clearTimeout(timeoutId);

                    // Refresh attendance list after marking
                    await fetchAttendanceBySession(sessionId);

                    return {
                        success: response?.success ?? true,
                        message:
                            response?.message ||
                            'Attendance marked successfully',
                    };
                } catch (err) {
                    clearTimeout(timeoutId);

                    // Handle timeout specifically - type check for error
                    if (err instanceof Error && err.name === 'AbortError') {
                        throw new Error(
                            'Request timed out. The server took too long to respond.',
                        );
                    }

                    throw err;
                }
            } catch (err) {
                console.error('Error marking attendance:', err);

                // Handle different error types for better user feedback
                let errorMessage = 'Failed to mark attendance';

                if (err instanceof AxiosError) {
                    if (err.response) {
                        // The server responded with a status code outside the 2xx range
                        errorMessage =
                            err.response?.data?.message ||
                            `Server error: ${err.response.status} - ${err.message}`;
                    } else if (err.request) {
                        // The request was made but no response was received
                        errorMessage =
                            'No response from server. Please check your network connection.';
                    } else {
                        // Something happened in setting up the request
                        errorMessage = `Request configuration error: ${err.message}`;
                    }
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }

                setError(errorMessage);
                throw new Error(errorMessage);
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
