# 📄 College Project Report: Expense Tracker Web Application

**Academic Project Report**  
**Course**: Full-Stack Web Application Development  
**Application Name**: ExpenseTrack — Full-Stack Expense Tracker  
**Tech Stack**: React 18, Vite, Spring Boot 3, Firebase Firestore, Chart.js  
**Repository**: https://github.com/VASU-G-T/expense-tracker  
**Live URL**: https://frontend-one-gray-58.vercel.app  

---

## 1. Project Title
**ExpenseTrack: A Modern Cloud-Native Expense Tracking and Financial Analytics System**

---

## 2. Project Overview
ExpenseTrack is a full-stack personal finance web application built using modern web architectures. It features a React-based single-page client interface and a high-performance Spring Boot 3 REST API interacting with Google Cloud Firebase Firestore NoSQL database. The system delivers responsive data visualization, transaction lifecycle management, multi-criteria filtering, and enterprise-grade input validation.

---

## 3. Problem Statement
Managing personal daily expenditures across disparate channels (UPI, cards, cash) often leads to lack of fiscal visibility and budget overruns. Existing commercial applications are frequently cluttered with ads or require invasive banking permissions. There is a need for an intuitive, lightweight, secure, and responsive web application enabling users to log, categorize, analyze, and manage expense transactions seamlessly.

---

## 4. Objectives
- Implement full Create, Read, Update, Delete (CRUD) operations on financial expenditure data.
- Enforce strict two-tier data validation (client-side form verification and server-side Java Bean Validation).
- Provide real-time data visual analytics via interactive Chart.js visualizations (Category Distribution Doughnut and Monthly Trends Bar Chart).
- Implement responsive design supporting mobile, tablet, and desktop environments.
- Maintain decoupled architectural layers ensuring separation of concerns.

---

## 5. Scope of the Application
The application handles personal expenditure management with the following functional boundaries:
- User-driven expense entry with Title, Amount, Category, Payment Method, Date, and Description.
- Dynamic search across multiple fields with multi-criteria filtering and sorting.
- Aggregated financial metrics calculation (Total spent, Monthly totals, Average expenses, Transaction counts).
- RESTful HTTP contract adhering to RFC standard status codes and JSON envelopes.

---

## 6. Technology Stack

| Component | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | 18.x | Component-based state management, Virtual DOM |
| **Build Tool** | Vite | 5.x / 6.x | Fast HMR and optimized production bundling |
| **Frontend Router** | React Router | 6.x | Client-side declarative SPA routing |
| **Visual Charts** | Chart.js / react-chartjs-2 | 4.x / 5.x | Performant HTML5 canvas-based charting |
| **UI Icons** | Lucide React | 0.383+ | Modern feather-inspired SVG icon system |
| **Backend Framework**| Spring Boot | 3.3.x | Enterprise Java ecosystem, DI, auto-configuration |
| **Language** | Java | 17 LTS | Modern LTS Java runtime with record and pattern matching |
| **Database** | Firebase Firestore | 9.x SDK | Cloud NoSQL document store with global low latency |
| **Testing** | Postman / JUnit 5 | 2.1 / 5.x | Automated contract and integration verification |

---

## 7. System Architecture
The application adheres to a decoupled 3-tier client-server architecture:

```
+-------------------------------------------------------------+
|                      Client Layer                           |
|  React 18 + Vite (SPA) | Vanilla CSS Design System          |
|  - Dashboard View (Chart.js visual analytics)               |
|  - Expense Management (Search, Filter, Table, Modal)        |
|  - Add/Edit Expense Forms (Real-time client validation)     |
+------------------------------+------------------------------+
                               | HTTPS / JSON
                               v
+-------------------------------------------------------------+
|                     Application Layer                       |
|  Spring Boot 3 REST API (Port 8080)                         |
|  - Controller Layer: ExpenseController (REST endpoints)     |
|  - DTO & Validation: ExpenseRequest (@Positive, @NotBlank)  |
|  - Service Layer: ExpenseService (Business rules)           |
|  - Repository Layer: ExpenseRepository (Firestore SDK)      |
|  - Exception Handler: GlobalExceptionHandler (Standard err) |
+------------------------------+------------------------------+
                               | gRPC / Google Admin SDK
                               v
+-------------------------------------------------------------+
|                       Database Layer                        |
|  Google Cloud Firebase Firestore (NoSQL Document Store)     |
|  - Collection: "expenses"                                   |
|  - Document Schema: id, title, amount, category, date...    |
+-------------------------------------------------------------+
```

