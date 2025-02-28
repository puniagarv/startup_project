package com.intern.project.startup.service;

import com.intern.project.startup.entity.User;
import com.intern.project.startup.registration.RegistrationRequest;

import java.util.List;
import java.util.Optional;

public interface IUserInterface {

   List<User> getUser();

   User registerUser(RegistrationRequest request);

   Optional<User> findByEmailId(String email);

   void saveUser(User user);

}
