package com.intern.project.startup.security;

import com.intern.project.startup.entity.User;
import com.intern.project.startup.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserRegistrationDetailsService implements UserDetailsService {

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