---

## 8. Firestore Database Design
Firebase Firestore organizes data into documents within collections. The `expenses` collection holds documents with auto-generated unique alphanumeric IDs.

### Document Schema
| Field Name | Firestore Data Type | Constraints / Description |
| :--- | :--- | :--- |
| `id` | String | Document identifier |
| `title` | String | 3-100 characters, required |
| `description` | String | Up to 500 characters, optional |
| `amount` | Number (Double) | Strictly > 0.00, required |
| `category` | String | Enum: Food, Transport, Shopping, Education, Bills, Entertainment, Health, Travel, Groceries, Other |
| `paymentMethod`| String | Enum: Cash, UPI, Debit Card, Credit Card, Bank Transfer, Other |
| `date` | String | ISO-8601 date string (`YYYY-MM-DD`) |
| `createdAt` | Timestamp / String | UTC timestamp when document is created |
| `updatedAt` | Timestamp / String | UTC timestamp when document is updated |

---

## 9. UI Design & User Experience
The user interface follows a modern dark theme inspired by linear design aesthetics:
- **Design Tokens**: Defined in `index.css` with semantic CSS variables for HSL primary hues, card surfaces, border gradients, and elevation shadows.
- **Glassmorphism & Micro-animations**: Subtle backdrop blur on navigation bars and cards with smooth CSS transitions.
- **Color-Coded Badges**: Distinct visual tags for categories and payment methods for rapid scannability.
- **Accessible Feedback**: Floating toast notification provider delivering real-time action confirmations.
- **Responsive Grid**: Flexbox and CSS grid layouts with mobile breakpoint adaptations at 768px and 480px.

---

## 10. CRUD Implementation Summary
- **Create**: User inputs expense details via `AddExpense.jsx` -> validated -> `POST /api/expenses` -> Firebase Firestore writes document -> Success toast displayed -> Navigate to Expense list.
- **Read (All)**: `Dashboard.jsx` and `Expenses.jsx` issue `GET /api/expenses` -> data visualized across Stat Cards, Charts, and Paginated Table.
- **Read (Single)**: `ExpenseDetails.jsx` issues `GET /api/expenses/{id}` -> displays detailed view with timestamps and action buttons.
- **Update**: `EditExpense.jsx` preloads data -> user modifies fields -> `PUT /api/expenses/{id}` -> updates Firestore document with new `updatedAt` timestamp -> Redirects to detail view.
- **Delete**: User clicks delete -> Accessible confirmation modal prompts verification -> `DELETE /api/expenses/{id}` -> Document removed from Firestore -> UI updates optimistically.

---

## 11. REST API Endpoints Specification

| Method | Endpoint | Description | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/expenses` | Create a new expense record | `201 Created` | `400 Bad Request` |
| `GET` | `/api/expenses` | Retrieve all expense records | `200 OK` | `500 Server Error` |
| `GET` | `/api/expenses/{id}` | Retrieve expense by unique ID | `200 OK` | `404 Not Found` |
| `PUT` | `/api/expenses/{id}` | Update existing expense by ID | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/expenses/{id}` | Remove expense by unique ID | `200 OK` | `404 Not Found` |

---

## 12. Input Validation Architecture
Dual-layer validation prevents invalid states and data tampering:
1. **Client-Side (`validation.js` & `ExpenseForm.jsx`)**:
   - Immediate feedback on blur and change.
   - Title minimum 3 characters.
   - Amount positive number constraint.
   - Category and Payment Method selection validation.
   - Date format and sensible range validation.
