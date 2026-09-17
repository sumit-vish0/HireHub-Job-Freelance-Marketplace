import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./Jobs.css"

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async (
    searchValue = search,
    locationValue = location,
    jobTypeValue = jobType,
    experienceValue = experience,
  ) => {
    setLoading(true);
    setError("");

    try {
      const params = {
        search: searchValue || undefined,
        location: locationValue || undefined,
        job_type: jobTypeValue || undefined,
        experience_required: experienceValue || undefined,
        is_active: true,
      };

      const response = await api.get("jobs/", { params });

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

  const handleSearch = (e) => {
    e.preventDefault();

    fetchJobs();
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExperience("");

    fetchJobs("", "", "", "");
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-IN").format(salary);
  };

  return (
    <div className="jobs-page">
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

          <button
            className="active"
            onClick={() => navigate("/candidate/jobs")}
          >
            Jobs
          </button>

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

      <main className="jobs-content">
        {/* Header */}

        <section className="jobs-header">
          <div>
            <p className="jobs-label">CAREER OPPORTUNITIES</p>

            <h1>Find your next job</h1>

            <p>Discover opportunities that match your skills and experience.</p>
          </div>
        </section>

        {/* Search */}

        <form className="job-search-box" onSubmit={handleSearch}>
          <div className="search-input">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search jobs, skills or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-input">
            <span>📍</span>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">All Job Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">Any Experience</option>
            <option value="0">Fresher</option>
            <option value="1">1+ Years</option>
            <option value="2">2+ Years</option>
            <option value="3">3+ Years</option>
            <option value="5">5+ Years</option>
          </select>

          <button className="search-btn" type="submit">
            Search
          </button>

          <button className="clear-btn" type="button" onClick={clearFilters}>
            Clear
          </button>
        </form>

        {/* Results */}

        <div className="jobs-result-header">
          <h2>Available Jobs</h2>

          {!loading && (
            <span>
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && <div className="jobs-loading">Loading jobs...</div>}

        {!loading && jobs.length === 0 && (
          <div className="empty-jobs">
            <div className="empty-icon">🔎</div>

            <h3>No jobs found</h3>

            <p>Try changing your search or filters.</p>

            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Job Cards */}

        {!loading && jobs.length > 0 && (
          <section className="jobs-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-card-top">
                  <div className="company-placeholder">
                    {job.title?.charAt(0)}
                  </div>

                  <div className="job-title-area">
                    <h2>{job.title}</h2>

                    <p>{job.location}</p>
                  </div>
                </div>

                <div className="job-tags">
                  <span>{job.job_type?.replace("_", " ")}</span>

                  <span>
                    {job.experience_required === 0
                      ? "Fresher"
                      : `${job.experience_required}+ years`}
                  </span>
                </div>

                <p className="job-description">{job.description}</p>

                {job.skills?.length > 0 && (
                  <div className="job-skills">
                    {job.skills.map((skill, index) => (
                      <span key={skill.id || index}>
                        {skill.name || `Skill ${skill}`}
                      </span>
                    ))}
                  </div>
                )}

                {job.salary_min !== null && job.salary_max !== null && (
                  <div className="job-salary">
                    ₹{Number(job.salary_min).toLocaleString("en-IN")}
                    {" - "}₹{Number(job.salary_max).toLocaleString("en-IN")}
                  </div>
                )}

                <div className="job-card-footer">
                  <span className="job-status">● Active</span>

                  <button
                    className="view-job-btn"
                    onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                  >
                    View Details →
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

export default Jobs;
