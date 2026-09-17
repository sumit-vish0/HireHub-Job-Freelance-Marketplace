import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./RecruiterApplications.css";

function RecruiterApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH APPLICATIONS
  // =========================

  const fetchApplications = async () => {
    try {
      setError("");

      const response = await api.get("applications/");

      setApplications(response.data.results || response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.detail || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================
  // UPDATE APPLICATION STATUS
  // =========================

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`applications/${id}/`, {
        status: status,
      });

      // Refresh applications after successful update
      await fetchApplications();
    } catch (error) {
      console.error(error);

      alert(
        JSON.stringify(error.response?.data || "Unable to update application."),
      );
    }
  };

  // =========================
  // FORMAT STATUS
  // =========================

  const formatStatus = (status) => {
    if (!status) {
      return "Applied";
    }

    return status
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="applications-loading-page">
        <div className="applications-message">
          <div className="applications-spinner"></div>

          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN
  // =========================

  return (
    <div className="recruiter-applications-page">
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="applications-navbar">
        <div className="applications-brand">
          <h2>Hire-Hub</h2>
          <span>Recruiter Portal</span>
        </div>

        <div className="applications-nav-links">
          <button onClick={() => navigate("/recruiter/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/recruiter/jobs")}>My Jobs</button>

          <button className="active">Applications</button>

          <button onClick={() => navigate("/recruiter/interviews")}>
            Interviews
          </button>
        </div>
      </nav>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="applications-container">
        {/* HEADER */}

        <div className="applications-header">
          <div>
            <span className="applications-label">CANDIDATE MANAGEMENT</span>

            <h1>Applications</h1>

            <p>Review and manage candidates who applied to your jobs.</p>
          </div>
        </div>

        {/* ERROR */}

        {error && <div className="applications-error">{error}</div>}

        {/* EMPTY */}

        {!error && applications.length === 0 && (
          <div className="applications-empty">
            <div className="applications-empty-icon">📄</div>

            <h2>No Applications Yet</h2>

            <p>Applications from candidates will appear here.</p>

            <button
              className="view-jobs-btn"
              onClick={() => navigate("/recruiter/jobs")}
            >
              View My Jobs
            </button>
          </div>
        )}

        {/* =========================
            APPLICATION LIST
        ========================= */}

        {!error && applications.length > 0 && (
          <section className="applications-list">
            {applications.map((application) => (
              <article className="application-card" key={application.id}>
                {/* =========================
                    CARD TOP
                ========================= */}

                <div className="application-card-top">
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      {application.candidate_name?.charAt(0)?.toUpperCase() ||
                        "C"}
                    </div>

                    <div>
                      <h2>{application.candidate_name || "Candidate"}</h2>

                      <p>
                        Applied for{" "}
                        <strong>{application.job_title || "Job"}</strong>
                      </p>
                    </div>
                  </div>

                  {/* STATUS BADGE */}

                  <span
                    className={`application-status status-${(
                      application.status || "APPLIED"
                    ).toLowerCase()}`}
                  >
                    {formatStatus(application.status)}
                  </span>
                </div>

                {/* =========================
                    DETAILS
                ========================= */}

                <div className="application-details">
                  <div className="application-detail">
                    <span className="detail-label">Applied On</span>

                    <span className="detail-value">
                      {application.applied_at
                        ? new Date(application.applied_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>

                  <div className="application-detail">
                    <span className="detail-label">Application ID</span>

                    <span className="detail-value">#{application.id}</span>
                  </div>
                </div>

                {/* =========================
                    COVER LETTER
                ========================= */}

                {application.cover_letter && (
                  <div className="cover-letter">
                    <h3>Cover Letter</h3>

                    <p>{application.cover_letter}</p>
                  </div>
                )}

                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="application-actions">
                  {/* RESUME */}

                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-btn"
                    >
                      📄 View Resume
                    </a>
                  )}

                  {/* STATUS CONTROL */}

                  <div className="status-control">
                    <label htmlFor={`status-${application.id}`}>
                      Update Status
                    </label>

                    <select
                      id={`status-${application.id}`}
                      value={application.status || "APPLIED"}
                      onChange={(e) =>
                        handleStatusChange(application.id, e.target.value)
                      }
                    >
                      <option value="APPLIED">Applied</option>

                      <option value="SHORTLISTED">Shortlisted</option>

                      <option value="INTERVIEW">Interview</option>

                      <option value="HIRED">Hired</option>

                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* =========================
                    SCHEDULE INTERVIEW
                ========================= */}

                {application.status === "SHORTLISTED" && (
                  <div className="schedule-interview-action">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/recruiter/interviews/create?application=${application.id}`,
                        )
                      }
                    >
                      📅 Schedule Interview
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default RecruiterApplications;
