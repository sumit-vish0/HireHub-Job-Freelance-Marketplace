import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import Jobs from "./pages/candidate/Jobs";
import JobDetails from "./pages/candidate/JobDetails";
import Applications from "./pages/candidate/Applications";
import Interviews from "./pages/candidate/Interviews";
import Profile from "./pages/candidate/Profile";
import Notifications from "./pages/candidate/Notifications";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import CreateJob from "./pages/recruiter/CreateJob";
import EditJob from "./pages/recruiter/EditJob";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import ScheduleInterview from "./pages/recruiter/ScheduleInterview";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Candidate */}

        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute role="CANDIDATE">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/jobs"
          element={
            <ProtectedRoute role="CANDIDATE">
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/jobs/:id"
          element={
            <ProtectedRoute role="CANDIDATE">
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/applications"
          element={
            <ProtectedRoute role="CANDIDATE">
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/interviews"
          element={
            <ProtectedRoute role="CANDIDATE">
              <Interviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute role="CANDIDATE">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/notifications"
          element={
            <ProtectedRoute role="CANDIDATE">
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Recruiter */}

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute role="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute role="RECRUITER">
              <RecruiterJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/create"
          element={
            <ProtectedRoute role="RECRUITER">
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/edit"
          element={
            <ProtectedRoute role="RECRUITER">
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute role="RECRUITER">
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/interviews/create"
          element={
            <ProtectedRoute role="RECRUITER">
              <ScheduleInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/interviews"
          element={
            <ProtectedRoute role="RECRUITER">
              <RecruiterInterviews />
            </ProtectedRoute>
          }
        />

        {/* Default */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Unknown URL */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
