package com.intern.project.startup.repo;

import com.intern.project.startup.entity.Role;
import com.intern.project.startup.entity.UserWithRoles;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserWithRolesRepo extends JpaRepository<UserWithRoles, Long> {

    Optional<UserWithRoles> findByEmailId(String emailId);

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM user_roles WHERE role_id = :roleId", nativeQuery = true)
    void deleteUserRoleMappings(@Param("roleId") Long roleId);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserWithRoles u WHERE :role MEMBER OF u.roles")
    void deleteUsersByRole(@Param("role") Role role);
}
