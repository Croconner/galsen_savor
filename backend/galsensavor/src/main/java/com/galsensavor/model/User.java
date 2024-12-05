package com.galsensavor.model;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;


@Builder
@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "roles")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    @OneToMany
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Set<Role> roles;

}
