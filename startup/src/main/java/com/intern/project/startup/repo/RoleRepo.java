package com.intern.project.startup.repo;

import com.intern.project.startup.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleName(String roleName);
    void deleteByRoleName(String roleName); // Spring Data JPA derived method

    @Modifying
    @Transactional
    @Query("DELETE FROM Role r WHERE r.roleName = :roleName")
    void deleteRoleByRoleName(@Param("roleName") String roleName);

    void deleteRoleById(Long id);
}
