package com.example.expensetracker.controller;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.exception.ExpenseNotFoundException;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for {@link ExpenseController}.
 * Mocks the service layer; tests HTTP status codes and response structure.
 */
@WebMvcTest(ExpenseController.class)
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExpenseService expenseService;

    // FirebaseConfig depends on Firestore — mock it to prevent bean creation
    @MockBean
    private com.google.cloud.firestore.Firestore firestore;

    @Autowired
    private ObjectMapper objectMapper;

    private Expense sampleExpense;

    @BeforeEach
    void setUp() {
        sampleExpense = new Expense(
            "test-id-001", "Grocery Run", "Weekly groceries", 1250.50,
            "Groceries", "UPI", "2024-06-15", Instant.now(), Instant.now()
        );
    }

    // ──────────────────────── POST Tests ────────────────────────

    @Test
    @DisplayName("POST /api/expenses — valid request returns 201 Created")
    void createExpense_validRequest_returns201() throws Exception {
        when(expenseService.createExpense(any())).thenReturn(sampleExpense);

        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validExpenseJson()))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.title").value("Grocery Run"))
            .andExpect(jsonPath("$.data.id").value("test-id-001"));
    }

    @Test
    @DisplayName("POST /api/expenses — empty title returns 400 Bad Request")
    void createExpense_emptyTitle_returns400() throws Exception {
        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "title": "", "amount": 500, "category": "Food",
                      "paymentMethod": "Cash", "date": "2024-06-15" }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/expenses — negative amount returns 400 Bad Request")
    void createExpense_negativeAmount_returns400() throws Exception {
        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "title": "Test", "amount": -100, "category": "Food",
                      "paymentMethod": "Cash", "date": "2024-06-15" }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/expenses — zero amount returns 400 Bad Request")
    void createExpense_zeroAmount_returns400() throws Exception {
        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "title": "Test", "amount": 0, "category": "Food",
                      "paymentMethod": "Cash", "date": "2024-06-15" }
                    """))
            .andExpect(status().isBadRequest());
    }

    // ──────────────────────── GET Tests ────────────────────────

    @Test
    @DisplayName("GET /api/expenses — returns 200 OK")
    void getAllExpenses_returns200() throws Exception {
        when(expenseService.getAllExpenses()).thenReturn(java.util.List.of(sampleExpense));

        mockMvc.perform(get("/api/expenses"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("GET /api/expenses/{id} — existing ID returns 200 OK")
    void getExpenseById_existingId_returns200() throws Exception {
        when(expenseService.getExpenseById("test-id-001")).thenReturn(sampleExpense);

        mockMvc.perform(get("/api/expenses/test-id-001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").value("test-id-001"));
    }

    @Test
    @DisplayName("GET /api/expenses/{id} — unknown ID returns 404 Not Found")
    void getExpenseById_unknownId_returns404() throws Exception {
        when(expenseService.getExpenseById("nonexistent")).thenThrow(new ExpenseNotFoundException("nonexistent"));

        mockMvc.perform(get("/api/expenses/nonexistent"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false));
    }

    // ──────────────────────── PUT Tests ────────────────────────

    @Test
    @DisplayName("PUT /api/expenses/{id} — valid request returns 200 OK")
    void updateExpense_validRequest_returns200() throws Exception {
        when(expenseService.updateExpense(eq("test-id-001"), any())).thenReturn(sampleExpense);

        mockMvc.perform(put("/api/expenses/test-id-001")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validExpenseJson()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("PUT /api/expenses/{id} — unknown ID returns 404 Not Found")
    void updateExpense_unknownId_returns404() throws Exception {
        when(expenseService.updateExpense(eq("bad-id"), any()))
            .thenThrow(new ExpenseNotFoundException("bad-id"));

        mockMvc.perform(put("/api/expenses/bad-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validExpenseJson()))
            .andExpect(status().isNotFound());
    }

    // ──────────────────────── DELETE Tests ────────────────────────

    @Test
    @DisplayName("DELETE /api/expenses/{id} — existing ID returns 200 OK")
    void deleteExpense_existingId_returns200() throws Exception {
        doNothing().when(expenseService).deleteExpense("test-id-001");

        mockMvc.perform(delete("/api/expenses/test-id-001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /api/expenses/{id} — unknown ID returns 404 Not Found")
    void deleteExpense_unknownId_returns404() throws Exception {
        doThrow(new ExpenseNotFoundException("gone-id")).when(expenseService).deleteExpense("gone-id");

        mockMvc.perform(delete("/api/expenses/gone-id"))
            .andExpect(status().isNotFound());
    }

    // ──────────────────────── Helpers ────────────────────────

    private String validExpenseJson() {
        return """
            {
              "title": "Grocery Run",
              "description": "Weekly groceries",
              "amount": 1250.50,
              "category": "Groceries",
              "paymentMethod": "UPI",
              "date": "2024-06-15"
            }
            """;
    }
}
