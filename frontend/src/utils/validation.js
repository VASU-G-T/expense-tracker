// ── Validation Rules ───────────────────────────────────────────

export const VALID_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Education', 'Bills',
  'Entertainment', 'Health', 'Travel', 'Groceries', 'Other',
];

export const VALID_PAYMENT_METHODS = [
  'Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other',
];

/**
 * Validate an expense form object.
 * Returns an errors object — empty if valid.
 *
 * @param {object} values - { title, amount, category, paymentMethod, date, description? }
 * @returns {object} errors keyed by field name
 */
export function validateExpense(values) {
  const errors = {};

  // Title
  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }

  // Description (optional)
  if (values.description && values.description.length > 500) {
    errors.description = 'Description must not exceed 500 characters';
  }

  // Amount
  if (values.amount === '' || values.amount === null || values.amount === undefined) {
    errors.amount = 'Amount is required';
  } else {
    const num = parseFloat(values.amount);
    if (isNaN(num)) {
      errors.amount = 'Amount must be a valid number';
    } else if (num <= 0) {
      errors.amount = 'Amount must be greater than zero';
    } else if (num > 999999999.99) {
      errors.amount = 'Amount exceeds the maximum allowed value';
    }
  }

  // Category
  if (!values.category) {
    errors.category = 'Category is required';
  } else if (!VALID_CATEGORIES.includes(values.category)) {
    errors.category = `Invalid category. Choose one of: ${VALID_CATEGORIES.join(', ')}`;
  }

  // Payment method
  if (!values.paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  } else if (!VALID_PAYMENT_METHODS.includes(values.paymentMethod)) {
    errors.paymentMethod = `Invalid payment method. Choose one of: ${VALID_PAYMENT_METHODS.join(', ')}`;
  }

  // Date
  if (!values.date) {
    errors.date = 'Date is required';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    errors.date = 'Date must be in YYYY-MM-DD format';
  } else {
    const d = new Date(values.date);
    if (isNaN(d.getTime())) {
      errors.date = 'Date is not a valid calendar date';
    } else if (d > new Date()) {
      errors.date = 'Date cannot be in the future';
    }
  }

  return errors;
}
