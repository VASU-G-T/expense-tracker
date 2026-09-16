package com.example.expensetracker.dto;

import jakarta.validation.constraints.*;

import java.util.List;

/**
 * Data Transfer Object for creating or updating an Expense.
 * All validation constraints are enforced by the Spring validation layer
 * before the request reaches the service.
 */
public class ExpenseRequest {

    /** Valid expense categories */
    public static final List<String> VALID_CATEGORIES = List.of(
            "Food", "Transport", "Shopping", "Education", "Bills",
            "Entertainment", "Health", "Travel", "Groceries", "Other"
    );

    /** Valid payment methods */
    public static final List<String> VALID_PAYMENT_METHODS = List.of(
            "Cash", "UPI", "Debit Card", "Credit Card", "Bank Transfer", "Other"
    );

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    @DecimalMax(value = "999999999.99", message = "Amount exceeds maximum allowed value")
    private Double amount;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotBlank(message = "Date is required")
    @Pattern(
        regexp = "^\\d{4}-\\d{2}-\\d{2}$",
        message = "Date must be in YYYY-MM-DD format"
    )
    private String date;

    // ──────────────────────── Getters & Setters ────────────────────────

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title != null ? title.trim() : null; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description != null ? description.trim() : null;
    }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
