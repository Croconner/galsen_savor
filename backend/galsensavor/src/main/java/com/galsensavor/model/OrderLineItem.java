package com.galsensavor.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "order_line_items")
public class OrderLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;


    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    private int quantity;
    private double lineItemTotal;  // total at the time of the order
}
