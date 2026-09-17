import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("accounts/login/", {
        username,
        password,
      });

      const { access, refresh } = response.data.tokens;
      const user = response.data.user;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      login(user, access, refresh);

      if (user.role === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Invalid username or password.");
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
      <div className="auth-container">
        {/* Left Side */}

        <div className="auth-info">
          <div className="auth-logo">Hire-Hub</div>

          <h1>
            Find your next
            <span> opportunity.</span>
          </h1>

          <p>
            Connect with great companies, discover exciting jobs, and build your
            career with Hire-Hub.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span>✓</span>
              Discover relevant job opportunities
            </div>

            <div className="auth-feature">
              <span>✓</span>
              Apply with your resume
            </div>

            <div className="auth-feature">
              <span>✓</span>
              Track your applications
            </div>
          </div>
        </div>

        {/* Login Card */}

        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Login to your Hire-Hub account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
