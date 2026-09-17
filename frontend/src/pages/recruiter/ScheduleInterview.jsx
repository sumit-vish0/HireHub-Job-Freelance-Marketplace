import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../../services/api";
import "./ScheduleInterview.css";

function ScheduleInterview() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const applicationId = searchParams.get("application");

  const [application, setApplication] = useState(null);

  const [formData, setFormData] = useState({
    scheduled_at: "",
    meeting_link: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     LOAD APPLICATION
  ========================= */

  useEffect(() => {
    const loadApplication = async () => {
      if (!applicationId) {
        setError("Application ID is missing.");

        setLoading(false);

        return;
      }

      try {
        const response = await api.get(`applications/${applicationId}/`);

        setApplication(response.data);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.detail || "Unable to load application.");
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId]);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!applicationId) {
      setError("Application ID is missing.");

      return;
    }

    setSaving(true);

    try {
      await api.post("interviews/", {
        application: Number(applicationId),

        scheduled_at: formData.scheduled_at,

        meeting_link: formData.meeting_link,

        notes: formData.notes,
      });

      alert("Interview scheduled successfully!");

      navigate("/recruiter/interviews");
    } catch (error) {
      console.error(error);

      const errorData = error.response?.data || "Unable to schedule interview.";

      if (typeof errorData === "object") {
        setError(JSON.stringify(errorData));
      } else {
        setError(errorData);
      }
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="schedule-loading-card">
          <div className="schedule-loading-icon">📅</div>

          <h2>Loading application...</h2>

          <p>Please wait while we load the application details.</p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR WITHOUT APPLICATION
  ========================= */

  if (error && !application) {
    return (
      <div className="schedule-error-page">
        <div className="schedule-error-card">
          <div className="schedule-error-icon">⚠️</div>

          <h2>Unable to Load Application</h2>

          <p>{error}</p>

          <button onClick={() => navigate("/recruiter/applications")}>
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="schedule-interview-page">
      {/* ================= NAVBAR ================= */}

      <nav className="schedule-navbar">
        <div className="schedule-brand">
          <h2>Hire-Hub</h2>

          <span>Recruiter Portal</span>
        </div>

        <div className="schedule-nav-links">
          <button onClick={() => navigate("/recruiter/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/recruiter/jobs")}>My Jobs</button>

          <button onClick={() => navigate("/recruiter/applications")}>
            Applications
          </button>

          <button
            className="active"
            onClick={() => navigate("/recruiter/interviews")}
          >
            Interviews
          </button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="schedule-container">
        {/* Heading */}

        <div className="schedule-heading">
          <span>INTERVIEW MANAGEMENT</span>

          <h1>Schedule Interview</h1>

          <p>Schedule an interview with a shortlisted candidate.</p>
        </div>

        {/* Card */}

        <div className="schedule-card">
          {/* Card Header */}

          <div className="schedule-card-header">
            <div className="schedule-icon">📅</div>

            <div>
              <h2>Interview Details</h2>

              <p>Set the date and time for the candidate interview.</p>
            </div>
          </div>

          {/* ================= APPLICATION ================= */}

          <div className="application-preview">
            <h3>Application Details</h3>

            <div className="application-preview-details">
              <div>
                <span>Candidate</span>

                <strong>
                  {application?.candidate_name ||
                    application?.candidate ||
                    "Candidate"}
                </strong>
              </div>

              <div>
                <span>Job</span>

                <strong>
                  {application?.job_title || application?.job || "Job"}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong className="application-status">
                  {application?.status || "SHORTLISTED"}
                </strong>
              </div>
            </div>
          </div>

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>
            {/* Date & Time */}

            <div className="schedule-form-group">
              <label htmlFor="scheduled_at">Interview Date & Time</label>

              <input
                id="scheduled_at"
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                required
              />

              <small>Select the date and time for the interview.</small>
            </div>

            {/* Meeting Link */}

            <div className="schedule-form-group">
              <label htmlFor="meeting_link">
                Meeting Link
                <span className="optional-label">Optional</span>
              </label>

              <input
                id="meeting_link"
                type="url"
                name="meeting_link"
                value={formData.meeting_link}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
              />

              <small>Add Google Meet, Zoom, or another meeting URL.</small>
            </div>

            {/* Notes */}

            <div className="schedule-form-group">
              <label htmlFor="notes">
                Interview Notes
                <span className="optional-label">Optional</span>
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="5"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add instructions or notes for the candidate..."
              />
            </div>

            {/* Error */}

            {error && <div className="schedule-error">{error}</div>}

            {/* Actions */}

            <div className="schedule-actions">
              <button
                type="button"
                className="schedule-cancel-btn"
                onClick={() => navigate("/recruiter/applications")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="schedule-submit-btn"
                disabled={saving}
              >
                {saving ? "Scheduling..." : "Schedule Interview"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ScheduleInterview;
