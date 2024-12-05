package com.galsensavor.config;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.galsensavor.dto.MenuItemDTO;
import com.galsensavor.dto.OrderDTO;
import com.galsensavor.dto.OrderLineItemDTO;
import com.galsensavor.dto.UserDTO;
import com.galsensavor.exceptions.UserNotFoundException;
import com.galsensavor.model.MenuItem;
import com.galsensavor.model.Order;
import com.galsensavor.model.OrderLineItem;
import com.galsensavor.model.User;
import com.galsensavor.repository.MenuItemRepository;
import com.galsensavor.repository.UserRepository;

public class EntityDtoMapper {
    
    // convert user dto to user entity
    public static User userDTOToUser(UserDTO userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setLastName(userDto.getLastName());
        user.setFirstName(userDto.getFirstName());
        user.setPassword(userDto.getPassword());
        return user;
    }

    // convert user entity to user dto
    public static UserDTO userToUserDTO(User user) {

        UserDTO userDTO = new UserDTO(user.getId(),
         user.getFirstName(), 
         user.getLastName(), 
         user.getEmail(),
          null,
           user.getRoles());
        return userDTO;
    }

    // Helper method to map MenuItem entity to MenuItemDTO
    public static MenuItemDTO convertMenuItemToDTO(MenuItem menuItem) {
        return MenuItemDTO.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .imageUrl(menuItem.getImageUrl())
                .price(menuItem.getPrice())
                .description(menuItem.getDescription())
                .category(menuItem.getCategory())
                .deleted(menuItem.isDeleted())
                .build();
    }

    // Helper method to map MenuItemDTO to MenuItem entity
    public static MenuItem DTOToMenuItem(MenuItemDTO menuItemDto) {
            MenuItem menuItem = new MenuItem();
            menuItem.setId(menuItemDto.getId());
            menuItem.setName(menuItemDto.getName());
            menuItem.setImageUrl(menuItemDto.getImageUrl());
            menuItem.setPrice(menuItemDto.getPrice());
            menuItem.setDescription(menuItemDto.getDescription());
            menuItem.setCategory(menuItemDto.getCategory());
            menuItem.setDeleted(menuItemDto.isDeleted());
            
            return menuItem;
    }

    //helper method to convert OrderLineItemDTO to OrderLineItem entity
    public static OrderLineItem LineItemDTOToLineItem(OrderLineItemDTO dto) {
        OrderLineItem lineItem = new OrderLineItem(); 
        lineItem.setQuantity(dto.getQuantity());
        lineItem.setLineItemTotal(dto.getLineItemTotal());
        return lineItem;
    }

    //helper method to convert  OrderLineItem entity to OrderLineItemDTO
    public static OrderLineItemDTO LineItemToLineItemDTO(OrderLineItem entity) {
        OrderLineItemDTO lineItemDTOdto = new OrderLineItemDTO();
        lineItemDTOdto.setId(entity.getId());
        lineItemDTOdto.setLineItemTotal(entity.getLineItemTotal());
        lineItemDTOdto.setMenuItem(convertMenuItemToDTO(entity.getMenuItem()));
        lineItemDTOdto.setQuantity(entity.getQuantity());
        return lineItemDTOdto;
    }

    //helper method to convert orderDto to Order entity
    public static Order OrderDtoToOrder (OrderDTO orderDTO, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        Order order = new Order();
        // find and set user
        User user = userRepository.findById(orderDTO.getUser().getId()).orElseThrow(
        () -> new UserNotFoundException("User Not Found"));
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());  // Set the date to the current date
        order.setTotalAmount(orderDTO.getTotalAmount());

        //convert list of orderLineItemDto to list of orderLineItem
         List<OrderLineItem> lineItems = orderDTO.getOrderLineItems().stream().map(OrderLineItemDTO -> {
             OrderLineItem orderLineItem = EntityDtoMapper.LineItemDTOToLineItem(OrderLineItemDTO);
             MenuItem menuItem = menuItemRepository.findById(OrderLineItemDTO.getMenuItem().getId()).orElseThrow();
            orderLineItem.setMenuItem(menuItem);
            return orderLineItem;
            
             }).collect(Collectors.toList());

        lineItems.forEach(item -> item.setOrder(order));// Set the order in each line item
        order.setOrderLineItems(lineItems);

        return order;
    }

    //helper method to convert Order entity to orderDTO
    public static OrderDTO OrderToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        if(order.getUser() != null) {
             orderDTO.setUser(userToUserDTO(order.getUser()));
        }
        orderDTO.setId(order.getId());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setOrderDate(order.getOrderDate());

        // Convert OrderLineItems to DTOs using your existing MenuItemDTO conversion
        List<OrderLineItemDTO> lineItemDTOs = order.getOrderLineItems().stream().map(
            EntityDtoMapper:: LineItemToLineItemDTO).collect(Collectors.toList());

         orderDTO.setOrderLineItems(lineItemDTOs);
        return orderDTO;
    }

}
