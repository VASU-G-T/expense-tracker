import { Server, Globe, Database, Code2, GitBranch, CheckCircle2, Layers } from 'lucide-react';

function TechPill({ label, color = 'var(--brand-400)', bg = 'hsla(245,80%,60%,0.12)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
      background: bg, color, fontSize: '0.8125rem', fontWeight: 600,
      border: `1px solid ${color}44`, margin: '0.2rem',
    }}>
      {label}
    </span>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="card">
      <h3 className="flex items-center gap-3" style={{ marginBottom: '1.25rem' }}>
        <span style={{
          width: 36, height: 36, borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', flexShrink: 0,
        }}>
          <Icon size={18} />
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

const ENDPOINTS = [
  { method: 'POST',   path: '/api/expenses',      desc: 'Create a new expense',       code: 201 },
  { method: 'GET',    path: '/api/expenses',      desc: 'Retrieve all expenses',      code: 200 },
  { method: 'GET',    path: '/api/expenses/{id}', desc: 'Get expense by ID',          code: 200 },
  { method: 'PUT',    path: '/api/expenses/{id}', desc: 'Update existing expense',    code: 200 },
  { method: 'DELETE', path: '/api/expenses/{id}', desc: 'Delete expense by ID',       code: 200 },
];

const METHOD_COLORS = {
  GET: { bg: 'hsla(142,68%,45%,0.12)', color: 'hsl(142,68%,60%)' },
  POST: { bg: 'hsla(245,80%,60%,0.12)', color: 'hsl(245,80%,72%)' },
  PUT: { bg: 'hsla(38,90%,50%,0.12)', color: 'hsl(38,90%,65%)' },
  DELETE: { bg: 'hsla(0,80%,55%,0.12)', color: 'hsl(0,80%,70%)' },
};

export default function About() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>About ExpenseTrack</h1>
        <p>Full-stack CRUD application — built with React, Spring Boot, and Firebase Firestore.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 900 }}>

        {/* Overview */}
        <SectionCard icon={Layers} title="Project Overview">
          <p style={{ lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)' }}>ExpenseTrack</strong> is a modern personal finance
            management web application that allows users to <strong style={{ color: 'var(--brand-400)' }}>create, read,
            update, and delete</strong> expense records. It features real-time analytics, category/payment filtering,
            full-text search, and a clean dark-mode interface.
          </p>
        </SectionCard>

        {/* Tech Stack */}
        <SectionCard icon={Code2} title="Technology Stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600,
                           textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Frontend
              </p>
              <TechPill label="React 18" />
              <TechPill label="Vite" />
              <TechPill label="React Router v6" />
              <TechPill label="Chart.js + react-chartjs-2" color="hsl(185,85%,60%)" bg="hsla(185,85%,45%,0.12)" />
              <TechPill label="Lucide React Icons" />
              <TechPill label="Vanilla CSS (Custom Design System)" />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600,
                           textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Backend
              </p>
              <TechPill label="Spring Boot 3.3" color="hsl(142,68%,60%)" bg="hsla(142,68%,45%,0.12)" />
              <TechPill label="Java 17" color="hsl(38,90%,65%)" bg="hsla(38,90%,50%,0.12)" />
              <TechPill label="Firebase Admin SDK 9.4.3" color="hsl(38,90%,65%)" bg="hsla(38,90%,50%,0.12)" />
              <TechPill label="Bean Validation (JSR-380)" color="hsl(142,68%,60%)" bg="hsla(142,68%,45%,0.12)" />
              <TechPill label="Maven" color="hsl(142,68%,60%)" bg="hsla(142,68%,45%,0.12)" />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600,
                           textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Database & DevOps
              </p>
              <TechPill label="Firebase Firestore" color="hsl(38,90%,65%)" bg="hsla(38,90%,50%,0.12)" />
              <TechPill label="Git + GitHub" color="hsl(220,15%,65%)" bg="hsla(220,15%,50%,0.12)" />
              <TechPill label="Postman (API Testing)" color="hsl(38,90%,65%)" bg="hsla(38,90%,50%,0.12)" />
            </div>
          </div>
        </SectionCard>

        {/* REST API */}
        <SectionCard icon={Server} title="REST API Endpoints">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ENDPOINTS.map(ep => (
              <div
                key={ep.method + ep.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem 1rem', background: 'var(--bg-hover)',
                  borderRadius: 'var(--radius-md)', flexWrap: 'wrap',
                }}
              >
                <span style={{
                  padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 700,
                  fontSize: '0.7rem', letterSpacing: '0.05em', minWidth: 60, textAlign: 'center',
                  ...METHOD_COLORS[ep.method],
                }}>
                  {ep.method}
                </span>
                <code style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-primary)', flex: 1 }}>
                  {ep.path}
                </code>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{ep.desc}</span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'hsla(142,68%,45%,0.12)', color: 'hsl(142,68%,60%)',
                }}>
                  {ep.code}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Features */}
        <SectionCard icon={CheckCircle2} title="Key Features">
          {[
            'Full CRUD: Create, Read, Update, Delete expense records',
            'Real-time dashboard with Doughnut and Bar charts (Chart.js)',
            'Client-side search across title, description, category and payment method',
            'Multi-filter: category, payment method, date range (Today/Week/Month/All), and sort',
            'Server-side + client-side validation with field-level error messages',
            'Standardized REST API responses with success flag, message, and data envelope',
            'Centralized global exception handler — no Java stack traces exposed to clients',
            'Firebase Firestore for scalable, real-time NoSQL persistence',
            'Responsive design: mobile, tablet, and desktop layouts',
            'Accessible: ARIA labels, roles, keyboard navigation, and unique element IDs',
            '10 expense categories and 6 payment methods supported',
            'Toast notification system for all user actions',
          ].map(f => (
            <div key={f} className="flex items-center gap-2" style={{ padding: '0.4rem 0', borderBottom: '1px solid hsla(226,18%,22%,0.4)' }}>
              <CheckCircle2 size={14} style={{ color: 'var(--success-400)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </SectionCard>

        {/* Architecture */}
        <SectionCard icon={GitBranch} title="Architecture">
          <pre style={{
            background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)',
            padding: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)',
            overflow: 'auto', lineHeight: 1.7, border: '1px solid var(--border)',
          }}>
{`expense-tracker/
├── frontend/              # React + Vite SPA
│   └── src/
│       ├── pages/         # Dashboard, Expenses, Add, Edit, Details, About
│       ├── components/    # Reusable UI components
│       ├── services/      # API client (expenseApi.js)
│       ├── utils/         # Validation, formatters
│       └── context/       # Toast notification context
│
└── backend/               # Spring Boot REST API
    └── src/main/java/
        ├── controller/    # ExpenseController (REST endpoints)
        ├── service/       # ExpenseService (business logic)
        ├── repository/    # ExpenseRepository (Firestore)
        ├── model/         # Expense domain model
        ├── dto/           # ExpenseRequest (validation)
        ├── response/      # ApiResponse<T> envelope
        ├── config/        # FirebaseConfig, CorsConfig
        └── exception/     # GlobalExceptionHandler`}
          </pre>
        </SectionCard>

      </div>
    </div>
  );
}
