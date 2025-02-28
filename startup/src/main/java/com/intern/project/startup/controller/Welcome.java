package com.intern.project.startup.controller;

import com.intern.project.startup.entity.Role;
import com.intern.project.startup.entity.UserWithRoles;
import com.intern.project.startup.model.RoleResponse;
import com.intern.project.startup.service.RoleService;
import com.intern.project.startup.service.UserWithRolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
public class Welcome {

    @Autowired
    private RoleService roleService;

    private static final Logger logger = Logger.getLogger(Welcome.class.getName());

    @Autowired
    private UserWithRolesService userWithRolesService;

    @PostMapping("/addRole")
    public ResponseEntity<RoleResponse> saveRole(@RequestBody Role role){
        // Your code for adding user
        System.out.print("hello");
        logger.info("User data: " + role);
        Role roles = roleService.saveRole(role);
        RoleResponse roleResponse = new RoleResponse("Success","Role Added Successfully!!",roles);
        return ResponseEntity.ok(roleResponse);
    }



    @PostMapping("/adduser")
    public ResponseEntity<Map<String,String>> addUser(@RequestBody UserWithRoles userWithRoles) {

            // Your code for adding user
            Map<String,String>response = new HashMap<>();
            logger.info("User data: " + userWithRoles);
            userWithRolesService.saveUserRole(userWithRoles);

            response.put("message","User Added Successfully");
            return ResponseEntity.ok(response);

    }

    @DeleteMapping("/deleteRole/{roleId}")
    public ResponseEntity<String> deleteRole(@PathVariable Long roleId){
        roleService.deleteRole(roleId);
        return ResponseEntity.ok("Role successfully deleted");
    }

    @GetMapping("/getRoles")
    public ResponseEntity<List<Role>> getRoles() {
     /*   System.out.println("aaa rhi h idhr to request");
        */List<Role> roles = roleService.getRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/get/user")
    public ResponseEntity<List<UserWithRoles>> getUsers(){
        List<UserWithRoles> users = userWithRolesService.getAll();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/updateRole")
    public ResponseEntity<Map<String,String>> deleteRole(@RequestBody Role role){
        Map<String,String> response = new HashMap<>();
        response.put("message","RoleName Updated Successfully!!");
        roleService.updateRole(role);
        return ResponseEntity.ok(response);
    }

}
