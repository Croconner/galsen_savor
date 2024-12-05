package com.galsensavor.dto;
import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginDTO {
    private String email;
    private String password;

}
