package com.intern.project.startup.Controller;

import com.intern.project.startup.Entity.User;
import com.intern.project.startup.Events.RegistrationEvent.RegistrationCompleteEvent;
import com.intern.project.startup.Registration.RegistrationRequest;
import com.intern.project.startup.Registration.VerificationToken;
import com.intern.project.startup.Repo.VerificationRepo;
import com.intern.project.startup.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.time.LocalDate;

@Controller
@RequiredArgsConstructor
@RequestMapping("/register")
public
class RegistrationController {


    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private VerificationRepo verificationRepo;

    @PostMapping
    public String registerUser(@ModelAttribute RegistrationRequest registrationRequest, final HttpServletRequest request,Model model){

        if (registrationRequest.getEmail() == null) {
            return "Registration failed: Some fields are missing";
        }

        User user = userService.registerUser(registrationRequest);
        System.out.println(registrationRequest.getEmail());
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));
        model.addAttribute("message","Success!  Please, check your email for to complete your registration");
        return "success";
    }

    @GetMapping("/verifyEmail")
    public String verifyEmail(@RequestParam("token") String token,Model model) {
        VerificationToken theToken = verificationRepo.findByToken(token);
        if (theToken == null) {
            model.addAttribute( "message","Invalid verification token");
        }

        assert theToken != null;
        if (theToken.getUser().isEnabled()) {
            model.addAttribute("message", "This account has already been verified, please, login.");
        }

        String verificationResult = userService.validateToken(theToken);
        if (verificationResult.equalsIgnoreCase("valid")) {
            System.out.print(token);
            model.addAttribute("message","Email verified successfully. Now you can login to your account");
            model.addAttribute("redirectUrl","/login");
        }
        else model.addAttribute("message","Invalid verification token");

        return "verification";
    }



    public String applicationUrl(HttpServletRequest request) {
        return "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
    }

}