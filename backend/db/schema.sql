CREATE DATABASE openstorm;

-- S'assurer que les tables 'shops' et 'users' sont définies en premier
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    ref VARCHAR(255) NOT NULL UNIQUE, 
    firstName VARCHAR(255) NOT NULL, 
    lastName VARCHAR(255) NOT NULL,  
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    photo VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    "plan" VARCHAR(20) DEFAULT 'free',
    createdAt DATE NOT NULL
);

CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    ref VARCHAR(255) NOT NULL UNIQUE, 
    userRef VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    cash INT DEFAULT 0,
    activity VARCHAR(100) NOT NULL,
    openingHour TIME,
    closeHour TIME,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    remainingActivationTime INT DEFAULT 0,
    image VARCHAR(30),
    createdAt DATE NOT NULL,
    FOREIGN KEY (userRef) REFERENCES users(ref) ON DELETE CASCADE
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    ref VARCHAR(255) NOT NULL UNIQUE,
    shopRef VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(30) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    supplier VARCHAR(45),
    price INT NOT NULL,
    reduction INT,
    stock INT,
    status VARCHAR(30),
    image VARCHAR(30),
    createdAt DATE NOT NULL,
    FOREIGN KEY (shopRef) REFERENCES shops(ref) ON DELETE CASCADE
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    shopId INT NOT NULL,
    quantity INT NOT NULL,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (shopId) REFERENCES shops(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    cartId INT NOT NULL,
    shopRef VARCHAR(255) NOT NULL,
    productRef VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unitPrice INT NOT NULL,
    reduction INT,
    total DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (shopRef) REFERENCES shops(ref) ON DELETE CASCADE,
    FOREIGN KEY (productRef) REFERENCES products(ref) ON DELETE CASCADE 
);

CREATE TABLE dailysales (
    id SERIAL PRIMARY KEY,
    shopId INT NOT NULL,
    nbSales INT DEFAULT 0,
    totalAmount DECIMAL(10, 2) DEFAULT 0.00, 
    date DATE NOT NULL,
    FOREIGN KEY (shopId) REFERENCES shops(id) ON DELETE CASCADE
);