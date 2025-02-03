package com.intern.project.startup.Repo;

import com.intern.project.startup.Registration.VerificationToken;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRepo extends JpaRepository<VerificationToken,Long> {
     VerificationToken findByToken(String Token);
}
