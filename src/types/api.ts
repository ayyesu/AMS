export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'lecturer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  lecturer: User;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  courseId: string;
  course: Course;
  startTime: string;
  endTime: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  sessionId: string;
  session: Session;
  studentId: string;
  student: User;
  status: 'present' | 'absent';
  verificationMethod: 'face' | 'manual';
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceScore {
  id: string;
  courseId: string;
  course: Course;
  studentId: string;
  student: User;
  score: number;
  totalSessions: number;
  attendedSessions: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
