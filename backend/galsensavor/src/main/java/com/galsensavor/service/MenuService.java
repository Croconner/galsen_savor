package com.galsensavor.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.galsensavor.config.EntityDtoMapper;
import com.galsensavor.dto.MenuItemDTO;
import com.galsensavor.model.MenuItem;
import com.galsensavor.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.persistence.EntityNotFoundException;
@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    private final BlobServiceClient blobServiceClient;

    // Fetch menu items by category (as string) and convert to DTO
    public List<MenuItemDTO> getMenuItemsByCategory(String category) {
        List<MenuItem> menuItems = menuItemRepository.findByCategory(category).stream().filter(item -> !item.isDeleted()).collect(Collectors.toList());
        return menuItems.stream().map(EntityDtoMapper::convertMenuItemToDTO).collect(Collectors.toList());
    }

    // Fetch all menu items and convert to DTO
    public List<MenuItemDTO> getAllMenuItems() {
        List<MenuItem> menuItems = menuItemRepository.findAll().stream().filter(item -> !item.isDeleted()).collect(Collectors.toList());
        return menuItems.stream().map(EntityDtoMapper::convertMenuItemToDTO).collect(Collectors.toList());
    }

    // Fetch popular dishes by names and convert to DTO
    public List<MenuItemDTO> getPopularDishes(List<String> names) {
        List<MenuItem> menuItems = menuItemRepository.findByNameIn(names) .stream()
                .filter(menuItem -> !menuItem.isDeleted())  // Filter out deleted items
                .collect(Collectors.toList());
        return menuItems.stream().map(EntityDtoMapper::convertMenuItemToDTO).collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void addMenuItem(MenuItemDTO menuItemDTO, MultipartFile image) {
        if(menuItemRepository.findByName(menuItemDTO.getName()).isPresent()){
            throw new IllegalArgumentException("A menu item with name "+ menuItemDTO.getName() + " already exists.");
        }
        MenuItem menuItem = EntityDtoMapper.DTOToMenuItem(menuItemDTO);
        menuItem.setImageUrl(this.saveImage(image));
        menuItemRepository.save(menuItem);

    }

     // Logic to save the image to Azure Blob Storage and return the URL
     private String saveImage(MultipartFile image) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient("menu-items-images");
        String fileName = image.getOriginalFilename();
        BlobClient blobClient = containerClient.getBlobClient(fileName);

        try (InputStream inputStream = image.getInputStream()) {
            blobClient.upload(inputStream, image.getSize(), true);
            return blobClient.getBlobUrl();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image to Azure Blob Storage", e);
        }
    }

    // Edit menu item, only admins can perform this action
    @PreAuthorize("hasRole('ADMIN')")

    public void editMenuItem(MenuItemDTO menuItemDTO) {
        MenuItem existingMenuItem = menuItemRepository.findById(menuItemDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("MenuItem not found"));

        MenuItem updatedMenuItem = EntityDtoMapper.DTOToMenuItem(menuItemDTO);
        updatedMenuItem.setId(existingMenuItem.getId());
        updatedMenuItem.setDeleted(existingMenuItem.isDeleted());

        menuItemRepository.save(updatedMenuItem);
    }

    // Soft delete menu item, only admins can perform this action
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMenuItem(Long id) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MenuItem not found"));

        existingMenuItem.setDeleted(true);
        menuItemRepository.save(existingMenuItem);
    }
}

