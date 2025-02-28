package com.intern.project.startup.service;

import com.intern.project.startup.entity.User;
import com.intern.project.startup.exceptions.UserAlreadyExistsException;
import com.intern.project.startup.exceptions.UserSaveException;
import com.intern.project.startup.registration.RegistrationRequest;
import com.intern.project.startup.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserInterface {

    @Autowired
    private UserRepo userRepo;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUser() {
        return userRepo.findAll();
    }

    @Override
    public User registerUser(RegistrationRequest request) {
        Optional<User> existingUser = userRepo.findByEmailId(request.getEmailId());

        System.out.println(request.getFirstName());
        if(existingUser.isPresent()){
            throw new UserAlreadyExistsException("User Already Exists");
        }

        User newUser = new User();

        newUser.setRegisterType(request.getRegisterType());
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmailId(request.getEmailId());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setDob(request.getDob());
        newUser.setGender(request.getGender());
        newUser.setPhoneNumber(request.getPhoneNumber());
        userRepo.save(newUser);

        return newUser;

    }

    @Override
    public Optional<User> findByEmailId(String email) {
        return userRepo.findByEmailId(email);
    }



    @Override
    public void saveUser(User user) {
        try {
            userRepo.save(user);
        } catch (Exception e) {
            throw new UserSaveException("Error occurred while saving the user: " + user.getEmailId(), e);
        }
    }




}
