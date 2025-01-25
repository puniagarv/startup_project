package com.intern.project.startup.Controller;

import com.intern.project.startup.Entity.User;
import com.intern.project.startup.Registration.RegistrationRequest;
import com.intern.project.startup.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class userController {

    @Autowired
    private UserService userService;

    @GetMapping("/register/signup")
    private String showpage(Model model){
        return "signup";
    }

//    @GetMapping("/register/login")
//    private String loginpage(Model model){
//         return "login";
//    }

    @GetMapping("/login")
    private String loginpage(Model model){
        return "login";
    }
}
