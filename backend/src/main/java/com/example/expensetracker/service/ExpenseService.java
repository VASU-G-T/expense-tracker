package com.example.expensetracker.service;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.exception.ExpenseNotFoundException;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic layer for expense operations.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Validate category and payment method against allowed values</li>
 *   <li>Map {@link ExpenseRequest} DTOs to {@link Expense} domain objects</li>
 *   <li>Delegate persistence to {@link ExpenseRepository}</li>
 *   <li>Throw domain exceptions that the controller and exception handler will convert to HTTP responses</li>
 * </ul>
 */
@Service
public class ExpenseService {

    private static final Logger log = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    // ──────────────────────── CREATE ────────────────────────

    /**
     * Creates a new expense after validating business rules.
     *
     * @param request the validated create request DTO
     * @return the persisted expense with assigned id and timestamps
     */
    public Expense createExpense(ExpenseRequest request) {
        validateCategoryAndPaymentMethod(request);
        Expense expense = mapToExpense(request);
        Expense saved = repository.save(expense);
        log.info("Created expense: id={}, title='{}', amount={}", saved.getId(), saved.getTitle(), saved.getAmount());
        return saved;
    }

    // ──────────────────────── READ ────────────────────────

    /**
     * Returns all expenses ordered by date descending.
     *
     * @return list of all expenses
     */
    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    /**
     * Returns a single expense by ID.
     *
     * @param id Firestore document ID
     * @return the matching expense
     * @throws ExpenseNotFoundException if no expense exists with that ID
     */
    public Expense getExpenseById(String id) {
        Expense expense = repository.findById(id);
        if (expense == null) {
            throw new ExpenseNotFoundException(id);
        }
        return expense;
    }

    // ──────────────────────── UPDATE ────────────────────────

    /**
     * Updates an existing expense.
     *
     * @param id      the Firestore document ID
     * @param request the validated update request DTO
     * @return the updated expense
     * @throws ExpenseNotFoundException if no expense exists with that ID
     */
    public Expense updateExpense(String id, ExpenseRequest request) {
        if (!repository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        validateCategoryAndPaymentMethod(request);
        Expense expense = mapToExpense(request);
        Expense updated = repository.update(id, expense);
        log.info("Updated expense: id={}", id);
        return updated;
    }

    // ──────────────────────── DELETE ────────────────────────

    /**
     * Deletes an expense by ID.
     *
     * @param id the Firestore document ID
     * @throws ExpenseNotFoundException if no expense exists with that ID
     */
    public void deleteExpense(String id) {
        if (!repository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        repository.deleteById(id);
        log.info("Deleted expense: id={}", id);
    }

    // ──────────────────────── Private Helpers ────────────────────────

    private void validateCategoryAndPaymentMethod(ExpenseRequest request) {
        if (!ExpenseRequest.VALID_CATEGORIES.contains(request.getCategory())) {
            throw new IllegalArgumentException(
                "Invalid category '" + request.getCategory() + "'. Allowed: " + ExpenseRequest.VALID_CATEGORIES
            );
        }
        if (!ExpenseRequest.VALID_PAYMENT_METHODS.contains(request.getPaymentMethod())) {
            throw new IllegalArgumentException(
                "Invalid payment method '" + request.getPaymentMethod() + "'. Allowed: " + ExpenseRequest.VALID_PAYMENT_METHODS
            );
        }
    }

    private Expense mapToExpense(ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setDate(request.getDate());
        return expense;
    }
}
