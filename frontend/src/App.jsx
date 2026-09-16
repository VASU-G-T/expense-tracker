import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import ExpenseDetails from './pages/ExpenseDetails';
import About from './pages/About';

const PAGE_TITLES = {
  '/':               'Dashboard',
  '/expenses':       'All Expenses',
  '/add':            'Add Expense',
  '/about':          'About',
};

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname]
    || (location.pathname.includes('/edit') ? 'Edit Expense'
      : location.pathname.includes('/expenses/') ? 'Expense Details' : 'ExpenseTrack');

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Topbar title={title} onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main>
          <Routes>
            <Route path="/"                        element={<Dashboard />} />
            <Route path="/expenses"                element={<Expenses />} />
            <Route path="/expenses/:id"            element={<ExpenseDetails />} />
            <Route path="/expenses/:id/edit"       element={<EditExpense />} />
            <Route path="/add"                     element={<AddExpense />} />
            <Route path="/about"                   element={<About />} />
            {/* 404 fallback */}
            <Route path="*" element={
              <div className="page-container">
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <h1 style={{ fontSize: '4rem', fontWeight: 800, opacity: 0.2 }}>404</h1>
                  <h3>Page not found</h3>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary mt-6" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
                    Go to Dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </BrowserRouter>
  );
}
