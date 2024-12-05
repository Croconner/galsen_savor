package com.galsensavor.controller;

import com.galsensavor.dto.LoginDTO;
import com.galsensavor.dto.UserDTO;
import com.galsensavor.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserService userService;


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO newUser) {
        return userService.createUser(newUser);
    }


    @PostMapping("/login")
    public ResponseEntity<UserDTO> login (@RequestBody LoginDTO loginDto) {
        return userService.login(loginDto.getEmail(), loginDto.getPassword());
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> passwordChangeRequest) {
        // Extract email and newPassword from the Map
        String email = passwordChangeRequest.get("email");
        String newPassword = passwordChangeRequest.get("newPassword");

        // Ensure newPassword is being used
        return userService.updatePassword(email, newPassword);
    }


}
