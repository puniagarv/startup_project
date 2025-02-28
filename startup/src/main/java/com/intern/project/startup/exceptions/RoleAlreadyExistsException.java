package com.intern.project.startup.exceptions;

public class RoleAlreadyExistsException extends RuntimeException{

    public RoleAlreadyExistsException(String message){
         super(message);
    }
}
