import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./Interviews.css";

function Interviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("interviews/");

        setInterviews(response.data.results || response.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load interviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="interviews-page">
      {/* Navbar */}

      <nav className="navbar">
        <button
          className="navbar-brand"
          onClick={() => navigate("/candidate/dashboard")}
        >
          Hire-Hub
        </button>

        <div className="navbar-links">
          <button onClick={() => navigate("/candidate/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/candidate/jobs")}>Jobs</button>

          <button onClick={() => navigate("/candidate/applications")}>
            Applications
          </button>

          <button
            className="active"
            onClick={() => navigate("/candidate/interviews")}
          >
            Interviews
          </button>

          <button onClick={() => navigate("/candidate/profile")}>
            Profile
          </button>

          <button onClick={() => navigate("/candidate/notifications")}>
            Notifications
          </button>
        </div>
      </nav>

      <main className="interviews-container">
        {/* Header */}

        <div className="interviews-header">
          <p className="interviews-label">YOUR INTERVIEW SCHEDULE</p>

          <h1>My Interviews</h1>

          <p>View your upcoming and previous interviews.</p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="interviews-loading">Loading interviews...</div>
        )}

        {/* Error */}

        {error && <div className="interviews-error">{error}</div>}

        {/* Empty */}

        {!loading && !error && interviews.length === 0 && (
          <div className="no-interviews">
            <div className="empty-interview-icon">📅</div>

            <h2>No interviews scheduled</h2>

            <p>You don't have any interviews scheduled yet.</p>

            <button
              className="browse-jobs-btn"
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse Jobs →
            </button>
          </div>
        )}

        {/* Interviews */}

        {!loading && interviews.length > 0 && (
          <section className="interviews-list">
            {interviews.map((interview) => (
              <article className="interview-card" key={interview.id}>
                {/* Calendar */}

                <div className="interview-date-box">
                  <span>
                    {new Date(interview.scheduled_at).toLocaleDateString(
                      "en-IN",
                      {
                        month: "short",
                      },
                    )}
                  </span>

                  <strong>{new Date(interview.scheduled_at).getDate()}</strong>
                </div>

                {/* Information */}

                <div className="interview-info">
                  <h2>
                    {interview.job_title ||
                      interview.application_job_title ||
                      "Interview"}
                  </h2>

                  <p>Application #{interview.application}</p>

                  <div className="interview-details">
                    <span>
                      🗓{" "}
                      {new Date(interview.scheduled_at).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>

                    <span>
                      🕐{" "}
                      {new Date(interview.scheduled_at).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>

                  {interview.notes && (
                    <p className="interview-notes">
                      <strong>Notes:</strong> {interview.notes}
                    </p>
                  )}
                </div>

                {/* Status */}

                <div className="interview-status-section">
                  <span className="interview-status">SCHEDULED</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Interviews;
