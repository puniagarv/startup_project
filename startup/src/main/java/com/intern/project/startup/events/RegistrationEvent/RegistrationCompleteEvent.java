package com.intern.project.startup.events.RegistrationEvent;

import com.intern.project.startup.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class RegistrationCompleteEvent extends ApplicationEvent {

    private User user;
    private String applicationUrl;

   public RegistrationCompleteEvent(User user, String applicationUrl){
       super(user);
       this.applicationUrl = applicationUrl;
       this.user = user;
   }


}
