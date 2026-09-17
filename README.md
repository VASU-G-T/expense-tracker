# 💰 ExpenseTrack — Full-Stack Expense Tracker

> A modern, full-stack personal expense management web application built with **React + Vite** (frontend) and **Spring Boot 3 + Firebase Firestore** (backend).

🌐 **Live Demo URL**: [https://frontend-one-gray-58.vercel.app](https://frontend-one-gray-58.vercel.app)

![Tech Stack](https://img.shields.io/badge/Frontend-React_18_+_Vite-61dafb?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3-6db33f?style=flat-square&logo=spring)
![Database](https://img.shields.io/badge/Database-Firebase_Firestore-ffca28?style=flat-square&logo=firebase)
![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)
![Java](https://img.shields.io/badge/Java-17+-007396?style=flat-square&logo=java)
![Node](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Firestore Database Design](#firestore-database-design)
6. [REST API Documentation](#rest-api-documentation)
7. [Project Structure](#project-structure)
8. [Prerequisites](#prerequisites)
9. [Setup & Installation](#setup--installation)
10. [Running the Application](#running-the-application)
11. [Testing](#testing)
12. [UI Screenshots](#ui-screenshots)
13. [Validation Rules](#validation-rules)

---

## Project Overview

**ExpenseTrack** is a complete CRUD-based web application that allows users to track, manage, and analyze personal expenses. The backend exposes a RESTful API backed by Firebase Firestore for real-time NoSQL storage, while the React frontend provides a polished, dark-mode UI with charts, search, filters, and full expense management.

---

## Features

- ✅ **Full CRUD**: Create, Read, Update, and Delete expense records
- 📊 **Analytics Dashboard**: Doughnut (category breakdown) & Bar (monthly trend) charts
- 🔍 **Search**: Full-text search across title, description, category, and payment method
- 🎛️ **Filters**: Category, payment method, date range (Today/Week/Month), and sort order
- ✔️ **Validation**: Both frontend (real-time field-level) and backend (Bean Validation + business rules)
- 🛡️ **Exception Handling**: Centralized global handler — no stack traces exposed to clients
- 🔔 **Toast Notifications**: Success and error feedback for every user action
- 📱 **Responsive**: Works on mobile, tablet, and desktop
- ♿ **Accessible**: ARIA labels, roles, and unique element IDs throughout
- 🎨 **Premium UI**: Dark mode, HSL color system, glassmorphism, micro-animations

---

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 18, Vite, React Router v6           |
| Charting   | Chart.js + react-chartjs-2                |
| Icons      | Lucide React                              |
| Styling    | Vanilla CSS (Custom Design System)        |
| Backend    | Spring Boot 3.3, Java 17                  |
| Persistence| Firebase Admin SDK 9.4.3, Cloud Firestore |
| Validation | Bean Validation (JSR-380)                 |
| Build      | Maven Wrapper (mvnw)                      |
| Testing    | JUnit 5, Spring MockMvc                   |
| API Tests  | Postman Collection (15 test cases)        |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                React SPA (port 5173)                │
│  Dashboard | Expenses | Add | Edit | Details | About│
└───────────────────────┬─────────────────────────────┘
                        │ HTTP (JSON) — fetch API
                        ▼
┌─────────────────────────────────────────────────────┐
│         Spring Boot REST API (port 8080)            │
│                                                     │
│  ExpenseController → ExpenseService → ExpenseRepo   │
│         ↓ GlobalExceptionHandler (AOP)              │
└───────────────────────┬─────────────────────────────┘
                        │ Firebase Admin SDK
                        ▼
┌─────────────────────────────────────────────────────┐
│            Firebase Cloud Firestore                 │
│         Collection: "expenses"                      │
└─────────────────────────────────────────────────────┘
```

---

## Firestore Database Design

**Collection**: `expenses`

| Field          | Type      | Description                                              |
|----------------|-----------|----------------------------------------------------------|
| `id`           | String    | UUID document ID (auto-generated)                        |
| `title`        | String    | Short expense title (2–100 chars)                        |
| `description`  | String    | Optional notes (max 500 chars)                           |
| `amount`       | Number    | Monetary value in INR (> 0)                              |
| `category`     | String    | One of 10 allowed values (Food, Transport, …)            |
| `paymentMethod`| String    | One of 6 allowed values (Cash, UPI, …)                   |
| `date`         | String    | ISO-8601 date (YYYY-MM-DD)                               |
| `createdAt`    | Timestamp | Server-set creation time                                 |
| `updatedAt`    | Timestamp | Server-set last-update time                              |

**Allowed Categories**: Food, Transport, Shopping, Education, Bills, Entertainment, Health, Travel, Groceries, Other

**Allowed Payment Methods**: Cash, UPI, Debit Card, Credit Card, Bank Transfer, Other

---

## REST API Documentation

Base URL: `http://localhost:8080/api/expenses`

All responses follow the envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```

Error responses:
```json
{ "success": false, "message": "...", "error": "..." }
```

### Endpoints

| Method   | Endpoint                | Description                   | Success Code |
|----------|-------------------------|-------------------------------|-------------|
| `POST`   | `/api/expenses`         | Create a new expense          | `201`        |
| `GET`    | `/api/expenses`         | Get all expenses              | `200`        |
| `GET`    | `/api/expenses/{id}`    | Get expense by ID             | `200`        |
| `PUT`    | `/api/expenses/{id}`    | Update expense by ID          | `200`        |
| `DELETE` | `/api/expenses/{id}`    | Delete expense by ID          | `200`        |

### Example: Create Expense

**Request**
```http
POST /api/expenses
Content-Type: application/json

{
  "title": "Weekly Groceries",
  "description": "BigBazaar supermarket",
  "amount": 1250.50,
  "category": "Groceries",
  "paymentMethod": "UPI",
  "date": "2024-06-15"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": "3f2a1b4c-...",
    "title": "Weekly Groceries",
    "amount": 1250.50,
    "category": "Groceries",
    "paymentMethod": "UPI",
    "date": "2024-06-15",
    "createdAt": "2024-06-15T10:30:00Z",
    "updatedAt": "2024-06-15T10:30:00Z"
  }
}
```

---

## Project Structure

```
expense-tracker/
├── .gitignore
├── .env.example
├── README.md
│
├── frontend/
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── ToastContext.jsx
│       ├── services/
│       │   └── expenseApi.js
│       ├── utils/
│       │   ├── validation.js
│       │   └── formatters.js
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Topbar.jsx
│       │   ├── ExpenseForm.jsx
│       │   ├── ExpenseTable.jsx
│       │   ├── StatCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── FilterPanel.jsx
│       │   ├── DeleteModal.jsx
│       │   ├── Loading.jsx
│       │   └── EmptyState.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Expenses.jsx
│           ├── AddExpense.jsx
│           ├── EditExpense.jsx
│           ├── ExpenseDetails.jsx
│           └── About.jsx
│
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/example/expensetracker/
│       ├── ExpenseTrackerApplication.java
│       ├── config/
│       │   ├── FirebaseConfig.java
│       │   └── CorsConfig.java
│       ├── controller/
│       │   └── ExpenseController.java
│       ├── service/
│       │   └── ExpenseService.java
│       ├── repository/
│       │   └── ExpenseRepository.java
│       ├── model/
│       │   └── Expense.java
│       ├── dto/
│       │   └── ExpenseRequest.java
│       ├── response/
│       │   └── ApiResponse.java
│       └── exception/
│           ├── ExpenseNotFoundException.java
│           └── GlobalExceptionHandler.java
│
└── docs/
    ├── Expense_Tracker_API.postman_collection.json
    └── PROJECT_REPORT.md
```

---

## Prerequisites

| Tool   | Version  | Link |
|--------|----------|------|
| Java   | 17+      | https://adoptium.net/ |
| Maven  | 3.9+ (or use `./mvnw`) | https://maven.apache.org/ |
| Node   | 18+      | https://nodejs.org/ |
| npm    | 9+       | (bundled with Node) |
| Firebase CLI | any | https://firebase.google.com/ |

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create a new project
2. Enable **Cloud Firestore** (Start in production mode or test mode for development)
3. Go to **Project Settings → Service Accounts → Generate new private key**
4. Save the downloaded JSON as `backend/firebase-service-account.json`

> ⚠️ **Never commit** `firebase-service-account.json` — it is already in `.gitignore`

### 3. Backend Configuration

Copy the example environment file and update:
```bash
cp .env.example backend/.env
```

Edit `backend/src/main/resources/application.properties`:
```properties
firebase.credentials.path=firebase-service-account.json
firebase.project.id=your-project-id
```

### 4. Frontend Configuration

```bash
cd frontend
cp ../.env.example .env
```

The default `.env` already contains:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Running the Application

### Start the Backend

```bash
cd backend

# Using Maven Wrapper (no Maven installation needed)
./mvnw.cmd spring-boot:run          # Windows
./mvnw spring-boot:run              # macOS / Linux
```

Backend will start on **http://localhost:8080**

### Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend will start on **http://localhost:5173**

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Testing

### Backend Unit Tests

```bash
cd backend
./mvnw.cmd test
```

Runs 11 MockMvc tests covering all 5 endpoints with valid and invalid inputs.

### Postman API Tests

1. Import `docs/Expense_Tracker_API.postman_collection.json` into Postman
2. Ensure the backend is running on port 8080
3. Run the full collection (15 test cases: TC01–TC15)
4. All tests should pass with the backend running

---

## Validation Rules

| Field          | Rules                                                         |
|----------------|---------------------------------------------------------------|
| `title`        | Required, 2–100 characters                                    |
| `description`  | Optional, max 500 characters                                  |
| `amount`       | Required, must be > 0, max 999,999,999.99                     |
| `category`     | Required, must be one of 10 allowed values                    |
| `paymentMethod`| Required, must be one of 6 allowed values                     |
| `date`         | Required, must be YYYY-MM-DD format, cannot be in the future  |

---

## License

This project is built for educational purposes as part of a Full-Stack Web Development course.
