package com.galsensavor.controller;
import com.galsensavor.dto.MenuItemDTO;
import com.galsensavor.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.access.prepost.PreAuthorize;
@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // Fetch all menu items as entities
    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> getAllMenuItems() {
        List<MenuItemDTO> menuItems = menuService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    // Fetch popular dishes by their names as entities
    @GetMapping("/popular")
    public ResponseEntity<List<MenuItemDTO>> getPopularDishes(@RequestParam List<String> names) {
        List<MenuItemDTO> menuItems = menuService.getPopularDishes(names);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsByCategory(@RequestParam String category) {
        List<MenuItemDTO> menuItems = menuService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(menuItems);
    }
    // Add a new menu item (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<String> addMenuItem(@RequestParam("name") String name,
                                         @RequestParam("description") String description,
                                         @RequestParam("price") double price,
                                         @RequestParam("category") String category,
                                         @RequestParam("image") MultipartFile image) {
        MenuItemDTO menuItemDTO = new MenuItemDTO(null, name, null, price, description, category, false);                                  
        menuService.addMenuItem(menuItemDTO, image);
        return ResponseEntity.ok("{\"message\":\"Menu item added successfully!\"}");
    }

    // Edit an existing menu item (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/edit")
    public ResponseEntity<String> editMenuItem( @RequestBody MenuItemDTO menuItemDTO) {
        menuService.editMenuItem(menuItemDTO);
        return ResponseEntity.ok("{\"message\":\"Menu item updated successfully!\"}");
    }

    // Soft delete a menu item (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok("{\"message\":\"Menu item deleted successfully!\"}");
    }


}

