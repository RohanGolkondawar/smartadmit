package com.smartadmit.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        String jdbcUrl;

        if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            // Render gives: postgresql://user:pass@host/dbname
            // Spring needs:  jdbc:postgresql://host/dbname?user=user&password=pass
            jdbcUrl = databaseUrl.replace("postgresql://", "jdbc:postgresql://");
        } else if (databaseUrl != null && databaseUrl.startsWith("jdbc:postgresql://")) {
            jdbcUrl = databaseUrl;
        } else {
            // fallback for local dev
            jdbcUrl = "jdbc:postgresql://localhost:5432/smartadmit";
        }

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }
}
