package com.intern.project.startup.controller;

import com.intern.project.startup.entity.User;
import com.intern.project.startup.events.RegistrationEvent.RegistrationCompleteEvent;
import com.intern.project.startup.jwtUtil.JwtVerificationHelper;
import com.intern.project.startup.registration.RegistrationRequest;
import com.intern.project.startup.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/register")
public
class RegistrationController {


    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private JwtVerificationHelper jwtVerificationHelper;

    @PostMapping
    public ResponseEntity<String> registerUser(@RequestBody RegistrationRequest registrationRequest, final HttpServletRequest request){

        if (registrationRequest.getEmailId() == null) {
            return ResponseEntity.badRequest().body("Email Required!!");
        }

        User user = userService.registerUser(registrationRequest);
        System.out.println(registrationRequest.getEmailId());
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));
        return ResponseEntity.ok().body("Success!  Please, check your email for to complete your registration");
    }

    @GetMapping("/verifyEmail")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        String email = jwtVerificationHelper.getEmailFromToken(token);
        Optional<User> theUser = userService.findByEmailId(email);

        if (email.isEmpty() || theUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }

        User user = theUser.get();

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("This account has already been verified, please, login.");
        }

        if (jwtVerificationHelper.validateVerificationToken(token)) {
            user.setEnabled(true);
            userService.saveUser(user);
            return ResponseEntity.ok("Email verified successfully. Now you can login.");
        } else {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }


    }



    public String applicationUrl(HttpServletRequest request) {
        return "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
    }

}