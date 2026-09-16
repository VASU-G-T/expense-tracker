package com.example.expensetracker.repository;

import com.example.expensetracker.model.Expense;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

/**
 * Firestore-backed repository for {@link Expense} documents.
 * All documents live in the "expenses" top-level collection.
 */
@Repository
public class ExpenseRepository {

    private static final Logger log = LoggerFactory.getLogger(ExpenseRepository.class);
    private static final String COLLECTION = "expenses";

    private final Firestore db;

    public ExpenseRepository(Firestore db) {
        this.db = db;
    }

    // ──────────────────────── CREATE ────────────────────────

    /**
     * Saves a new expense to Firestore with an auto-generated UUID as document ID.
     *
     * @param expense the expense to persist (id will be set by this method)
     * @return the saved expense with its assigned id
     */
    public Expense save(Expense expense) {
        try {
            String id = UUID.randomUUID().toString();
            expense.setId(id);

            Instant now = Instant.now();
            expense.setCreatedAt(now);
            expense.setUpdatedAt(now);

            db.collection(COLLECTION)
              .document(id)
              .set(toMap(expense))
              .get();

            log.info("Saved expense id={}", id);
            return expense;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to save expense: " + e.getMessage(), e);
        }
    }

    // ──────────────────────── READ ────────────────────────

    /**
     * Retrieves all expenses ordered by date descending.
     *
     * @return list of all expenses (empty list if none exist)
     */
    public List<Expense> findAll() {
        try {
            ApiFuture<QuerySnapshot> future = db.collection(COLLECTION)
                    .orderBy("date", Query.Direction.DESCENDING)
                    .get();
            List<Expense> expenses = new ArrayList<>();
            for (DocumentSnapshot doc : future.get().getDocuments()) {
                expenses.add(fromDocument(doc));
            }
            log.info("Retrieved {} expenses", expenses.size());
            return expenses;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to retrieve expenses: " + e.getMessage(), e);
        }
    }

    /**
     * Finds a single expense by Firestore document ID.
     *
     * @param id the document ID
     * @return the expense if found, or {@code null}
     */
    public Expense findById(String id) {
        try {
            DocumentSnapshot doc = db.collection(COLLECTION).document(id).get().get();
            if (!doc.exists()) {
                return null;
            }
            return fromDocument(doc);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to retrieve expense: " + e.getMessage(), e);
        }
    }

    /**
     * Checks whether an expense with the given ID exists.
     *
     * @param id the document ID
     * @return {@code true} if the document exists
     */
    public boolean existsById(String id) {
        try {
            return db.collection(COLLECTION).document(id).get().get().exists();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to check expense existence: " + e.getMessage(), e);
        }
    }

    // ──────────────────────── UPDATE ────────────────────────

    /**
     * Replaces a Firestore document with the updated expense fields.
     * Preserves the original {@code createdAt} timestamp.
     *
     * @param id      the document ID to update
     * @param expense the updated expense (createdAt is ignored — fetched from DB)
     * @return the fully updated expense with server-side updatedAt
     */
    public Expense update(String id, Expense expense) {
        try {
            // Preserve original createdAt
            DocumentSnapshot existing = db.collection(COLLECTION).document(id).get().get();
            Instant createdAt = existing.exists() && existing.get("createdAt") != null
                    ? Instant.ofEpochMilli(((com.google.cloud.Timestamp) existing.get("createdAt")).toDate().getTime())
                    : Instant.now();

            expense.setId(id);
            expense.setCreatedAt(createdAt);
            expense.setUpdatedAt(Instant.now());

            db.collection(COLLECTION).document(id).set(toMap(expense)).get();
            log.info("Updated expense id={}", id);
            return expense;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to update expense: " + e.getMessage(), e);
        }
    }

    // ──────────────────────── DELETE ────────────────────────

    /**
     * Deletes the expense document with the given ID.
     *
     * @param id the document ID
     */
    public void deleteById(String id) {
        try {
            db.collection(COLLECTION).document(id).delete().get();
            log.info("Deleted expense id={}", id);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to delete expense: " + e.getMessage(), e);
        }
    }

    // ──────────────────────── Helpers ────────────────────────

    private Map<String, Object> toMap(Expense expense) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",            expense.getId());
        map.put("title",         expense.getTitle());
        map.put("description",   expense.getDescription() != null ? expense.getDescription() : "");
        map.put("amount",        expense.getAmount());
        map.put("category",      expense.getCategory());
        map.put("paymentMethod", expense.getPaymentMethod());
        map.put("date",          expense.getDate());
        map.put("createdAt",     com.google.cloud.Timestamp.ofTimeSecondsAndNanos(
                expense.getCreatedAt().getEpochSecond(),
                expense.getCreatedAt().getNano()));
        map.put("updatedAt",     com.google.cloud.Timestamp.ofTimeSecondsAndNanos(
                expense.getUpdatedAt().getEpochSecond(),
                expense.getUpdatedAt().getNano()));
        return map;
    }

    private Expense fromDocument(DocumentSnapshot doc) {
        Expense e = new Expense();
        e.setId(doc.getId());
        e.setTitle(doc.getString("title"));
        e.setDescription(doc.getString("description"));
        e.setAmount(doc.getDouble("amount"));
        e.setCategory(doc.getString("category"));
        e.setPaymentMethod(doc.getString("paymentMethod"));
        e.setDate(doc.getString("date"));

        com.google.cloud.Timestamp createdAt = doc.get("createdAt", com.google.cloud.Timestamp.class);
        com.google.cloud.Timestamp updatedAt = doc.get("updatedAt", com.google.cloud.Timestamp.class);
        if (createdAt != null) e.setCreatedAt(createdAt.toDate().toInstant());
        if (updatedAt != null) e.setUpdatedAt(updatedAt.toDate().toInstant());

        return e;
    }
}
