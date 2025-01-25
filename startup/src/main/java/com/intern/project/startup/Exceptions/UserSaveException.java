package com.intern.project.startup.Exceptions;

public class UserSaveException extends RuntimeException {
    public UserSaveException(String message) {
        super(message);
    }

    public UserSaveException(String message, Throwable cause) {
        super(message, cause);
    }
}
