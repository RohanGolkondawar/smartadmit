-- ============================================================
--  SmartAdmit PostgreSQL Schema
--  Run this once to create the database, then Spring Boot
--  will auto-create/update the tables via JPA (ddl-auto=update)
-- ============================================================

-- Create database (run as superuser / postgres user)
CREATE DATABASE smartadmit;

-- Connect to smartadmit and run the rest:
\c smartadmit;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    role       VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','SCHOOL','STUDENT')),
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id),
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    address         VARCHAR(500),
    city            VARCHAR(100),
    state           VARCHAR(100),
    board           VARCHAR(50),
    total_seats     INT          DEFAULT 100,
    available_seats INT          DEFAULT 100,
    established     INT,
    principal_name  VARCHAR(255)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id           BIGSERIAL PRIMARY KEY,
    student_id   BIGINT      NOT NULL REFERENCES users(id),
    school_id    BIGINT      NOT NULL REFERENCES schools(id),
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    applied_date TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP,
    UNIQUE (student_id, school_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email       ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role        ON users(role);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_school  ON applications(school_id);
CREATE INDEX IF NOT EXISTS idx_applications_status  ON applications(status);
