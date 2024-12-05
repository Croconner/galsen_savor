package com.galsensavor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "roles")
public class Role {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleName name;


}

