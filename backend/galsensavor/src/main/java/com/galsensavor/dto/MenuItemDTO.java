package com.galsensavor.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class MenuItemDTO {

    private Long id;

    private String name;

    private String imageUrl;

    private Double price;

    private String description;

    private String category;

    @Builder.Default
    private boolean deleted = false;


}
