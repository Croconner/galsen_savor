package com.galsensavor.dto;

import java.util.Set;

import com.galsensavor.model.Role;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Set<Role> roles;

}
