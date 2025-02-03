package com.intern.project.startup.Security;

import com.intern.project.startup.Entity.User;
import com.intern.project.startup.Repo.UserRepo;
import jakarta.persistence.Column;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class userRegistrationDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepo.findByEmailId(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found in database"));

        // Return UserDetails object with isEnabled check
        return new org.springframework.security.core.userdetails.User(
                user.getEmailId(),            // Use email as the username
                user.getPassword(),         // Encrypted password from the database
                user.isEnabled(),           // Check if the account is enabled (email verified)
                true,                       // Account is not expired
                true,                       // Credentials are not expired
                true,                       // Account is not locked
                Collections.emptyList()     // No authorities
        );
    }
}
