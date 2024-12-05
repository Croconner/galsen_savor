package com.galsensavor.service;
import com.galsensavor.config.EntityDtoMapper;
import com.galsensavor.dto.OrderDTO;
import com.galsensavor.model.Order;
import com.galsensavor.repository.MenuItemRepository;
import com.galsensavor.repository.OrderRepository;
import com.galsensavor.repository.UserRepository;
import com.galsensavor.dto.OrderLineItemDTO;
import com.galsensavor.model.MenuItem;
import com.galsensavor.model.OrderLineItem;
import com.galsensavor.config.EntityDtoMapper;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;


@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    // Save an order using DTO
    public OrderDTO saveOrder(OrderDTO orderDTO) {
        // convert orderdto to order entity
        Order order = EntityDtoMapper.OrderDtoToOrder(orderDTO, menuItemRepository, userRepository);
        //save order to database
        Order savedOrder = orderRepository.save(order);
        orderDTO.setId(savedOrder.getId());
        orderDTO.setOrderDate(savedOrder.getOrderDate());
        return orderDTO;
    }

    // Fetch orders by userId and convert to DTO
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        
        return orders.stream().map(order -> {
            //set user to null since we already know the user
            order.setUser(null);
            return EntityDtoMapper.OrderToOrderDTO(order);
        }).collect(Collectors.toList());
    }

    // Fetch all orders
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(EntityDtoMapper::OrderToOrderDTO
        ).collect(Collectors.toList());
    }
 
    // Delete an order by ID
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new EntityNotFoundException("Order not found with ID: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }

}
