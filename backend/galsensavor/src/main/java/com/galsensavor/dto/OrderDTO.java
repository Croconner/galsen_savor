package com.galsensavor.dto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class OrderDTO {

    private Long id;

    private UserDTO user;

    private List<OrderLineItemDTO> orderLineItems;

    private Double totalAmount;

    private LocalDateTime orderDate;

}
