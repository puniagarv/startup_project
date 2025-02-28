package com.intern.project.startup.service;

import com.intern.project.startup.entity.UserWithRoles;

import java.util.List;

public interface IUserWithRoles {
    UserWithRoles saveUserRole(UserWithRoles userWithRoles);
    List<UserWithRoles> getAll();

}
