/**
 * API service layer for all expense-related HTTP calls.
 * Uses the Fetch API with the VITE_API_BASE_URL env variable.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') + '/expenses';

/**
 * Helper: perform a fetch and normalise the response into { data, error }
 */
async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      const errMsg = json.error || json.message || `Request failed with status ${res.status}`;
      return { data: null, error: errMsg, status: res.status };
    }

    return { data: json.data, message: json.message, error: null, status: res.status };
  } catch (err) {
    const message = err.message?.includes('Failed to fetch')
      ? 'Cannot connect to the server. Please ensure the backend is running on port 8080.'
      : err.message;
    return { data: null, error: message, status: 0 };
  }
}

// ── CRUD Operations ────────────────────────────────────────────

/**
 * GET /api/expenses — fetch all expenses
 */
export async function getAllExpenses() {
  return request(BASE_URL);
}

/**
 * GET /api/expenses/:id — fetch a single expense
 */
export async function getExpenseById(id) {
  return request(`${BASE_URL}/${id}`);
}

/**
 * POST /api/expenses — create a new expense
 */
export async function createExpense(expenseData) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
}

/**
 * PUT /api/expenses/:id — update an existing expense
 */
export async function updateExpense(id, expenseData) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
}

/**
 * DELETE /api/expenses/:id — delete an expense
 */
export async function deleteExpense(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
