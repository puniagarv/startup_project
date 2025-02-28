package com.intern.project.startup.service;

import com.intern.project.startup.entity.Role;
import com.intern.project.startup.entity.UserWithRoles;
import com.intern.project.startup.exceptions.UserAlreadyExistsException;
import com.intern.project.startup.repo.RoleRepo;
import com.intern.project.startup.repo.UserWithRolesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserWithRolesService implements IUserWithRoles {

     @Autowired
     private UserWithRolesRepo userWithRolesRepo;

     @Autowired
     private RoleRepo roleRepo;


    @Override
    public UserWithRoles saveUserRole(UserWithRoles userWithRoles) {
        System.out.println("Before Fetching Roles: " + userWithRoles.getRoles());

        // Fetch roles from database
        Set<Role> updatedRoles = userWithRoles.getRoles().stream()
                .map(role -> {
                    Role existingRole = roleRepo.findByRoleName(role.getRoleName().toLowerCase())
                            .orElseThrow(() -> new RuntimeException("Role not found: " + role.getRoleName()));
                    System.out.println("Mapped Role: " + existingRole.getRoleName());
                    return existingRole;
                })
                .collect(Collectors.toSet());

        userWithRoles.setRoles(updatedRoles);

        System.out.println("After Setting Roles: " + userWithRoles.getRoles());

        // Save user with roles
        try{
            return userWithRolesRepo.save(userWithRoles);
        }catch (DataIntegrityViolationException e){
            throw new UserAlreadyExistsException("User with email " + userWithRoles.getEmailId() + " already exists.");
        }
    }




    @Override
    public List<UserWithRoles> getAll() {
        return userWithRolesRepo.findAll();
    }

}
