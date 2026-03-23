package com.smartadmit.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        HikariDataSource ds = new HikariDataSource();
        ds.setDriverClassName("org.postgresql.Driver");

        if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            // Render gives: postgresql://user:password@host/dbname
            // Parse it properly into JDBC format

            URI uri = new URI(databaseUrl);

            String host     = uri.getHost();
            int    port     = uri.getPort() == -1 ? 5432 : uri.getPort();
            String dbName   = uri.getPath().replaceFirst("/", "");
            String userInfo = uri.getUserInfo(); // "user:password"
            String username = userInfo.split(":")[0];
            String password = userInfo.split(":")[1];

            // Correct JDBC URL — credentials are separate, NOT inside the URL
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;

            ds.setJdbcUrl(jdbcUrl);
            ds.setUsername(username);
            ds.setPassword(password);

        } else if (databaseUrl != null && databaseUrl.startsWith("jdbc:postgresql://")) {
            // Already correct JDBC format (local dev with full jdbc url)
            ds.setJdbcUrl(databaseUrl);
        } else {
            // Local development fallback
            ds.setJdbcUrl("jdbc:postgresql://localhost:5432/smartadmit");
            ds.setUsername("postgres");
            ds.setPassword("postgres");
        }

        return ds;
    }
}