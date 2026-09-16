package com.example.expensetracker.controller;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.response.ApiResponse;
import com.example.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing the Expense Tracker CRUD API.
 *
 * <pre>
 * POST   /api/expenses           Create a new expense
 * GET    /api/expenses           Get all expenses
 * GET    /api/expenses/{id}      Get single expense by ID
 * PUT    /api/expenses/{id}      Update an existing expense
 * DELETE /api/expenses/{id}      Delete an expense
 * </pre>
 */
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // ──────────────────────── POST /api/expenses ────────────────────────

    /**
     * Creates a new expense.
     *
     * @param request validated expense payload
     * @return 201 Created with the persisted expense
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(@Valid @RequestBody ExpenseRequest request) {
        Expense created = service.createExpense(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense created successfully", created));
    }

    // ──────────────────────── GET /api/expenses ────────────────────────

    /**
     * Retrieves all expenses ordered by date descending.
     *
     * @return 200 OK with list of all expenses
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getAllExpenses() {
        List<Expense> expenses = service.getAllExpenses();
        String message = expenses.isEmpty() ? "No expenses found" : "Expenses retrieved successfully";
        return ResponseEntity.ok(ApiResponse.success(message, expenses));
    }

    // ──────────────────────── GET /api/expenses/{id} ────────────────────────

    /**
     * Retrieves a single expense by its Firestore document ID.
     *
     * @param id the document ID
     * @return 200 OK with the expense, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> getExpenseById(@PathVariable String id) {
        Expense expense = service.getExpenseById(id);
        return ResponseEntity.ok(ApiResponse.success("Expense retrieved successfully", expense));
    }

    // ──────────────────────── PUT /api/expenses/{id} ────────────────────────

    /**
     * Updates an existing expense.
     *
     * @param id      the document ID
     * @param request validated update payload
     * @return 200 OK with the updated expense, or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> updateExpense(
            @PathVariable String id,
            @Valid @RequestBody ExpenseRequest request) {
        Expense updated = service.updateExpense(id, request);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", updated));
    }

    // ──────────────────────── DELETE /api/expenses/{id} ────────────────────────

    /**
     * Deletes an expense by its Firestore document ID.
     *
     * @param id the document ID
     * @return 200 OK confirmation, or 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable String id) {
        service.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully"));
    }
}