2. **Server-Side (`ExpenseRequest.java` & Jakarta Bean Validation)**:
   - `@NotBlank(message = "Title is required")`
   - `@Size(min = 3, max = 100)`
   - `@NotNull(message = "Amount is required")`
   - `@Positive(message = "Amount must be greater than zero")`
   - `@Pattern` matching allowable categories and payment methods.

---

## 13. Exception Handling Strategy
The backend utilizes `@RestControllerAdvice` in `GlobalExceptionHandler.java`:
- **`ExpenseNotFoundException`**: Maps to `404 Not Found` with structured JSON error payload.
- **`MethodArgumentNotValidException`**: Extracts all field binding errors and outputs a map of invalid fields with `400 Bad Request`.
- **`Exception`**: Catches unhandled runtime exceptions, returns sanitized `500 Internal Server Error` message without leaking stack traces or internal infrastructure details.

---

## 14. Testing Plan & Postman Test Cases
A complete 15-test-case Postman collection (`Expense_Tracker_API.postman_collection.json`) verifies API functionality:
- **TC01**: Create Expense with valid payload (201 Created)
- **TC02**: Create Expense with empty title (400 Bad Request)
- **TC03**: Create Expense with amount = 0 (400 Bad Request)
- **TC04**: Create Expense with negative amount (400 Bad Request)
- **TC05**: Create Expense with invalid category (400 Bad Request)
- **TC06**: Create Expense with invalid payment method (400 Bad Request)
- **TC07**: Get All Expenses (200 OK)
- **TC08**: Get Expense by valid ID (200 OK)
- **TC09**: Get Expense by non-existent ID (404 Not Found)
- **TC10**: Update Expense with valid payload (200 OK)
- **TC11**: Delete Expense with valid ID (200 OK)
- **TC12**: Verify Deleted Expense returns 404 (404 Not Found)
- **TC13**: Update Expense with invalid ID (404 Not Found)
- **TC14**: Update Expense with invalid body (400 Bad Request)
- **TC15**: Server error handling format verification

---

## 15. Installation & Setup Procedure

### Prerequisites
- Java 17 or higher (`java -version`)
- Node.js 18 or higher (`node -v`)
- Firebase Account with a Firestore Project

### Backend Setup
1. Place Firebase service account key in `backend/src/main/resources/firebase-service-account.json` (or set `FIREBASE_CONFIG_PATH`).
2. Configure `backend/src/main/resources/application.properties`.
3. Build and launch:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in any modern browser.

---

## 16. Challenges Encountered & Solutions
1. **Challenge**: Asynchronous nature of Firebase Firestore document retrieval and mapping to Java POJOs.  
   **Solution**: Implemented a clean Repository layer utilizing CompletableFuture / Firestore DocumentSnapshot conversions ensuring thread safety.
2. **Challenge**: Cross-Origin Resource Sharing (CORS) preflight rejection between React (Port 5173) and Spring Boot (Port 8080).  
   **Solution**: Registered a dedicated `CorsConfig.java` bean with explicit allowed origins, methods, and headers.
3. **Challenge**: Responsive data tables on small mobile viewports.  
   **Solution**: Developed an adaptive layout switching from multi-column tabular representation to card-based layout on screens narrower than 768px.

---

## 17. Future Enhancements
- User Authentication using Firebase Auth (JWT / OAuth2).
- Export expense reports to PDF and CSV formats.
- Recurring expense scheduling and budget limit notifications.
- Receipt image upload and OCR text extraction using Google Cloud Vision API.

---

## 18. Conclusion
The ExpenseTrack application successfully fulfills all requirements outlined in the Full-Stack Web Application Development SOP. It demonstrates best practices in enterprise Java backends, reactive component-driven frontends, secure cloud database integration, and automated testing verification.
