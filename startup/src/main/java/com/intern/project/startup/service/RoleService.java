package com.intern.project.startup.service;

import com.intern.project.startup.entity.Role;
import com.intern.project.startup.entity.UserWithRoles;
import com.intern.project.startup.exceptions.RoleAlreadyExistsException;
import com.intern.project.startup.exceptions.RoleNotFoundException;
import com.intern.project.startup.repo.RoleRepo;
import com.intern.project.startup.repo.UserWithRolesRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService implements IRoleInterface {

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private UserWithRolesRepo userWithRolesRepo;

    @Override
    public List<Role> getRoles() {
        return roleRepo.findAll();
    }

    @Override
    public Optional<Role> findByRoleName(String roleName) {
        return roleRepo.findByRoleName(roleName.toLowerCase());
    }

    @Override
    @Transactional
    public Role saveRole(Role role) {
        if (roleRepo.findByRoleName(role.getRoleName()).isPresent()) {
            throw new RoleAlreadyExistsException("Role '" + role.getRoleName() + "' already exists!");
        }
        role.setRoleName(role.getRoleName().toLowerCase());
        return roleRepo.save(role);
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepo.findById(id)
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));

        // Remove role from all users
        List<UserWithRoles> users = userWithRolesRepo.findAll();
        for (UserWithRoles user : users) {
            if (user.getRoles() != null && user.getRoles().contains(role)) {
                user.getRoles().remove(role);
                userWithRolesRepo.save(user);
            }
        }

        // Delete role mappings and role itself
        userWithRolesRepo.deleteUserRoleMappings(id);
        roleRepo.deleteRoleById(id);
    }

    @Override
    @Transactional
    public void updateRole(Role role) {
        Role existingRole = roleRepo.findById(role.getId())
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));

        if (!existingRole.getRoleName().equals(role.getRoleName())) {
            if (roleRepo.findByRoleName(role.getRoleName()).isPresent()) {
                throw new RoleAlreadyExistsException("Role name already exists. Choose a different name.");
            }
            existingRole.setRoleName(role.getRoleName());
        }

        if (existingRole.isStatus() != role.isStatus()) {
            existingRole.setStatus(role.isStatus());
        }

        roleRepo.save(existingRole);
    }
}
