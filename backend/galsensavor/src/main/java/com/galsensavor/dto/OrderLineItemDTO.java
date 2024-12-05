package com.galsensavor.dto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class OrderLineItemDTO {
    private Long id;
    private MenuItemDTO menuItem;
    private int quantity;
    private double lineItemTotal;



}

