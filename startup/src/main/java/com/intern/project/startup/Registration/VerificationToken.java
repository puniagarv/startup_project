package com.intern.project.startup.Registration;

import com.intern.project.startup.Entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Calendar;
import java.util.Date;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class VerificationToken {

    @Id // Use `jakarta.persistence.Id` instead of `org.springframework.data.annotation.Id`
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private Date expirationTime;

    private static final int ExpirationTime = 10;

    public VerificationToken(String token, User user) {
        super();
        this.token = token;
        this.expirationTime = this.getTokenExpirationTime();
        this.user = user;
    }

    public VerificationToken(String token) {
        super();
        this.token = token;
        this.expirationTime = this.getTokenExpirationTime();
    }

    private Date getTokenExpirationTime() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, ExpirationTime);
        return new Date(calendar.getTime().getTime());
    }

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public boolean isExpired() {
        return new Date().after(this.expirationTime); // Proper expiration logic
    }
}
