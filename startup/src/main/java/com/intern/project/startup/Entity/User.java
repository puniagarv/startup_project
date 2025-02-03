package com.intern.project.startup.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.NaturalId;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")  // Specify the table name in MySQL
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-generate the primary key
    private Long id;  // Changed to Long to use auto-generated IDs in MySQL

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Past
    private LocalDate dob;

    @NaturalId(mutable = true)
    @Column(unique = true)  // Ensure email is unique in the database
    private String emailId;
    private String gender;
    private String registerType;
    private String phoneNumber;
    private String password;


    private boolean enabled = false;
}
