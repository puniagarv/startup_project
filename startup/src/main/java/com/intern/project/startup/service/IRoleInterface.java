package com.intern.project.startup.service;

import com.intern.project.startup.entity.Role;

import java.util.List;
import java.util.Optional;

public interface IRoleInterface {

    List<Role> getRoles();
    Optional<Role> findByRoleName(String roleName);
    Role saveRole(Role role);
    void deleteRole(Long id);
    void updateRole(Role role);
}


