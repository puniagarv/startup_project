package com.intern.project.startup.Service;

import com.intern.project.startup.Entity.User;
import com.intern.project.startup.Exceptions.UserAlreadyExistsException;
import com.intern.project.startup.Exceptions.UserSaveException;
import com.intern.project.startup.Registration.RegistrationRequest;
import com.intern.project.startup.Registration.VerificationToken;
import com.intern.project.startup.Repo.UserRepo;
import com.intern.project.startup.Repo.VerificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserInterface {

    @Autowired
    private VerificationRepo verificationRepo;


    @Autowired
    private UserRepo userRepo;

   @Autowired
   private User newUser;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUser() {
        return userRepo.findAll();
    }

    @Override
    public User registerUser(RegistrationRequest request) {
        Optional<User> user = userRepo.findByEmailId(request.getEmail());
        System.out.println(request.getFirstName());
        if(user.isPresent()){
            throw new UserAlreadyExistsException("User Already Exists");
        }

        newUser.setRegisterType(request.getRegisterType());
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmailId(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setDob(request.getDob());
        newUser.setGender(request.getGender());
        newUser.setPhoneNumber(request.getMobile());
        userRepo.save(newUser);

        return newUser;

    }

    @Override
    public Optional<User> findByEmailId(String email) {
        return userRepo.findByEmailId(email);
    }

    @Override
    public void saveUserVerificationToken(User user, String verificationToken) {

        VerificationToken newToken = new VerificationToken(verificationToken,user);
        verificationRepo.save(newToken);

    }

    @Override
    public void saveUser(User user) {
        try {
            userRepo.save(user);
        } catch (Exception e) {
            throw new UserSaveException("Error occurred while saving the user: " + user.getEmailId(), e);
        }
    }

    @Override
    public String validateToken(VerificationToken theToken) {
        String tokenString = theToken.getToken();
        VerificationToken token  = verificationRepo.findByToken(tokenString);
        if(token == null){
            return "Invalid verification token";
        }
        User user = token.getUser();
        Calendar calendar = Calendar.getInstance();
        if ((token.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0){
            verificationRepo.delete(token);
            userRepo.delete(theToken.getUser());
            return "Token already expired";
        }
        user.setEnabled(true);
        userRepo.save(user);
        return "valid";
    }


}
