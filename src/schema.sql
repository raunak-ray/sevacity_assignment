-- DELIVERY MANAGEMENT SYSTEM DATABASE SETUP

CREATE DATABASE IF NOT EXISTS delivery_management;

USE delivery_management;

-- USERS TABLE

CREATE TABLE users (

    id CHAR(36) PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM(
        'admin',
        'delivery_boy'
    ) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ORDERS TABLE

CREATE TABLE orders (

    id CHAR(36) PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,

    pickup_address TEXT NOT NULL,

    delivery_address TEXT NOT NULL,

    status ENUM(
        'pending',
        'assigned',
        'in_transit',
        'delivered',
        'cancelled'
    ) DEFAULT 'pending',

    created_by CHAR(36) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ASSIGNMENTS TABLE

CREATE TABLE assignments (

    id CHAR(36) PRIMARY KEY,

    order_id CHAR(36) NOT NULL UNIQUE,

    delivery_boy_id CHAR(36) NOT NULL,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignments_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_assignments_delivery_boy
    FOREIGN KEY (delivery_boy_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- REFRESH TOKENS TABLE

CREATE TABLE refresh_tokens (

    id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    token TEXT NOT NULL,

    expires_at DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ORDER LOGS TABLE

CREATE TABLE order_logs (

    id CHAR(36) PRIMARY KEY,

    order_id CHAR(36) NOT NULL,

    old_status VARCHAR(50),

    new_status VARCHAR(50) NOT NULL,

    actor_id CHAR(36) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_logs_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_order_logs_actor
    FOREIGN KEY (actor_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- INDEXES

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_orders_status
ON orders(status);

CREATE INDEX idx_orders_created_at
ON orders(created_at);

CREATE INDEX idx_assignments_delivery_boy
ON assignments(delivery_boy_id);

CREATE INDEX idx_refresh_tokens_user
ON refresh_tokens(user_id);

CREATE INDEX idx_order_logs_order
ON order_logs(order_id);