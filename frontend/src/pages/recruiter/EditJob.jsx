import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import "./EditJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "FULL_TIME",
    experience_required: 0,
    salary_min: "",
    salary_max: "",
    skills: [],
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobResponse, skillsResponse] = await Promise.all([
          api.get(`jobs/${id}/`),
          api.get("skills/"),
        ]);

        const job = jobResponse.data;

        setSkills(skillsResponse.data.results || skillsResponse.data);

        setFormData({
          title: job.title,
          description: job.description,
          location: job.location,
          job_type: job.job_type,
          experience_required: job.experience_required,
          salary_min: job.salary_min ?? "",
          salary_max: job.salary_max ?? "",
          skills: job.skills || [],
          is_active: job.is_active,
        });
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.detail || "Unable to load job.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSkillChange = (skillId) => {
    setFormData((previous) => {
      if (previous.skills.includes(skillId)) {
        return {
          ...previous,
          skills: previous.skills.filter((id) => id !== skillId),
        };
      }

      return {
        ...previous,
        skills: [...previous.skills, skillId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await api.patch(`jobs/${id}/`, formData);

      alert("Job updated successfully!");

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error(error);

      setError(JSON.stringify(error.response?.data || "Unable to update job."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading job...</h2>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>

        <button onClick={() => navigate("/recruiter/jobs")}>
          Back to Jobs
        </button>
      </div>
    );
  }
  return (
    <div className="edit-job-page">
      {/* Navbar */}
      <nav className="edit-job-navbar">
        <div className="edit-job-brand">
          <h2>Hire-Hub</h2>
          <span>Recruiter Portal</span>
        </div>

        <div className="edit-job-nav-links">
          <button onClick={() => navigate("/recruiter/dashboard")}>
            Dashboard
          </button>

          <button
            className="active"
            onClick={() => navigate("/recruiter/jobs")}
          >
            My Jobs
          </button>

          <button onClick={() => navigate("/recruiter/applications")}>
            Applications
          </button>

          <button onClick={() => navigate("/recruiter/interviews")}>
            Interviews
          </button>
        </div>
      </nav>

      <main className="edit-job-container">
        <div className="edit-job-heading">
          <span>JOB MANAGEMENT</span>

          <h1>Edit Job</h1>

          <p>Update the details of your job posting.</p>
        </div>

        <div className="edit-job-card">
          {loading && !title ? (
            <div className="edit-job-loading">
              <div className="edit-loading-spinner"></div>
              <p>Loading job details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="edit-form-section">
                <h2>Basic Information</h2>

                <p className="edit-section-description">
                  Update the basic information about this position.
                </p>

                <div className="edit-form-group">
                  <label>Job Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Python Django Developer"
                    required
                  />
                </div>

                <div className="edit-form-row">
                  <div className="edit-form-group">
                    <label>Location</label>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore"
                      required
                    />
                  </div>

                  <div className="edit-form-group">
                    <label>Job Type</label>

                    <select
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleChange}
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="edit-form-group">
                  <label>Experience Required</label>

                  <input
                    type="number"
                    name="experience_required"
                    min="0"
                    value={formData.experience_required}
                    onChange={handleChange}
                    required
                  />

                  <small>Required experience in years.</small>
                </div>
              </div>

              {/* Salary */}
              <div className="edit-form-section">
                <h2>Salary Information</h2>

                <p className="edit-section-description">
                  Update the salary range for this position.
                </p>

                <div className="edit-form-row">
                  <div className="edit-form-group">
                    <label>Minimum Salary</label>

                    <input
                      type="number"
                      name="salary_min"
                      min="0"
                      value={formData.salary_min}
                      onChange={handleChange}
                      placeholder="e.g. 300000"
                    />
                  </div>

                  <div className="edit-form-group">
                    <label>Maximum Salary</label>

                    <input
                      type="number"
                      name="salary_max"
                      min="0"
                      value={formData.salary_max}
                      onChange={handleChange}
                      placeholder="e.g. 600000"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="edit-form-section">
                <h2>Job Description</h2>

                <p className="edit-section-description">
                  Update responsibilities and requirements.
                </p>

                <div className="edit-form-group">
                  <label>Description</label>

                  <textarea
                    name="description"
                    rows="8"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the job..."
                    required
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="edit-form-section">
                <h2>Required Skills</h2>

                <p className="edit-section-description">
                  Select the technical skills required for this role.
                </p>

                <div className="edit-skills-container">
                  {skills.length === 0 ? (
                    <p className="no-skills">No skills available.</p>
                  ) : (
                    skills.map((skill) => {
                      const skillId = skill.id;

                      const selected = formData.skills.includes(skillId);

                      return (
                        <label
                          key={skillId}
                          className={`skill-checkbox ${
                            selected ? "selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleSkillChange(skillId)}
                          />

                          <span>{skill.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="edit-form-section status-section">
                <div className="status-content">
                  <div>
                    <h2>Job Status</h2>

                    <p className="edit-section-description">
                      Control whether candidates can see this job.
                    </p>
                  </div>

                  <label className="status-toggle">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />

                    <span className="toggle-slider"></span>

                    <span className="toggle-text">
                      {formData.is_active ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Error */}
              {error && <div className="edit-job-error">{error}</div>}

              {/* Actions */}
              <div className="edit-job-actions">
                <button
                  type="button"
                  className="edit-cancel-btn"
                  onClick={() => navigate("/recruiter/jobs")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="edit-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default EditJob;
