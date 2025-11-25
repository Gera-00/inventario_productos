CREATE DATABASE inventario_productos;

use inventario_productos;

CREATE TABLE Usuarios(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    contrasenia varchar(100) NOT NULL
);

CREATE TABLE Categorias(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Productos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_categoria INT,
    stock INT DEFAULT 0,
    precio DECIMAL,
    FOREIGN KEY(id_categoria) REFERENCES Categorias(id)
);

INSERT INTO Usuarios (nombre,usuario,contrasenia) VALUES ("Gerardo", "admin", "password");

-- Insertar categorías iniciales
INSERT INTO Categorias (nombre) VALUES 
('Electrónicos'),
('Ropa y Accesorios'),
('Hogar y Jardín'),
('Deportes'),
('Libros'),
('Alimentación'),
('Belleza y Cuidado Personal'),
('Juguetes'),
('Herramientas'),
('Oficina');

-- Insertar productos iniciales
INSERT INTO Productos (nombre, id_categoria, stock, precio) VALUES 
-- Electrónicos
('Smartphone Samsung Galaxy', 1, 15, 299.99),
('Laptop HP Pavilion', 1, 8, 599.99),
('Auriculares Bluetooth', 1, 25, 79.99),
('Tablet iPad', 1, 12, 399.99),
('Cargador USB-C', 1, 30, 19.99),

-- Ropa y Accesorios
('Camiseta Básica', 2, 50, 15.99),
('Jeans Clásicos', 2, 20, 45.99),
('Zapatillas Deportivas', 2, 18, 89.99),
('Reloj de Pulsera', 2, 10, 129.99),
('Gorra de Béisbol', 2, 35, 24.99),

-- Hogar y Jardín
('Aspiradora Robot', 3, 5, 199.99),
('Set de Sartenes', 3, 12, 89.99),
('Plantas Decorativas', 3, 40, 12.99),
('Lámpara de Mesa', 3, 15, 39.99),
('Cojines Decorativos', 3, 25, 19.99),

-- Deportes
('Pelota de Fútbol', 4, 20, 29.99),
('Raqueta de Tenis', 4, 8, 79.99),
('Pesas Ajustables', 4, 6, 149.99),
('Cinta para Correr', 4, 3, 599.99),
('Botella de Agua', 4, 45, 14.99),

-- Libros
('El Quijote', 5, 25, 18.99),
('Cien Años de Soledad', 5, 15, 22.99),
('Manual de JavaScript', 5, 10, 35.99),
('Historia Universal', 5, 8, 42.99),
('Cocina Internacional', 5, 12, 28.99),

-- Alimentación
('Café Premium', 6, 30, 12.99),
('Aceite de Oliva', 6, 20, 8.99),
('Pasta Italiana', 6, 40, 3.99),
('Miel Natural', 6, 15, 9.99),
('Cereales Integrales', 6, 25, 6.99),

-- Belleza y Cuidado Personal
('Champú Hidratante', 7, 22, 11.99),
('Crema Facial', 7, 18, 25.99),
('Perfume Unisex', 7, 10, 55.99),
('Cepillo de Dientes Eléctrico', 7, 8, 49.99),
('Mascarilla Facial', 7, 30, 7.99),

-- Juguetes
('Muñeca Barbie', 8, 15, 24.99),
('Set de Legos', 8, 12, 39.99),
('Pelota de Playa', 8, 28, 9.99),
('Rompecabezas 1000 piezas', 8, 10, 18.99),
('Coche de Control Remoto', 8, 6, 79.99),

-- Herramientas
('Taladro Inalámbrico', 9, 8, 89.99),
('Set de Destornilladores', 9, 15, 24.99),
('Martillo', 9, 12, 19.99),
('Sierra Eléctrica', 9, 4, 159.99),
('Caja de Herramientas', 9, 10, 45.99),

-- Oficina
('Silla Ergonómica', 10, 6, 199.99),
('Escritorio de Madera', 10, 4, 299.99),
('Calculadora Científica', 10, 20, 29.99),
('Agenda 2025', 10, 35, 12.99),
('Lámpara de Escritorio', 10, 18, 34.99);