import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://ams-backend-xhqd.onrender.com'
        : 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API endpoints
export const authApi = {
    login: async (userIdentifier: string, pin: string) => {
        const response = await api.post('/login', {userIdentifier, pin});
        return response;
    },
    signup: async (userData: any) => {
        const response = await api.post('/signup', userData);
        return response;
    },
    authCheck: async () => {
        try {
            const response = await api.get('/auth-check');
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }
            return response?.data;
        } catch (error) {
            return null;
        }
    },
    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    },
};

export const imageApi = {
    getImage: async (id: string) => {
        const response = await api.get(`/images/${id}`);
        return response.data;
    },
    uploadImage: async (
        formData: FormData,
        id: string,
        onProgress?: (progress: number) => void,
    ) => {
        try {
            const response = await api.post(`/images/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        onProgress(percentCompleted);
                    }
                },
            });

            if (!response.data) {
                throw new Error('No response from server');
            }

            return response.data;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },
};

// Course API endpoints
export const courseApi = {
    getAll: async () => {
        const response = await api.get('/courses');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },
    create: async (courseData: {
        course_name: string;
        course_code: string;
        semester: string;
        academic_year: string;
        status: string;
    }) => {
        const response = await api.post('/courses/add', courseData);
        return response.data;
    },
    update: async (id: string, courseData: any) => {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },
};

// Attendance API endpoints
export const attendanceApi = {
    getSessionAttendance: async (sessionId: string) => {
        const response = await api.get(`/attendance/session/${sessionId}`);
        console.log(response);
        return response.data;
    },
    // Add new endpoint for course attendance scores
    getCourseAttendanceScores: async (courseId: string) => {
        const response = await api.get(`/attendance-scores/course/${courseId}`);
        return response.data;
    },
    markAttendance: async (
        courseId: string,
        sessionId: string,
        formData: FormData,
    ) => {
        const response = await api.post(
            `/face-recognition/faceId-verify/${courseId}/${sessionId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    },
    verifyLocation: async (
        sessionId: string,
        locationData: {
            latitude: number;
            longitude: number;
            accuracy: number;
        },
    ) => {
        const response = await api.post(
            `/attendance/${sessionId}/verify-location`,
            locationData,
        );
        return response.data;
    },
};

// Session API endpoints
export const sessionApi = {
    getAll: async () => {
        const response = await api.get('/sessions');
        return response.data;
    },
    getByCourse: async (courseId: string) => {
        const response = await api.get(`/sessions/course/${courseId}`);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/sessions/${id}`);
        return response.data;
    },
    create: async (sessionData: any) => {
        const response = await api.post('/sessions', sessionData);
        return response.data;
    },
    update: async (id: string, sessionData: any) => {
        const response = await api.put(`/sessions/${id}`, sessionData);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/sessions/${id}`);
        return response.data;
    },
};

// Face Recognition API endpoints
export const faceRecognitionApi = {
    uploadImage: async (imageData: FormData) => {
        const response = await api.post('/face-recognition/upload', imageData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    // verifyFace: async (imageData: FormData) => {
    //     const response = await api.post('/face-recognition/verify', imageData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    //     return response.data;
    // },
};

// Student API endpoints
export const studentApi = {
    getCourses: async (offset = 0, pageLimit = 10, searchQuery = '') => {
        try {
            const res = await api.get(
                `/courses?offset=${offset}&limit=${pageLimit}` +
                    (searchQuery
                        ? `&search=${encodeURIComponent(searchQuery)}`
                        : ''),
            );

            return res.data;
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            throw error;
        }
    },
};

// System Status API endpoint
export const systemApi = {
    getStatus: async () => {
        const response = await api.get('/system/status');
        return response.data;
    },
};

// Dashboard API endpoints
export const dashboardApi = {
    getLecturerDashboard: async () => {
        const response = await api.get('/dashboard/lecturer');
        return response.data;
    },
};

export default api;
