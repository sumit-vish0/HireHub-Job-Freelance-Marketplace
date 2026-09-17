import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./Notifications.css"

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("notifications/");

        setNotifications(response.data.results || response.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationTitle = (type) => {
    switch (type) {
      case "APPLICATION":
        return "Application";

      case "SHORTLISTED":
        return "Application Shortlisted";

      case "INTERVIEW":
        return "Interview Scheduled";

      case "HIRED":
        return "Congratulations!";

      case "REJECTED":
        return "Application Update";

      default:
        return "Notification";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="notifications-page">
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

          <button
            className="active"
            onClick={() => navigate("/candidate/notifications")}
          >
            Notifications
          </button>
        </div>
      </nav>

      <main className="notifications-container">
        <div className="notifications-header">
          <div>
            <p className="notifications-label">STAY UPDATED</p>

            <h1>Notifications</h1>

            <p>Keep track of important updates about your applications.</p>
          </div>
        </div>

        {loading && (
          <div className="notifications-loading">Loading notifications...</div>
        )}

        {error && <div className="notifications-error">{error}</div>}

        {!loading && !error && notifications.length === 0 && (
          <div className="no-notifications">
            <div className="empty-notification-icon">🔔</div>

            <h2>No notifications</h2>

            <p>You're all caught up! New updates will appear here.</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <section className="notifications-list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-card ${
                  !notification.is_read ? "unread" : ""
                }`}
              >
                <div className="notification-icon">🔔</div>

                <div className="notification-content">
                  <div className="notification-top">
                    <h2>{notification.title || "Application Update"}</h2>

                    {!notification.is_read && (
                      <span className="new-badge">NEW</span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-date">
                    {notification.created_at
                      ? new Date(notification.created_at).toLocaleString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : ""}
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Notifications;
