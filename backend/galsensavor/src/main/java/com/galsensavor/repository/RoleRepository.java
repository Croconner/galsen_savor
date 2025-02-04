package com.galsensavor.repository;

import com.galsensavor.model.Role;
import com.galsensavor.model.RoleName;

import org.springframework.data.jpa.repository.JpaRepository;


public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(RoleName name);
}
