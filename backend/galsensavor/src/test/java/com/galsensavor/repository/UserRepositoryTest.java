package com.galsensavor.repository;

import com.galsensavor.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class UserRepositoryTest {

     @Autowired
     private UserRepository userRepository;

     private User user;
     private User user2;

     @BeforeEach
     void setUp() {
          user = User.builder()
                 .firstName("John")
                 .lastName("Doe")
                 .email("john.doe@gmail.com")
                 .password("password")
                 .build();
          user2 = User.builder()
                 .firstName("Sherlock")
                 .lastName("Holmes")
                 .email("thegreatdetective@gmail.com")
                 .password("sherlocked")
                 .build();

     }

     @Test
     public void UserRepository_Save_ReturnSavedUser() {
         User savedUser = userRepository.save(user);

         assertNotNull(savedUser);
         assertTrue(savedUser.getId() > 0);
     }

     @Test
     public void UserRepository_GetAllUsers_ReturnMoreThanOneUser() {
         userRepository.save(user);
         userRepository.save(user2);

         List<User> userList = userRepository.findAll();

         assertNotNull(userList);
         assertEquals(2, userList.size());

         assertEquals("John", userList.getFirst().getFirstName());
         assertEquals("Doe", userList.getFirst().getLastName());
         assertEquals("Sherlock", userList.get(1).getFirstName());
         assertEquals("Holmes", userList.get(1).getLastName());
     }
}