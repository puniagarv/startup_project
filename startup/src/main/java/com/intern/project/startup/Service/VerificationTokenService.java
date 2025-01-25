package com.intern.project.startup.Service;

import com.intern.project.startup.Entity.User;
import com.intern.project.startup.Registration.VerificationToken;
import com.intern.project.startup.Repo.VerificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificationTokenService {

    @Autowired
    private VerificationRepo tokenRepo;

    public void saveVerificationTokenForUser(String token, User user) {
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepo.save(verificationToken);
    }

    public VerificationToken findByToken(String token) {
        return tokenRepo.findByToken(token);
    }
}
