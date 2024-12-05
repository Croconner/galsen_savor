package com.galsensavor.repository;

import com.galsensavor.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Optional<MenuItem> findByName(String name);

    List<MenuItem> findByNameIn(List<String> names);
    List<MenuItem> findByCategory(String category);
}
