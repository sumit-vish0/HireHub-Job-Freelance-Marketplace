import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [job, setJob] = useState(null);

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`jobs/${id}/`);

        setJob(response.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!resume) {
      setError("Please select your resume.");

      return;
    }

    const formData = new FormData();

    formData.append("job", id);

    formData.append("resume", resume);

    formData.append("cover_letter", coverLetter);

    setApplying(true);

    try {
      await api.post("applications/", formData);

      setMessage("Application submitted successfully!");

      setResume(null);
      setCoverLetter("");
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          const messages = Object.entries(data)
            .map(([field, errors]) => {
              return `${field}: ${
                Array.isArray(errors) ? errors.join(", ") : errors
              }`;
            })
            .join(" | ");

          setError(messages || "Application failed.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading job...</h2>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={() => navigate("/candidate/jobs")}>
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-page">
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

      <main className="job-details-container">
        {/* Back button */}

        <button
          className="back-btn"
          onClick={() => navigate("/candidate/jobs")}
        >
          ← Back to Jobs
        </button>

        <div className="job-details-layout">
          {/* LEFT - JOB INFORMATION */}

          <section className="job-info-card">
            <div className="job-heading">
              <div className="job-company-icon">{job.title?.charAt(0)}</div>

              <div>
                <h1>{job.title}</h1>

                <p className="job-location">📍 {job.location}</p>
              </div>
            </div>

            <div className="job-meta">
              <span>💼 {job.job_type?.replace("_", " ")}</span>

              <span>
                👤{" "}
                {job.experience_required === 0
                  ? "Fresher"
                  : `${job.experience_required}+ years`}
              </span>

              {job.salary_min !== null && job.salary_max !== null && (
                <span>
                  💰 ₹{Number(job.salary_min).toLocaleString("en-IN")}
                  {" - "}₹{Number(job.salary_max).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <hr />

            {/* Description */}

            <div className="job-section">
              <h2>Job Description</h2>

              <p>{job.description}</p>
            </div>

            {/* Skills */}

            <div className="job-section">
              <h2>Required Skills</h2>

              <div className="details-skills">
                {job.skills?.map((skill, index) => (
                  <span key={skill.id || index}>
                    {typeof skill === "object" ? skill.name : `Skill ${skill}`}
                  </span>
                ))}
              </div>
            </div>

            <div className="job-active">
              <span>●</span>
              This job is currently active
            </div>
          </section>

          {/* RIGHT - APPLICATION */}

          <section className="apply-card">
            <div className="apply-header">
              <h2>Apply for this job</h2>

              <p>
                Submit your application and take the next step in your career.
              </p>
            </div>

            {message && <div className="success-message">✓ {message}</div>}

            {error && <div className="error-message">{error}</div>}

            <form className="application-form" onSubmit={handleApply}>
              {/* Resume */}

              <div className="form-group">
                <label>
                  Resume <span>*</span>
                </label>

                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    required
                  />

                  <div className="file-upload-content">
                    <div className="upload-icon">📄</div>

                    <div>
                      <strong>
                        {resume ? resume.name : "Upload your resume"}
                      </strong>

                      <small>PDF, DOC or DOCX</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}

              <div className="form-group">
                <label>Cover Letter</label>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the recruiter why you are a good fit for this position..."
                  rows="8"
                />

                <small className="field-hint">
                  A good cover letter can increase your chances of getting
                  noticed.
                </small>
              </div>

              {/* Submit */}

              <button className="apply-btn" type="submit" disabled={applying}>
                {applying
                  ? "Submitting Application..."
                  : "Submit Application →"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;
