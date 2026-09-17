import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("accounts/profile/");

        const data = response.data;

        setProfile(data);

        setPhone(data.phone || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setGithub(data.github || "");
        setLinkedin(data.linkedin || "");

        setSelectedSkills(data.skills || []);
      } catch (error) {
        console.error(error);

        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await api.get("skills/");

        setSkills(response.data.results || response.data);
      } catch (error) {
        console.error("Unable to load skills:", error);
      }
    };

    fetchProfile();
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const formData = new FormData();

    formData.append("phone", phone);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("github", github);
    formData.append("linkedin", linkedin);

    if (resume) {
      formData.append("resume", resume);
    }

    selectedSkills.forEach((skillId) => {
      formData.append("skills", skillId);
    });

    try {
      const response = await api.put("accounts/profile/", formData);

      setProfile(response.data);

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const data = error.response.data;

        if (data.detail) {
          setError(data.detail);
        } else {
          const messages = Object.entries(data)
            .map(([field, errors]) => {
              return `${field}: ${
                Array.isArray(errors) ? errors.join(", ") : errors
              }`;
            })
            .join(" | ");

          setError(messages || "Unable to update profile.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
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

          <button className="active">Profile</button>

          <button onClick={() => navigate("/candidate/notifications")}>
            Notifications
          </button>
        </div>
      </nav>

      <main className="profile-container">
        <div className="profile-header">
          <p className="profile-label">YOUR PROFILE</p>

          <h1>Candidate Profile</h1>

          <p>Keep your professional information up to date.</p>
        </div>

        {loading && <div className="profile-loading">Loading profile...</div>}

        {error && <div className="profile-error">{error}</div>}

        {!loading && (
          <section className="profile-card">
            <div className="profile-avatar">
              {profile?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="profile-account">
              <h2>{profile?.username || "Candidate"}</h2>

              <p>{profile?.email || ""}</p>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell recruiters about yourself..."
                  rows="5"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>GitHub</label>

                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn</label>

                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Skills */}

              <div className="form-group">
                <label>Skills</label>

                <div className="skills-container">
                  {skills.map((skill) => (
                    <label key={skill.id} className="skill-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, skill.id]);
                          } else {
                            setSelectedSkills(
                              selectedSkills.filter((id) => id !== skill.id),
                            );
                          }
                        }}
                      />

                      <span>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resume */}

              <div className="form-group">
                <label>Resume</label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                />

                {profile?.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="current-resume"
                  >
                    View current resume →
                  </a>
                )}
              </div>

              <div className="profile-actions">
                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>

              {message && <div className="profile-success">{message}</div>}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default Profile;
