import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("accounts/register/", {
        username,
        email,
        password,
        role,
      });

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
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

          setError(messages || "Registration failed.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        {/* Left Side */}

        <div className="auth-info">
          <div className="auth-logo">Hire-Hub</div>

          <h1>
            Build your
            <span> career.</span>
          </h1>

          <p>
            Join Hire-Hub and connect with opportunities, talented candidates,
            and growing companies.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span>✓</span>
              Create your professional profile
            </div>

            <div className="auth-feature">
              <span>✓</span>
              Discover and apply for jobs
            </div>

            <div className="auth-feature">
              <span>✓</span>
              Manage your hiring process
            </div>
          </div>
        </div>

        {/* Register Card */}

        <div className="auth-card">
          <div className="auth-header">
            <h2>Create account</h2>
            <p>Join Hire-Hub today</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CANDIDATE">Candidate</option>

                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
