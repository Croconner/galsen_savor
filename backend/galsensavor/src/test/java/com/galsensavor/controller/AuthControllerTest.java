package com.galsensavor.controller;

import com.galsensavor.dto.LoginDTO;
import com.galsensavor.dto.UserDTO;
import com.galsensavor.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void registerUser_Success() {
        UserDTO userDto = new UserDTO();
        userDto.setEmail("test@galsensavor.com");

        when(userService.createUser(any(UserDTO.class))).thenReturn(new ResponseEntity<>("{\"message\":\"Sign Up successfully\"}", HttpStatus.OK));

        ResponseEntity<String> response = authController.registerUser(userDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"message\":\"Sign Up successfully\"}", response.getBody());
    }

    @Test
    public void login_Success() {
        LoginDTO loginDto = new LoginDTO();
        loginDto.setEmail("test@galsensavor.com");
        loginDto.setPassword("password");

        UserDTO userDto = new UserDTO();
        userDto.setEmail("test@galsensavor.com");

        when(userService.login(anyString(), anyString())).thenReturn(new ResponseEntity<>(userDto, HttpStatus.ACCEPTED));

        ResponseEntity<UserDTO> response = authController.login(loginDto);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertEquals(userDto, response.getBody());
    }

    @Test
    public void login_EmailNotFound() {
        LoginDTO loginDto = new LoginDTO();
        loginDto.setEmail("nonexistent@galsensavor.com");
        loginDto.setPassword("password");

        when(userService.login(anyString(), anyString())).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Email does not exists."));

        try {
            authController.login(loginDto);
        } catch (ResponseStatusException ex) {
            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            assertEquals("Email does not exists.", ex.getReason());
        }
    }

    @Test
    public void login_InvalidPassword() {
        LoginDTO loginDto = new LoginDTO();
        loginDto.setEmail("test@galsensavor.com");
        loginDto.setPassword("wrongpassword");

        when(userService.login(anyString(), anyString())).thenThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password"));

        try {
            authController.login(loginDto);
        } catch (ResponseStatusException ex) {
            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
            assertEquals("Invalid password", ex.getReason());
        }
    }
}
