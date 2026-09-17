import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./RecruiterJobs.css";

function RecruiterJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await api.get("jobs/");

      setJobs(response.data.results || response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.detail || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`jobs/${id}/`);

      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.detail || "Unable to delete job.");
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading jobs...</h2>
      </div>
    );
  }

  return (
    <div className="recruiter-jobs-page">
      {/* Navbar */}
      <nav className="recruiter-jobs-navbar">
        <div className="navbar-brand">
          <h2>Hire-Hub</h2>
          <span>Recruiter Portal</span>
        </div>

        <div className="navbar-links">
          <button onClick={() => navigate("/recruiter/dashboard")}>
            Dashboard
          </button>

          <button className="active">My Jobs</button>

          <button onClick={() => navigate("/recruiter/applications")}>
            Applications
          </button>

          <button onClick={() => navigate("/recruiter/interviews")}>
            Interviews
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="recruiter-jobs-container">
        <div className="jobs-header">
          <div>
            <span className="section-label">JOB MANAGEMENT</span>

            <h1>My Jobs</h1>

            <p>Manage the jobs you have posted on Hire-Hub.</p>
          </div>

          <button
            className="create-job-btn"
            onClick={() => navigate("/recruiter/jobs/create")}
          >
            + Create Job
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="jobs-message">
            <div className="loading-spinner"></div>
            <p>Loading your jobs...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && <div className="jobs-error">{error}</div>}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <div className="empty-jobs">
            <div className="empty-icon">💼</div>

            <h2>No Jobs Posted Yet</h2>

            <p>
              Start attracting talented candidates by creating your first job.
            </p>

            <button
              className="create-job-btn"
              onClick={() => navigate("/recruiter/jobs/create")}
            >
              + Create Your First Job
            </button>
          </div>
        )}

        {/* Jobs */}
        {!loading && !error && jobs.length > 0 && (
          <section className="jobs-grid">
            {jobs.map((job) => (
              <article className="recruiter-job-card" key={job.id}>
                <div className="job-card-top">
                  <div className="job-title-section">
                    <h2>{job.title}</h2>

                    <p className="company-name">
                      {job.company_name || "Your Company"}
                    </p>
                  </div>

                  <span
                    className={
                      job.is_active
                        ? "job-status active"
                        : "job-status inactive"
                    }
                  >
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="job-info">
                  <span>📍 {job.location}</span>

                  <span>💼 {job.job_type?.replace("_", " ")}</span>

                  <span>🎓 {job.experience_required} year(s)</span>
                </div>

                {(job.salary_min !== null || job.salary_max !== null) && (
                  <div className="job-salary">
                    💰 ₹{job.salary_min || 0} - ₹{job.salary_max || 0}
                  </div>
                )}

                <p className="job-description">{job.description}</p>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="job-skills">
                    {job.skills.map((skill, index) => (
                      <span key={skill.id || index}>
                        {typeof skill === "object"
                          ? skill.name
                          : `Skill ${skill}`}
                      </span>
                    ))}
                  </div>
                )}

                <div className="job-card-footer">
                  <small>
                    Posted{" "}
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : ""}
                  </small>

                  <div className="job-actions">
                    <button
                      className="edit-job-btn"
                      onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-job-btn"
                      onClick={() => handleDelete(job.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default RecruiterJobs;
