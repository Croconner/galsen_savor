package com.galsensavor;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.azure.storage.blob.BlobServiceClient;

@SpringBootTest
class GalsensavorApplicationTests {

	 @MockBean
    private BlobServiceClient blobServiceClient;

	@Test
	void contextLoads() {
	}

}
