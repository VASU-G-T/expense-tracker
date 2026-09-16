package com.example.expensetracker.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Initializes the Firebase Admin SDK and exposes a Firestore bean.
 *
 * <p>Credentials are loaded in this priority order:
 * <ol>
 *   <li>Classpath resource (src/main/resources/{credentials-path})</li>
 *   <li>Filesystem path (absolute or relative to working directory)</li>
 *   <li>GOOGLE_APPLICATION_CREDENTIALS environment variable (ADC)</li>
 * </ol>
 */
@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.credentials.path:firebase-service-account.json}")
    private String credentialsPath;

    @Bean
    public Firestore firestore() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(loadCredentials())
                    .build();
            FirebaseApp.initializeApp(options);
            log.info("Firebase Admin SDK initialized successfully.");
        }
        return FirestoreClient.getFirestore();
    }

    private GoogleCredentials loadCredentials() throws IOException {
        // 1. Try classpath
        InputStream classpathStream = getClass().getClassLoader()
                .getResourceAsStream(credentialsPath);
        if (classpathStream != null) {
            log.info("Loading Firebase credentials from classpath: {}", credentialsPath);
            return GoogleCredentials.fromStream(classpathStream);
        }

        // 2. Try filesystem path
        if (Files.exists(Paths.get(credentialsPath))) {
            log.info("Loading Firebase credentials from filesystem: {}", credentialsPath);
            return GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
        }

        // 3. Fall back to Application Default Credentials
        log.warn("Firebase credentials file '{}' not found — falling back to Application Default Credentials (ADC).", credentialsPath);
        return GoogleCredentials.getApplicationDefault();
    }
}
