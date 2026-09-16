package com.example.expensetracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when an expense with the given ID is not found in Firestore.
 * Mapped to HTTP 404 Not Found by {@link GlobalExceptionHandler}.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ExpenseNotFoundException extends RuntimeException {

    private final String expenseId;

    public ExpenseNotFoundException(String id) {
        super("Expense not found with id: " + id);
        this.expenseId = id;
    }

    public String getExpenseId() {
        return expenseId;
    }
}
