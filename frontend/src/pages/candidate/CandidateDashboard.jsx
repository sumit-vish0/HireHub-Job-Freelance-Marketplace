import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./CandidateDashboard.css";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("accounts/candidate-dashboard/");
        setDashboard(response.data);
      } catch (error) {
        console.error(error);
        setError("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusClass = (status) => {
    return `status status-${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
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

      <main className="dashboard-content">
        {/* Welcome */}

        <section className="dashboard-header">
          <div>
            <p className="dashboard-label">CANDIDATE DASHBOARD</p>

            <h1>Welcome back, {user?.username || "Candidate"} 👋</h1>

            <p>
              Track your job applications and discover your next opportunity.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/candidate/jobs")}
          >
            Find Jobs
          </button>
        </section>

        {/* Statistics */}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <p>Total Applications</p>
              <h2>{dashboard?.total_applications || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📨</div>

            <div>
              <p>Applied</p>
              <h2>{dashboard?.applied || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>

            <div>
              <p>Shortlisted</p>
              <h2>{dashboard?.shortlisted || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>

            <div>
              <p>Interviews</p>
              <h2>{dashboard?.interviews || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎉</div>

            <div>
              <p>Hired</p>
              <h2>{dashboard?.hired || 0}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">❌</div>

            <div>
              <p>Rejected</p>
              <h2>{dashboard?.rejected || 0}</h2>
            </div>
          </div>
        </section>

        {/* Recent Applications */}

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <h2>Recent Applications</h2>
              <p>Your latest job applications</p>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/candidate/applications")}
            >
              View All
            </button>
          </div>

          {dashboard?.recent_applications?.length === 0 ? (
            <div className="empty-state card">
              <h3>No applications yet</h3>

              <p>Start exploring jobs and apply for your next opportunity.</p>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/candidate/jobs")}
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="applications-table card">
              {dashboard?.recent_applications?.map((application) => (
                <div className="application-row" key={application.id}>
                  <div className="application-info">
                    <h3>{application.job}</h3>

                    <p>
                      Applied on{" "}
                      {new Date(application.applied_at).toLocaleDateString(
                        "en-IN",
                      )}
                    </p>
                  </div>

                  <span className={getStatusClass(application.status)}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CandidateDashboard;
