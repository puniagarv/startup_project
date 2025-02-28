package com.intern.project.startup.repo;

import com.intern.project.startup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    boolean existsByEmailId(String userEmailId);
    Optional<User> findByEmailId(String email);
}
