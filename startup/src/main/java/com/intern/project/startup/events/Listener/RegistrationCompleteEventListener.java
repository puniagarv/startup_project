package com.intern.project.startup.events.Listener;

import com.intern.project.startup.entity.User;
import com.intern.project.startup.events.RegistrationEvent.RegistrationCompleteEvent;
import com.intern.project.startup.jwtUtil.JwtVerificationHelper;
import com.intern.project.startup.service.UserService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {

    @Autowired
    private UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtVerificationHelper jwtVerificationHelper;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        // 1. Get the newly registered user (Fix: No redundant object creation)
        User theUser = event.getUser();

        // 2. Create a verification token for the user
        String JwtToken =  jwtVerificationHelper.generateVerificationToken(theUser.getEmailId());


        // 4. Build the verification URL
        String url = event.getApplicationUrl() + "/register/verifyEmail?token=" + JwtToken;

        // 5. Send the email (Fix: Pass `theUser` to avoid NullPointerException)
        try {
            sendVerificationEmail(theUser, url);
        } catch (MessagingException | UnsupportedEncodingException | jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }

        log.info("Click the link to verify your registration: {}", url);
    }

    // Fix: Pass `theUser` explicitly
    public void sendVerificationEmail(User theUser, String url)
            throws MessagingException, UnsupportedEncodingException, jakarta.mail.MessagingException {
        String subject = "Email Verification";
        String senderName = "User Registration Portal Service";

        String mailContent = "<p> Hi, " + theUser.getFirstName() + ", </p>" +
                "<p>Thank you for registering with us. " +
                "Please, follow the link below to complete your registration.</p>" +
                "<a href=\"" + url + "\">Verify your email to activate your account</a>" +
                "<p> Thank you <br> Users Registration Portal Service</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom("dailycodework@gmail.com", senderName);
        messageHelper.setTo(theUser.getEmailId());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);

        mailSender.send(message);
    }
}
