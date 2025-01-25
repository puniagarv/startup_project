package com.intern.project.startup.Service;

import com.intern.project.startup.Entity.User;
import com.intern.project.startup.Registration.RegistrationRequest;
import com.intern.project.startup.Registration.VerificationToken;

import java.util.List;
import java.util.Optional;

public interface IUserInterface {

   List<User> getUser();




   User registerUser(RegistrationRequest request);

   Optional<User> findByEmailId(String email);

   void saveUserVerificationToken(User user, String verificationToken);

   void saveUser(User user);

   String validateToken(VerificationToken theToken);
}
