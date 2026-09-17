import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./CreateJob.css";

function CreateJob() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("skills/");

        setSkills(response.data.results || response.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load skills.");
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSkillChange = (skillId) => {
    setFormData((previous) => {
      const alreadySelected = previous.skills.includes(skillId);

      if (alreadySelected) {
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
    setLoading(true);

    try {
      await api.post("jobs/", formData);

      alert("Job created successfully!");

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      if (responseData) {
        setError(JSON.stringify(responseData));
      } else {
        setError("Unable to create job.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="create-job-page">
      {/* Navbar */}
      <nav className="create-job-navbar">
        <div className="create-job-brand">
          <h2>Hire-Hub</h2>
          <span>Recruiter Portal</span>
        </div>

        <div className="create-job-nav-links">
          <button onClick={() => navigate("/recruiter/dashboard")}>
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

      {/* Main */}
      <main className="create-job-container">
        <div className="create-job-heading">
          <span>JOB MANAGEMENT</span>

          <h1>Create New Job</h1>

          <p>Post a new opportunity and find the right candidate.</p>
        </div>

        <div className="create-job-card">
          <form onSubmit={handleSubmit}>
            {/* ================= BASIC INFORMATION ================= */}

            <div className="form-section">
              <h2>Basic Information</h2>

              <p className="form-section-description">
                Enter the basic details about the job position.
              </p>

              {/* Job Title */}
              <div className="form-group">
                <label>Job Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Python Django Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                {/* Location */}
                <div className="form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Bangalore"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Job Type */}
                <div className="form-group">
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

              {/* Experience */}
              <div className="form-group">
                <label>Experience Required</label>

                <input
                  type="number"
                  name="experience_required"
                  min="0"
                  placeholder="e.g. 2"
                  value={formData.experience_required}
                  onChange={handleChange}
                  required
                />

                <small>Enter required experience in years.</small>
              </div>
            </div>

            {/* ================= SALARY ================= */}

            <div className="form-section">
              <h2>Salary Information</h2>

              <p className="form-section-description">
                Add the expected salary range for this position.
              </p>

              <div className="form-row">
                {/* Minimum Salary */}
                <div className="form-group">
                  <label>Minimum Salary</label>

                  <input
                    type="number"
                    name="salary_min"
                    min="0"
                    placeholder="e.g. 300000"
                    value={formData.salary_min}
                    onChange={handleChange}
                  />
                </div>

                {/* Maximum Salary */}
                <div className="form-group">
                  <label>Maximum Salary</label>

                  <input
                    type="number"
                    name="salary_max"
                    min="0"
                    placeholder="e.g. 600000"
                    value={formData.salary_max}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}

            <div className="form-section">
              <h2>Job Description</h2>

              <p className="form-section-description">
                Describe the responsibilities and requirements of the role.
              </p>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="7"
                  placeholder="Describe the job responsibilities, requirements, and expectations..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ================= SKILLS ================= */}

            <div className="form-section">
              <h2>Required Skills</h2>

              <p className="form-section-description">
                Select the technical skills required for this position.
              </p>

              <div className="skills-selection">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <label key={skill.id} className="skill-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill.id)}
                        onChange={() => handleSkillChange(skill.id)}
                      />

                      <span>{skill.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="no-skills">No skills available.</p>
                )}
              </div>
            </div>

            {/* ================= ACTIVE STATUS ================= */}

            <div className="form-section">
              <div className="active-job-row">
                <div>
                  <h2>Job Status</h2>

                  <p className="form-section-description">
                    Make this job visible to candidates.
                  </p>
                </div>

                <label className="active-toggle">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />

                  <span className="toggle-slider"></span>

                  <span className="toggle-label">
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>

            {/* ================= ERROR ================= */}

            {error && <div className="create-job-error">{error}</div>}

            {/* ================= ACTIONS ================= */}

            <div className="create-job-actions">
              <button
                type="button"
                className="cancel-job-btn"
                onClick={() => navigate("/recruiter/jobs")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-job-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateJob;
