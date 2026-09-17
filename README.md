# HireHub — Job & Freelance Marketplace

HireHub is a full-stack **Job & Freelance Marketplace** that connects recruiters with candidates through a role-based platform. Recruiters can create and manage job postings, while candidates can browse jobs, apply for positions, upload resumes, and track their applications.

The project is built with **Django REST Framework and MySQL** for the backend and **React.js** for the frontend.

---

## 🚀 Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based access for:

  * Candidate
  * Recruiter
* Protected API endpoints
* Role-based permissions

### 🧑‍💼 Recruiter Features

* Recruiter profile and company management
* Create, update, and delete job postings
* View applications received for posted jobs
* Review candidate applications
* Update application status
* Schedule interviews for shortlisted candidates

### 👨‍💻 Candidate Features

* Candidate profile management
* Browse available jobs
* Search and filter jobs
* View job details
* Apply for jobs
* Upload resumes
* Track application status
* View interview information

### 🔎 Job Search & Filtering

* Search jobs by title and relevant information
* Filter jobs based on available job attributes
* Pagination for job/application listings

### 📄 Resume Management

* Candidate resume upload
* Resume associated with job applications
* Recruiters can access submitted application information

### 🔔 Application & Interview Management

Application statuses include:

* Applied
* Shortlisted
* Interview
* Rejected
* Hired

Recruiters can schedule interviews for shortlisted candidates.

### 🛠️ Admin

* Django Admin panel
* Manage users and application-related data
* Manage jobs and other backend resources

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │       React.js      │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Django REST         │
                    │ Framework           │
                    │ Backend             │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          Accounts           Jobs         Applications
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* React Router

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT

### Database

* MySQL

### Authentication

* JWT Authentication
* Role-Based Authorization

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## 📂 Project Structure

```text
Hire-Hub/
│
├── backend/
│   │
│   ├── manage.py
│   │
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── companies/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── job/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── applications/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── notifications/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   │
│   └── config/
│       ├── settings.py
│       ├── urls.py
│       ├── wsgi.py
│       └── asgi.py
│
└── frontend/
    │
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── hooks/
    │   └── App.jsx
    │
    ├── package.json
    └── vite.config.js
```

> Folder names may differ depending on the current version of the project.

---

## 🔐 Authentication Flow

HireHub uses **JWT authentication**.

```text
User Login
    ↓
Django REST API
    ↓
Validate Credentials
    ↓
Generate JWT Access Token
    ↓
React Frontend
    ↓
Send Token with API Requests
    ↓
Protected API Endpoint
    ↓
Authorize User
```

JWT allows the backend to identify authenticated users when they access protected endpoints.

---

## 🔄 Application Flow

### Candidate

```text
Register/Login
      ↓
Candidate Dashboard
      ↓
Browse Jobs
      ↓
Search / Filter
      ↓
View Job Details
      ↓
Apply
      ↓
Upload Resume
      ↓
Application Created
      ↓
Track Application Status
```

### Recruiter

```text
Register/Login
      ↓
Recruiter Dashboard
      ↓
Create Job
      ↓
Receive Applications
      ↓
Review Candidates
      ↓
Shortlist Candidate
      ↓
Schedule Interview
      ↓
Update Application Status
```

---

## 🗄️ Main Data Models

The application contains several interconnected resources.

### User

Stores authentication and user-role information.

```text
User
 ├── username
 ├── email
 ├── password
 └── role
      ├── Candidate
      └── Recruiter
```

### Candidate Profile

Stores candidate-specific information such as:

```text
CandidateProfile
 ├── phone
 ├── bio
 ├── location
 ├── resume
 ├── GitHub
 ├── LinkedIn
 └── skills
```

### Company

Stores recruiter/company information.

### Job

Stores job posting information and associated skills.

### Application

Connects a candidate with a job.

```text
Candidate
     │
     │ applies
     ▼
Application
     │
     └──────► Job
```

An application can have statuses such as:

```text
APPLIED
SHORTLISTED
INTERVIEW
REJECTED
HIRED
```

### Interview

Stores interview information for shortlisted applications.

### Notification

Stores application-related notifications such as:

```text
APPLICATION
SHORTLISTED
INTERVIEW
HIRED
REJECTED
```

---

## 🌐 REST API

The backend exposes RESTful APIs for communication between the React frontend and Django backend.

Example API areas:

```text
/api/auth/
/api/jobs/
/api/applications/
/api/companies/
/api/notifications/
```

The frontend communicates with the backend through HTTP requests and receives JSON responses.

---

## 📊 Pagination

Large datasets such as jobs and applications are returned using pagination.

Instead of returning every record at once:

```text
Request
   ↓
Page 1 → limited records
Page 2 → next records
Page 3 → next records
```

This helps keep API responses manageable and improves frontend usability.

---

## 🔎 Search & Filtering

HireHub supports job discovery through search and filtering functionality.

Users can narrow job results based on available job attributes such as:

* Skills
* Location
* Salary
* Job information

This allows candidates to find relevant opportunities more efficiently.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sumit-vish0/Hire-Hub.git

cd Hire-Hub
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=hirehub_db
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

Do not commit `.env` to GitHub.

### 4. Create Database

Create the MySQL database:

```sql
CREATE DATABASE hirehub_db;
```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

### 7. Start Django Server

```bash
python manage.py runserver
```

Backend will run locally at:

```text
http://127.0.0.1:8000/
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The React application will run on the Vite development server.

---

## 🧪 API Testing

APIs can be tested using **Postman**.

Example workflow:

```text
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Add JWT to Authorization Header
   ↓
Call Protected API
```

Authorization header:

```text
Authorization: Bearer <access_token>
```

---

## 🔒 Security

The project implements several backend security practices:

* JWT-based authentication
* Role-based authorization
* Protected API endpoints
* Django password hashing
* Environment variables for sensitive configuration
* Permission-based access to recruiter/candidate functionality

---

## 📚 Key Concepts Demonstrated

This project demonstrates practical experience with:

* Python
* Django
* Django REST Framework
* REST API development
* JWT authentication
* Role-based authorization
* CRUD operations
* Django ORM
* MySQL database integration
* React.js
* API integration
* File uploads
* Search and filtering
* Pagination
* Application workflow management
* Git/GitHub
* Postman API testing
* Full-stack application architecture

---

## 🎯 Learning Outcomes

Through HireHub, I gained hands-on experience in building a complete full-stack application and learned how to:

* Design backend models and relationships
* Build RESTful APIs using Django REST Framework
* Implement JWT authentication and authorization
* Connect React.js with Django APIs
* Work with MySQL and Django ORM
* Implement CRUD functionality
* Handle file uploads
* Build search, filtering, and pagination
* Manage role-specific application workflows
* Test APIs using Postman
* Structure a scalable full-stack application

---

## 👨‍💻 Author

**Sumit Vishwakarma**

Python Full Stack Developer

GitHub: `https://github.com/sumit-vish0`

LinkedIn: `https://linkedin.com/in/sumitvish0/`

---

## 📄 License

This project is created for learning and portfolio purposes.
