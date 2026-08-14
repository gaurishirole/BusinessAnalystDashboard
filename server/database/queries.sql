-- DDL script for Business Analytics Dashboard (PostgreSQL)
-- Drop existing tables to start fresh
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Analyst' CHECK (role IN ('Super Admin', 'Manager', 'Analyst', 'Admin', 'Editor', 'Viewer')),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Calendar Events Table
CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    color VARCHAR(50) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    sales INT NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    category VARCHAR(100) DEFAULT 'Software',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- ORD-XXX format
    customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Completed', 'Pending', 'Cancelled', 'Refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reports Table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    generated_by INT REFERENCES users(id) ON DELETE SET NULL,
    file_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Insert Seed Users (Password for all accounts is: password123)
INSERT INTO users (name, email, password_hash, role, status, avatar) VALUES
('Alex Mercer', 'admin@insightpro.com', '$2b$10$9oqADM5qsPMn4TZsBCZTm.UY8ERbvkHL9G0rTmJhTyyH1pkpUa/qa', 'Admin', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'),
('Emma Watson', 'manager@insightpro.com', '$2b$10$9oqADM5qsPMn4TZsBCZTm.UY8ERbvkHL9G0rTmJhTyyH1pkpUa/qa', 'Manager', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'),
('Robert Downey', 'analyst@insightpro.com', '$2b$10$9oqADM5qsPMn4TZsBCZTm.UY8ERbvkHL9G0rTmJhTyyH1pkpUa/qa', 'Analyst', 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces');

