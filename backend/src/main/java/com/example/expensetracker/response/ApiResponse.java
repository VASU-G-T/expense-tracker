package com.example.expensetracker.response;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standardized API response envelope for all REST endpoints.
 *
 * <pre>
 * Success:  { "success": true,  "message": "...", "data": {...} }
 * Error:    { "success": false, "message": "...", "error": "..." }
 * </pre>
 *
 * @param <T> the type of the data payload
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String error;

    // ──────────────────────── Constructors ────────────────────────

    private ApiResponse() {}

    // ──────────────────────── Static Factories ────────────────────────

    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> resp = new ApiResponse<>();
        resp.success = true;
        resp.message = message;
        resp.data = data;
        return resp;
    }

    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorDetail) {
        ApiResponse<T> resp = new ApiResponse<>();
        resp.success = false;
        resp.message = message;
        resp.error = errorDetail;
        return resp;
    }

    // ──────────────────────── Getters ────────────────────────

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public String getError() { return error; }
}
