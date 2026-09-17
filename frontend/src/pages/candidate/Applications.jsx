import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./Applications.css"

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("applications/");

        setApplications(response.data.results || response.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "status-applied";

      case "SHORTLISTED":
        return "status-shortlisted";

      case "INTERVIEW":
        return "status-interview";

      case "HIRED":
        return "status-hired";

      case "REJECTED":
        return "status-rejected";

      default:
        return "";
    }
  };

  return (
    <div className="applications-page">
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

          <button
            className="active"
            onClick={() => navigate("/candidate/applications")}
          >
            Applications
          </button>

          <button onClick={() => navigate("/candidate/interviews")}>
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

      <main className="applications-container">
        <div className="applications-header">
          <div>
            <p className="applications-label">YOUR CAREER JOURNEY</p>
            <h1>My Applications</h1>
            <p>Track all the jobs you have applied for.</p>
          </div>
        </div>

        {loading && (
          <div className="applications-loading">Loading applications...</div>
        )}

        {error && <div className="application-error">{error}</div>}

        {!loading && !error && applications.length === 0 && (
          <div className="no-applications">
            <div className="empty-application-icon">📋</div>

            <h2>No applications yet</h2>

            <p>You haven't applied for any jobs yet.</p>

            <button
              className="browse-jobs-btn"
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse Jobs →
            </button>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <section className="applications-list">
            {applications.map((application) => (
              <article className="application-card" key={application.id}>
                <div className="application-main">
                  <div className="application-icon">
                    {application.job_title?.charAt(0)}
                  </div>

                  <div className="application-info">
                    <h2>{application.job_title}</h2>

                    <p>Application #{application.id}</p>

                    <p className="applied-date">
                      Applied on{" "}
                      {new Date(application.applied_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div className="application-right">
                  <span
                    className={`application-status status-${application.status?.toLowerCase()}`}
                  >
                    {application.status}
                  </span>

                  <button
                    className="application-job-btn"
                    onClick={() =>
                      navigate(`/candidate/jobs/${application.job}`)
                    }
                  >
                    View Job →
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Applications;
