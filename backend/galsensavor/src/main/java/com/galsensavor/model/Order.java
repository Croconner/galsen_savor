package com.galsensavor.model;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order", fetch = FetchType.EAGER)
    private List<OrderLineItem> orderLineItems = new ArrayList<>(); // List of order line items


    private Double totalAmount;

    private LocalDateTime orderDate;
}
