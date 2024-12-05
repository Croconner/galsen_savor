package com.galsensavor.dto;
import lombok.Data;

@Data
public class LoginResponseDTO {
    private String message;
    private UserDTO user;

    public LoginResponseDTO(String message) {
        this.message = message;
    }

    public LoginResponseDTO(String message, UserDTO user) {
        this.message = message;
        this.user = user;
    }
}