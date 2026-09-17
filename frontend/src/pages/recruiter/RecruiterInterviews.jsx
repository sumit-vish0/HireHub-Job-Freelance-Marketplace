import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./RecruiterInterviews.css";

function RecruiterInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInterviews = async () => {
    try {
      setError("");

      const response = await api.get("interviews/");

      setInterviews(response.data.results || response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.detail || "Unable to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const deleteInterview = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`interviews/${id}/`);

      fetchInterviews();
    } catch (error) {
      console.error(error);

      alert(
        JSON.stringify(error.response?.data || "Unable to delete interview."),
      );
    }
  };

  if (loading) {
    return (
      <div className="interviews-loading-page">
        <div className="interviews-message">Loading interviews...</div>
      </div>
    );
  }

  return (
    <div className="recruiter-interviews-page">
      {/* ================= NAVBAR ================= */}

      <nav className="recruiter-navbar">
        <div className="navbar-brand">
          <h2>HireHub</h2>
        </div>

        <div className="navbar-links">
          <button onClick={() => navigate("/recruiter/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/recruiter/jobs")}>My Jobs</button>

          <button onClick={() => navigate("/recruiter/applications")}>
            Applications
          </button>

          <button className="active-nav">Interviews</button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="interviews-container">
        {/* Header */}

        <div className="interviews-header">
          <div>
            <h1>Interviews</h1>

            <p>Manage scheduled interviews with candidates.</p>
          </div>

          <button
            className="schedule-btn"
            onClick={() => navigate("/recruiter/applications")}
          >
            + Schedule Interview
          </button>
        </div>

        {/* Error */}

        {error && <div className="interviews-error">{error}</div>}

        {/* Empty State */}

        {!error && interviews.length === 0 && (
          <div className="empty-interviews">
            <div className="empty-icon">📅</div>

            <h3>No interviews scheduled</h3>

            <p>Schedule an interview after shortlisting a candidate.</p>

            <button onClick={() => navigate("/recruiter/applications")}>
              Go to Applications
            </button>
          </div>
        )}

        {/* Interviews */}

        {!error && interviews.length > 0 && (
          <div className="interviews-grid">
            {interviews.map((interview) => (
              <div className="interview-card" key={interview.id}>
                {/* Card Header */}

                <div className="interview-card-header">
                  <div className="candidate-avatar">
                    {(interview.candidate_name || interview.candidate || "C")
                      .toString()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="candidate-info">
                    <h3>
                      {interview.candidate_name ||
                        interview.candidate ||
                        "Candidate"}
                    </h3>

                    <p>{interview.job_title || interview.job || "Job"}</p>
                  </div>
                </div>

                {/* Interview Details */}

                <div className="interview-details">
                  <div className="interview-detail">
                    <span>📅</span>

                    <div>
                      <small>Date</small>

                      <strong>
                        {interview.scheduled_at
                          ? new Date(
                              interview.scheduled_at,
                            ).toLocaleDateString()
                          : "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="interview-detail">
                    <span>⏰</span>

                    <div>
                      <small>Time</small>

                      <strong>
                        {interview.scheduled_at
                          ? new Date(interview.scheduled_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="interview-detail">
                    <span>💼</span>

                    <div>
                      <small>Status</small>

                      <strong className="interview-status">Scheduled</strong>
                    </div>
                  </div>
                </div>

                {/* Meeting Link */}

                {interview.meeting_link && (
                  <div className="meeting-section">
                    <span>Meeting Link</span>

                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}

                {/* Notes */}

                {interview.notes && (
                  <div className="notes-section">
                    <span>Interview Notes</span>

                    <p>{interview.notes}</p>
                  </div>
                )}

                {/* Actions */}

                <div className="interview-card-actions">
                  <button
                    className="delete-interview-btn"
                    onClick={() => deleteInterview(interview.id)}
                  >
                    Delete Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecruiterInterviews;
