import React, { useState, useEffect, useCallback } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHead from "@/components/shared/page-head";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import WebcamCapture from "@/components/shared/camera";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertCircle, Loader2 } from "lucide-react";
import { useCourseContext } from "@/context/course-context";
import { useSessionContext } from "@/context/session-context";
import { useAttendance } from "@/context/attendance-context";
import { sessionApi } from "@/lib/api";
import { format } from "date-fns";

// Add this type augmentation before the component
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function AttendanceManagementPage() {
  // context states
  const {
    courses,
    fetchCourses,
    loading: coursesLoading,
    error: coursesError,
  } = useCourseContext();
  const {
    sessions,
    setSessions,
    selectedSession,
    setSelectedSession,
    loading: sessionsLoading,
    error: sessionsError,
    setError: setSessionError,
  } = useSessionContext();
  const {
    attendanceRecords,
    fetchAttendanceBySession,
    markAttendanceWithFace,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAttendance();

  // Local state for UI control
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add state for location coordinates
  const [locationCoordinates, setLocationCoordinates] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to get user's current location
  const getLocation = useCallback(() => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });
  }, []);

  // Function to fetch location
  const fetchLocation = useCallback(async () => {
    setLocationError(null);
    try {
      const position = await getLocation();
      setLocationCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    } catch (locErr) {
      console.error("Location Error:", locErr);
      setLocationError(
        "Failed to get location. Please enable location services and try again.",
      );
    }
  }, [getLocation]);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch sessions when a course is selected
  const handleCourseChange = useCallback(
    async (courseId: string) => {
      setSelectedCourseId(courseId);
      setSelectedSession(null);
      setSessions([]);
      setSessionError(null);
      if (!courseId) return;

      try {
        const response = await sessionApi.getByCourse(courseId);
        setSessions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch sessions for the course";
        setSessionError(message);
        console.error("Fetch Sessions Error:", err);
      }
    },
    [setSelectedSession, setSessions, setSessionError],
  );

  // Fetch attendance records when a session is selected
  useEffect(() => {
    if (selectedSession?._id) {
      fetchAttendanceBySession(selectedSession._id);
      // Fetch location when session is selected
      fetchLocation();
    } else {
      // Optionally clear attendance records if no session is selected
      // setAttendanceRecords([]); // Handled by fetchAttendanceBySession if sessionId is empty
    }
  }, [selectedSession, fetchAttendanceBySession, fetchLocation]);

  const handleSessionChange = (sessionId: string) => {
    const session = sessions.find((s) => s._id === sessionId) || null;
    setSelectedSession(session);
    // Reset camera state when session changes
    setIsCameraActive(false);
    setCaptureError(null);
  };

  // Handle image capture from webcam
  const handleCapture = useCallback(
    async (imageSrc: string) => {
      setCaptureError(null);
      setSuccessMessage(null);

      if (!imageSrc) {
        setCaptureError("No image captured. Please try again.");
        return;
      }
      if (!selectedSession?._id) {
        setCaptureError("No active session selected.");
        return;
      }

      try {
        // Check location first
        if (!locationCoordinates) {
          await fetchLocation();
          if (!locationCoordinates) {
            setCaptureError(
              "Failed to get location. Please enable location services and try again.",
            );
            return;
          }
        }

        // Convert base64 to blob properly
        const base64Data = imageSrc.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }

        const blob = new Blob([new Uint8Array(byteArrays)], {
          type: "image/jpeg",
        });

        // Log for debugging
        console.log("Image blob created:", {
          size: blob.size,
          type: blob.type,
        });

        // Show processing message
        setSuccessMessage("Processing attendance. This may take a moment...");

        const response = await markAttendanceWithFace(
          selectedCourseId,
          selectedSession._id,
          blob,
          locationCoordinates,
        );

        if (response.success) {
          setSuccessMessage(response.message);
          setCaptureError(null);
        } else {
          setCaptureError(response.message);
          setSuccessMessage(null);
        }
        setIsCameraActive(false);
      } catch (err) {
        console.error("Error processing attendance:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process attendance";

        // Show more user-friendly error message
        if (
          errorMessage.includes("timeout") ||
          errorMessage.includes("took too long")
        ) {
          setCaptureError(
            "Request timed out. The server is taking too long to respond. Please try again or contact support if the issue persists.",
          );
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("connection")
        ) {
          setCaptureError(
            "Network connection issue. Please check your internet connection and try again.",
          );
        } else if (errorMessage.includes("No face detected")) {
          setCaptureError(
            "No face was detected in the image. Please ensure proper lighting and positioning, then try again.",
          );
        } else if (errorMessage.includes("Student not enrolled")) {
          setCaptureError(
            "Student not enrolled in this course. Please check enrollment status.",
          );
        } else {
          setCaptureError(errorMessage);
        }

        setSuccessMessage(null);
      }
    },
    [
      selectedSession,
      selectedCourseId,
      locationCoordinates,
      fetchLocation,
      markAttendanceWithFace,
    ],
  );

  const getStatusColor = (status: "present" | "absent" | "late" | string) => {
    switch (status) {
      case "present":
        return "bg-green-500 hover:bg-green-600";
      case "absent":
        return "bg-red-500 hover:bg-red-600";
      case "late":
        return "bg-yellow-500 hover:bg-yellow-600 text-black";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const isCurrentSessionActive = selectedSession?.status === "active";

  // Add export functions
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "Student ID", key: "studentId", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Check-in Time", key: "checkIn", width: 25 },
      { header: "Status", key: "status", width: 12 },
      { header: "Location", key: "location", width: 15 },
      { header: "Method", key: "method", width: 15 },
    ];

    attendanceRecords.forEach((record) => {
      worksheet.addRow({
        studentId: record.student?.userIdentifier,
        name: record.student?.fullName,
        checkIn:
          record.captured_at && format(new Date(record.captured_at), "PPP p"),
        status: record.attendance_status,
        location: record.location_status?.replace("_", " ") || "N/A",
        method: record.verification_method?.replace("_", " ") || "N/A",
      });
    });

    worksheet.getRow(1).font = { bold: true };

    const filename = `attendance_${selectedSession?._id}_${format(
      new Date(),
      "yyyy-MM-dd",
    )}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportToCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "Student ID", key: "studentId" },
      { header: "Name", key: "name" },
      { header: "Check-in Time", key: "checkIn" },
      { header: "Status", key: "status" },
      { header: "Location", key: "location" },
      { header: "Method", key: "method" },
    ];

    attendanceRecords.forEach((record) => {
      worksheet.addRow({
        studentId: record.student?.userIdentifier,
        name: record.student?.fullName,
        checkIn:
          record.captured_at && format(new Date(record.captured_at), "PPP p"),
        status: record.attendance_status,
        location: record.location_status?.replace("_", " ") || "N/A",
        method: record.verification_method?.replace("_", " ") || "N/A",
      });
    });

    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob([buffer], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_${selectedSession?._id}_${format(
      new Date(),
      "yyyy-MM-dd",
    )}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Student ID",
      "Name",
      "Check-in Time",
      "Status",
      "Location",
      "Method",
    ];
    const tableRows = attendanceRecords.map((record) => [
      record.student?.userIdentifier,
      record.student?.fullName,
      record.captured_at
        ? format(new Date(record.captured_at), "PPP p")
        : "N/A",
      record.attendance_status,
      record.location_status?.replace("_", " ") || "N/A",
      record.verification_method?.replace("_", " ") || "N/A",
    ]);

    doc.text("Attendance Records", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(
      `attendance_${selectedSession?._id}_${format(
        new Date(),
        "yyyy-MM-dd",
      )}.pdf`,
    );
  };

  return (
    <div className="h-full flex-1 space-y-4 overflow-y-auto p-4 md:p-8">
      <PageHead title="Attendance Management | App" />
      <Breadcrumbs
        items={[
          { title: "Dashboard", link: "/app" },
          { title: "Attendance Management", link: "/app/attendance" },
        ]}
      />

      {/* Display Course Fetching Errors */}
      {coursesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Courses</AlertTitle>
          <AlertDescription>{coursesError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Card>
          <CardHeader className="text-xl font-bold">
            Course & Session Selection
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Course Selection */}
              <Select
                onValueChange={handleCourseChange}
                value={selectedCourseId}
                disabled={coursesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {coursesLoading && (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Courses...
                    </div>
                  )}
                  {!coursesLoading && courses.length === 0 && (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      No courses found.
                    </div>
                  )}
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.course_code} - {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Session Selection */}
              <Select
                onValueChange={handleSessionChange}
                value={selectedSession?._id || ""}
                disabled={!selectedCourseId || sessionsLoading} // Disable if no course selected or sessions loading
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent>
                  {sessionsLoading && (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Sessions...
                    </div>
                  )}
                  {/* Display Session Fetching Errors */}
                  {sessionsError && (
                    <div className="p-2 text-center text-sm text-red-600">
                      Error: {sessionsError}
                    </div>
                  )}
                  {!sessionsLoading &&
                    !sessionsError &&
                    sessions.length === 0 &&
                    selectedCourseId && (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No sessions found for this course.
                      </div>
                    )}
                  {sessions.map((session) => (
                    <SelectItem key={session._id} value={session._id}>
                      {session.topic} -{" "}
                      {format(new Date(session.session_date), "PPP p")} (
                      {session.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Facial Recognition Section */}
        {selectedSession &&
          isCurrentSessionActive &&
          (selectedSession.attendance_type === "face_recognition" ||
            selectedSession.attendance_type === "hybrid") && (
            <Card>
              <CardHeader className="text-xl font-bold">
                Facial Recognition Attendance
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Start the camera to begin taking attendance using facial
                    recognition. Students should face the camera clearly.
                  </AlertDescription>
                </Alert>
                {/* Display Capture/Marking Errors */}
                {captureError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Capture Error</AlertTitle>
                    <AlertDescription>{captureError}</AlertDescription>
                  </Alert>
                )}
                {/* Display Success Messages */}
                {successMessage && (
                  <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col items-center gap-4">
                  <WebcamCapture
                    isActive={isCameraActive}
                    onToggle={setIsCameraActive}
                    onCapture={handleCapture}
                  />
                  {attendanceLoading && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying and Marking Attendance...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Attendance Records Table */}
        {selectedSession && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="text-xl font-bold">Attendance Records</div>
              {isCurrentSessionActive && (
                <Badge variant="outline" className="bg-green-500 text-white">
                  Active Session
                </Badge>
              )}
              {!isCurrentSessionActive && (
                <Badge variant="destructive">Inactive Session</Badge>
              )}
            </CardHeader>
            <CardContent>
              {/* Display Attendance Fetching Errors */}
              {attendanceError && !attendanceLoading && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Attendance</AlertTitle>
                  <AlertDescription>{attendanceError}</AlertDescription>
                </Alert>
              )}
              {/* Loading Indicator */}
              {attendanceLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Attendance Records...
                </div>
              )}
              {/* Table */}
              {!attendanceLoading && (
                <>
                  {/* Add this before the Table component inside the Attendance Records Card */}
                  {attendanceRecords.length > 0 && (
                    <div className="mb-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={exportToExcel}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export to Excel
                      </Button>
                      <Button
                        size="sm"
                        onClick={exportToCSV}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export to CSV
                      </Button>
                      <Button
                        size="sm"
                        onClick={exportToPDF}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export to PDF
                      </Button>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.length === 0 && !attendanceError ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No attendance records found for this session.
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Use updated property names here
                        attendanceRecords.map((record) => (
                          <TableRow key={record?.student.id}>
                            <TableCell>
                              {record.student?.userIdentifier}
                            </TableCell>
                            <TableCell>{record.student?.fullName}</TableCell>
                            <TableCell>
                              {/* Use captured_at */}
                              {record.captured_at
                                ? format(
                                    new Date(record.captured_at),
                                    "p", // 'p' is locale-dependent short time
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusColor(
                                  record.attendance_status,
                                )} text-white`}
                              >
                                {record.attendance_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.location_status?.replace("_", " ") ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {record.verification_method?.replace("_", " ") ||
                                "N/A"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
