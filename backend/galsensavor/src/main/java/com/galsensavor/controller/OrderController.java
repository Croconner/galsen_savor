package com.galsensavor.controller;
import com.galsensavor.dto.OrderDTO;
import com.galsensavor.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // API to save an order using OrderDTO
    @PostMapping("/save")
    public ResponseEntity<OrderDTO> saveOrder(@RequestBody OrderDTO orderDTO) {
        OrderDTO savedOrderDTO = orderService.saveOrder(orderDTO);
        return ResponseEntity.ok(savedOrderDTO);
    }

    // API to fetch orders by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> orderDTOs = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orderDTOs);
    }

    // API to fetch all orders
    @GetMapping("/all")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orderDTOs = orderService.getAllOrders();
        return ResponseEntity.ok(orderDTOs);
    }

    // API to delete an order by ID (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("{\"message\":\"Order deleted successfully.\"}");
    }

}

