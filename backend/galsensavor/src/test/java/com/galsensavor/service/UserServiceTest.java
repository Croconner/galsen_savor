package com.galsensavor.service;

import com.galsensavor.dto.UserDTO;
import com.galsensavor.model.Role;
import com.galsensavor.model.RoleName;
import com.galsensavor.model.User;
import com.galsensavor.repository.RoleRepository;
import com.galsensavor.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private User user2;

    private Role role;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@galsensavor.com")
                .password("password")
                .build();
        user2 = User.builder()
                .firstName("Sherlock")
                .lastName("Holmes")
                .email("thegreatdetective@gmail.com")
                .password("sherlocked")
                .password("password")
                .build();

        role = Role.builder()
                .name(RoleName.ADMIN)
                .build();

    }

    @Test
    public void UserService_CreateUser_ReturnsResponseEntityOk() {
        UserDTO userDto = UserDTO.builder()
                .firstName("Sherlock")
                .lastName("Holmes")
                .email("thegreatdetective@gmail.com")
                .password("password")
                .build();

        when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.empty());
        when(roleRepository.findByName(RoleName.CUSTOMER)).thenReturn(role);
        when(userRepository.save(Mockito.any(User.class))).thenReturn(user2);

        ResponseEntity<String> response = userService.createUser(userDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"message\":\"Sign Up successfully\"}", response.getBody());
    }


    @Test
    public void UserService_CreateUser_ReturnsConflictIfEmailExists() {
        UserDTO userDto = UserDTO.builder()
                .firstName("Sherlock")
                .lastName("Holmes")
                .email("thegreatdetective@gmail.com")
                .password("password")
                .build();

        when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user2));

        try {
            userService.createUser(userDto);
        } catch (ResponseStatusException ex) {
            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
            assertEquals("User already exists!", ex.getReason());
        }
    }


    @Test
    public void UserService_Login_ReturnsAccepted() {
        when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));

        ResponseEntity<UserDTO> response = userService.login("john.doe@galsensavor.com", "password");

        assertNotNull(response);
        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void UserService_Login_ReturnsNotFoundIfEmailDoesNotExist() {
        when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.empty());

        try {
            userService.login("john.doe@galsensavor.com", "password");
        } catch (ResponseStatusException ex) {
            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            assertEquals("Email does not exists.", ex.getReason());
        }
    }

    @Test
    public void UserService_Login_ReturnsUnauthorizedIfPasswordIsIncorrect() {
        when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));

        try {
            userService.login("john.doe@galsensavor.com", "wrongpassword");
        } catch (ResponseStatusException ex) {
            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
            assertEquals("Invalid password", ex.getReason());
        }
    }

}