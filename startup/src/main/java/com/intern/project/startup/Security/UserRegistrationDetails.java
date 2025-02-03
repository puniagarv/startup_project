package com.intern.project.startup.Security;

import com.intern.project.startup.Entity.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

@Data
@Component
public class UserRegistrationDetails implements UserDetails {

    private String email;          // Using email instead of username
    private String password;
    private boolean isEnabled;

    public UserRegistrationDetails(User user) {
        this.email = user.getEmailId();   // Email as the unique identifier
        this.password = user.getPassword();
        this.isEnabled = user.isEnabled(); // Reflect email verification status
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return an empty list if no roles/authorities are used
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        // Returning email as the username
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Account is not expired
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Account is not locked
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Credentials are not expired
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Reflect email verification status
        return isEnabled;
    }
}
