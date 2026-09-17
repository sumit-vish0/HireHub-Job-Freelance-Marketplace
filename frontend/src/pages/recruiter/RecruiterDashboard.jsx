import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./RecruiterDashboard.css"

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("accounts/recruiter-dashboard/");

        setDashboard(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.detail || "Unable to load recruiter dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="recruiter-dashboard-page">
      {/* NAVBAR */}

      <nav className="navbar">
        <button
          className="navbar-brand"
          onClick={() => navigate("/recruiter/dashboard")}
        >
          Hire-Hub
        </button>

        <div className="navbar-links">
          <button
            className="active"
            onClick={() => navigate("/recruiter/dashboard")}
          >
            Dashboard
          </button>

          <button onClick={() => navigate("/recruiter/jobs")}>My Jobs</button>

          <button onClick={() => navigate("/recruiter/applications")}>
            Applications
          </button>

          <button onClick={() => navigate("/recruiter/interviews")}>
            Interviews
          </button>
        </div>
      </nav>

      <main className="recruiter-dashboard-container">
        {/* HEADER */}

        <div className="recruiter-dashboard-header">
          <div>
            <p className="dashboard-label">RECRUITER PORTAL</p>

            <h1>Recruiter Dashboard</h1>

            <p>Manage your jobs, applications and interviews.</p>
          </div>

          <button
            className="create-job-dashboard-btn"
            onClick={() => navigate("/recruiter/jobs/create")}
          >
            + Create Job
          </button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="dashboard-loading">Loading dashboard...</div>
        )}

        {/* ERROR */}

        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && (
          <>
            {/* STATS */}

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💼</div>

                <div>
                  <p>Total Jobs</p>
                  <h2>{dashboard.total_jobs || 0}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🟢</div>

                <div>
                  <p>Active Jobs</p>
                  <h2>{dashboard.active_jobs || 0}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📄</div>

                <div>
                  <p>Applications</p>
                  <h2>{dashboard.total_applications || 0}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>

                <div>
                  <p>Shortlisted</p>
                  <h2>{dashboard.shortlisted || 0}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>

                <div>
                  <p>Interviews</p>
                  <h2>{dashboard.interviews || 0}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>

                <div>
                  <p>Hired</p>
                  <h2>{dashboard.hired || 0}</h2>
                </div>
              </div>
            </section>

            {/* RECENT APPLICATIONS */}

            <section className="recent-applications">
              <div className="section-header">
                <div>
                  <h2>Recent Applications</h2>

                  <p>Latest candidates who applied to your jobs.</p>
                </div>

                <button onClick={() => navigate("/recruiter/applications")}>
                  View All →
                </button>
              </div>

              {dashboard.recent_applications?.length === 0 ? (
                <div className="no-recent-applications">
                  <div>📄</div>

                  <h3>No applications yet</h3>

                  <p>Applications from candidates will appear here.</p>
                </div>
              ) : (
                <div className="recent-table">
                  <div className="table-header">
                    <span>Candidate</span>
                    <span>Job</span>
                    <span>Status</span>
                    <span>Applied</span>
                  </div>

                  {dashboard.recent_applications?.map((application) => (
                    <div className="table-row" key={application.id}>
                      <div className="candidate-cell">
                        <div className="candidate-avatar">
                          {application.candidate?.charAt(0)?.toUpperCase()}
                        </div>

                        <span>{application.candidate}</span>
                      </div>

                      <span className="job-cell">{application.job}</span>

                      <span
                        className={`application-status status-${application.status?.toLowerCase()}`}
                      >
                        {application.status}
                      </span>

                      <span className="date-cell">
                        {application.applied_at
                          ? new Date(application.applied_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* QUICK ACTIONS */}

            <section className="quick-actions">
              <h2>Quick Actions</h2>

              <div className="quick-actions-grid">
                <button onClick={() => navigate("/recruiter/jobs/create")}>
                  <span>➕</span>
                  <strong>Create Job</strong>
                  <small>Post a new job opening</small>
                </button>

                <button onClick={() => navigate("/recruiter/jobs")}>
                  <span>💼</span>
                  <strong>Manage Jobs</strong>
                  <small>View and edit your jobs</small>
                </button>

                <button onClick={() => navigate("/recruiter/applications")}>
                  <span>📋</span>
                  <strong>Applications</strong>
                  <small>Review candidates</small>
                </button>

                <button onClick={() => navigate("/recruiter/interviews")}>
                  <span>📅</span>
                  <strong>Interviews</strong>
                  <small>Manage scheduled interviews</small>
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default RecruiterDashboard;
