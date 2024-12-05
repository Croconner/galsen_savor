package com.galsensavor.service;

import com.galsensavor.config.EntityDtoMapper;
import com.galsensavor.dto.UserDTO;
import com.galsensavor.model.Role;
import com.galsensavor.model.RoleName;
import com.galsensavor.model.User;
import com.galsensavor.repository.RoleRepository;
import com.galsensavor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;


    public ResponseEntity<String> createUser(UserDTO userDto) {
        //check if email already exists, throw error if it does
        userRepository.findByEmail(userDto.getEmail())
                .ifPresent(existingUser -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists!" );
                });

        // assign role to the user based on the email received
        Set<Role> roles = new HashSet<>();
        if (userDto.getEmail().endsWith("@galsensavor.com")) {
            roles.add(roleRepository.findByName(RoleName.ADMIN));
        } else {
            roles.add(roleRepository.findByName(RoleName.CUSTOMER));
        }
        // convert userdto to user and save it to the database
        User newUser = EntityDtoMapper.userDTOToUser(userDto);
        newUser.setRoles(roles);
        userRepository.save(newUser);
        return ResponseEntity.ok("{\"message\":\"Sign Up successfully\"}");
    }


    public ResponseEntity<UserDTO> login(String email, String password) {
        //verify user exista
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email does not exists."));

        //check if password is same as the one in the database
        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        //convert user entity to user dto and return it
        UserDTO userDTO = EntityDtoMapper.userToUserDTO(user);
        return new ResponseEntity<>(userDTO, HttpStatus.ACCEPTED);
    }
    public ResponseEntity<String> updatePassword(String email, String newPassword) {
        // Check if the user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email does not exist."));

        // Update the password and save the user
        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok("{\"message\":\"Password updated successfully\"}");
    }


}