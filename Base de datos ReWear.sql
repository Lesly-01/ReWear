CREATE DATABASE ReWear;

USE ReWear;

CREATE TABLE usuarios(
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
correo VARCHAR(150) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
rol ENUM('comprador', 'diseñador',) NOT Null,
Teléfono VARCHAR(20),
fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
estado ENUM('activo','suspendido') DEFAULT 'activo'
);

CREATE TABLE perfiles_disenador(
id_perfil INT AUTO_INCREMENT PRIMARY KEY, 
id_usuario INT NOT NULL UNIQUE,
biografia TEXT,
rango_precio_desde DECIMAL (10,2),
rango_precio_hasta DECIMAL (10,2),
whatsapp VARCHAR (20),

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE categoria(
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE solicitudes(
id_solicitud INT AUTO_INCREMENT PRIMARY KEY, 
id_usuario INT NOT NULL,
id_categoria INT NOT NULL,
titulo VARCHAR(100) NOT NULL,
descripcion TEXT NOT NULL,
fecha_entrega DATE,
estado ENUM ('abierta', 'en_trato', 'finalizada', 'cancelada') DEFAULT 'abierta',
fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE impacto_ambiental(
id_impacto INT AUTO_INCREMENT PRIMARY KEY, 
id_usuario INT NOT NULL,
id_solicitud INT NOT NULL, 
litros_ahorrados INT DEFAULT 2500,
fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
);

CREATE TABLE postulaciones( 
id_postulacion INT AUTO_INCREMENT PRIMARY KEY,
id_solicitud INT NOT NULL, 
id_disenador INT NOT NULL,
precio_ofrecido DECIMAL(10,2),
mensaje TEXT, 
entrega_estimada DATE,
fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente'

FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
FOREIGN KEY 
);

CREATE TABLE resenas(
id_resena INT AUTO_INCREMENT PRIMARY KEY,
id_postulacion INT NOT NULL UNIQUE,
id_usuario INT NOT NULL UNIQUE, 
calificacion TINYINT NOT NULL, 
comentario TEXT,
fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (id_postulacion) REFERENCES postulaciones(id_postulacion)
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE imagenes_solicitud(
id_imagen INT AUTO_INCREMENT PRIMARY KEY,
id_solicitud INT NOT NULL,
ruta_imagen VARCHAR(255),

FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
);

CREATE TABLE tecnicas(
id_tecnica INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) UNIQUE NOT NULL,
);


CREATE TABLE disenador_tecnica(
id_disenador_tecnica INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
id_tecnica INT NOT NULL,

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
FOREIGN KEY (id_tecnica) REFERENCES tecnicas(id_tecnica)
);

CREATE TABLE estilo(
    id_estilo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE prendas_publicadas(
    id_prenda INT AUTO_INCREMENT PRIMARY KEY,
    id_disenador INT NOT NULL,
    id_categoria INT NOT NULL,
    id_estilo INT NOT NULL,
    titulo VARCHAR (150),
    descripcion TEXT,
    precio DECIMAL(10,2),
    estado ENUM('disponible','vendida') DEFAULT 'disponible',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY 
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
    FOREIGN KEY (id_estilo) REFERENCES estilo(id_estilo)
);

CREATE TABLE imagenes_prenda(
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_prenda INT NOT NULL,
    imagen_url VARCHAR(255),

    FOREIGN KEY (id_prenda) REFERENCES prendas_publicadas(id_prenda)
);


