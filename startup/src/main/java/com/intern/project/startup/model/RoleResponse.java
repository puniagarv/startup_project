package com.intern.project.startup.model;

import com.intern.project.startup.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponse {

    private String message;
    private String status;
    private Role role;

    public RoleResponse(String message, String status) {
        this.message = message;
        this.status = status;
        this.role = null;
    }
}
