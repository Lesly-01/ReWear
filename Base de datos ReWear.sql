CREATE DATABASE ReWear;

USE ReWear;

CREATE TABLE usuarios(
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL
correo VARCHAR(150) NOT NULL UNIQUE
password_hash VARCHAR(255) NOT NULL
rol ENUM('comprador', 'diseñador',) NOT Null
Teléfono VARCHAR(20)
fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP 
estado ENUM('activo','suspendido') DEFAULT 'activo'
);

CREATE TABLE perfiles_disenador(
id_perfil INT AUTO_INCREMENT PRIMARY KEY
id_usuario INT NOT NULL UNIQUE
biografia TEXT
rango_precio_desde DECIMAL (10,2)
rango_precio_hasta DECIMAL (10,2)
whatsapp VARCHAR (20)
);

CREATE TABLE disenador_tecnica(
id_disenador_tecnica INT AUTO_INCREMENT PRIMARY KEY 
id_usuario INT NOT NULL
id_tecnica INT NOT NULL 
);

CREATE TABLE tecnicas(
id_tecnica INT AUTO_INCREMENT PRIMARY KEY 
nombre VARCHAR(100) UNIQUE NOT NULL 
);

CREATE TABLE resenas(
id_resena INT AUTO_INCREMENT PRIMARY KEY 
id_postulacion INT NOT NULL UNIQUE 
id_usuario nt NOT NULL UNIQUE 
calificacion TINYINT NOT NULL 
comentario TEXT 
fecha DATETIME DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE postulaciones( 
id_postulacion INT AUTO_INCREMENT PRIMARY KEY 
id_solicitud INT NOT NULL 
id_disenador INT NOT NULL 
precio_ofrecido DECIMAL(10,2)
mensaje TEXT 
entrega_estimada DATE 
fecha DATETIME DEFAULT CURRENT_TIMESTAMP 

estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente'
);

CREATE TABLE solicitudes(
id_solicitud INT AUTO_INCREMENT PRIMARY KEY 
id_usuario INT NOT NULL 
i_categoria INT NOT NULL 
titulo VARCHAR(100) NOT NULL 
descripcion TEXT NOT NULL 
fecha_entrega DATE 
estado ENUM ('abierta', 'en_trato', 'finalizada', 'cancelada') DEFAULT 'abierta'
fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE imagenes_solicituedes(
id_imagen INT AUTO_INCREMENT PRIMARY KEY 
id_solcitud INT NOT NULL 
ruta_imagen VARCHAR(255)
);

CREATE TABLE impacto_ambiental(
id_impacto INT AUTO_INCREMENT PRIMARY KEY 
id_usuario INT NOT NULL
id_solicitud INT NOT NULL 
litros_ahorrados INT DEFAULT 2500
fecha DATETIME DEFAULT CURRENT_TIMESTAMP 
);


