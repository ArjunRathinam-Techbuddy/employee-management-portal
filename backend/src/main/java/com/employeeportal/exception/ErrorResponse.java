package com.employeeportal.exception;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;

public record ErrorResponse(
        int status,
        String error,
        String message,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
        OffsetDateTime timestamp,
        String path
) {
    public ErrorResponse(int status, String error, String message, String path) {
        this(status, error, message, OffsetDateTime.now(), path);
    }
}
