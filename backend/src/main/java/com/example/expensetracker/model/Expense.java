package com.example.expensetracker.model;

import java.time.Instant;

/**
 * Domain model representing a single expense record stored in Firestore.
 */
public class Expense {

    /** Firestore document ID (auto-generated UUID). */
    private String id;

    /** Short, descriptive title for the expense. */
    private String title;

    /** Optional additional notes or description. */
    private String description;

    /** Monetary amount spent (must be > 0). */
    private Double amount;

    /**
     * Expense category.
     * Allowed values: Food, Transport, Shopping, Education, Bills,
     * Entertainment, Health, Travel, Groceries, Other
     */
    private String category;

    /**
     * Payment method used.
     * Allowed values: Cash, UPI, Debit Card, Credit Card, Bank Transfer, Other
     */
    private String paymentMethod;

    /** ISO-8601 date string (e.g. "2024-06-15") when the expense occurred. */
    private String date;

    /** Timestamp when this record was created in Firestore. */
    private Instant createdAt;

    /** Timestamp when this record was last updated in Firestore. */
    private Instant updatedAt;

    // ──────────────────────── Constructors ────────────────────────

    public Expense() {}

    public Expense(String id, String title, String description, Double amount,
                   String category, String paymentMethod, String date,
                   Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.paymentMethod = paymentMethod;
        this.date = date;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ──────────────────────── Getters & Setters ────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Expense{id='" + id + "', title='" + title + "', amount=" + amount +
               ", category='" + category + "', date='" + date + "'}";
    }
}
