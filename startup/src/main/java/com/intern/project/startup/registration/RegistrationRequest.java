package com.intern.project.startup.registration;

import lombok.*;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {
    // Getters and setters
    private String registerType;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String emailId;
    private String password;
    private String phoneNumber;

}

