CREATE DATABASE IF NOT EXISTS rewear;

USE rewear;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('comprador', 'disenador') NOT NULL,
  telefono VARCHAR(20),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('activo', 'suspendido') DEFAULT 'activo'
);

CREATE TABLE perfiles_disenador (
  id_perfil INT AUTO_INCREMENT PRIMARY KEY, 
  id_usuario INT NOT NULL UNIQUE,
  biografia TEXT,
  rango_precio_desde DECIMAL(10,2),
  rango_precio_hasta DECIMAL(10,2),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE solicitudes (
  id_solicitud INT AUTO_INCREMENT PRIMARY KEY, 
  id_usuario INT NOT NULL,
  id_categoria INT NULL,
  titulo VARCHAR(150) NOT NULL,
  tipo_prenda VARCHAR(100) NOT NULL,
  metodo VARCHAR(100) NOT NULL,
  instrucciones TEXT NOT NULL,
  presupuesto_min DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  presupuesto_max DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  foto_prenda VARCHAR(255) DEFAULT 'IMG/default_request.jpg',
  fecha_entrega DATE NULL,
  estado ENUM('abierta', 'en_trato', 'finalizada', 'cancelada') DEFAULT 'abierta',
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE SET NULL
);

CREATE TABLE impacto_ambiental (
  id_impacto INT AUTO_INCREMENT PRIMARY KEY, 
  id_usuario INT NOT NULL,
  id_solicitud INT NOT NULL, 
  litros_ahorrados INT DEFAULT 2500,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
);

CREATE TABLE postulaciones ( 
  id_postulacion INT AUTO_INCREMENT PRIMARY KEY,
  id_solicitud INT NOT NULL, 
  id_disenador INT NOT NULL,
  precio_ofrecido DECIMAL(10,2),
  mensaje TEXT, 
  entrega_estimada DATE,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',

  FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud),
  FOREIGN KEY (id_disenador) REFERENCES usuarios(id_usuario)
);

CREATE TABLE resenas (
  id_resena INT AUTO_INCREMENT PRIMARY KEY,
  id_postulacion INT NOT NULL UNIQUE,
  id_usuario INT NOT NULL, -- Nota: Quitué UNIQUE aquí si un usuario puede hacer varias reseñas, déjalo si es 1 a 1 estricto.
  calificacion TINYINT NOT NULL, 
  comentario TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_postulacion) REFERENCES postulaciones(id_postulacion),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE imagenes_solicitud (
  id_imagen INT AUTO_INCREMENT PRIMARY KEY,
  id_solicitud INT NOT NULL,
  ruta_imagen VARCHAR(255),

  FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
);

CREATE TABLE tecnicas (
  id_tecnica INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE disenador_tecnica (
  id_disenador_tecnica INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_tecnica INT NOT NULL,

  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_tecnica) REFERENCES tecnicas(id_tecnica)
);

CREATE TABLE estilo (
  id_estilo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE prendas_publicadas (
  id_prenda INT AUTO_INCREMENT PRIMARY KEY,
  id_disenador INT NOT NULL,
  id_categoria INT NULL,
  id_estilo INT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_minimo DECIMAL(10,2) NOT NULL,
  precio_maximo DECIMAL(10,2) NOT NULL,
  tecnicas_usadas VARCHAR(255),
  imagen_url VARCHAR(255),
  estado ENUM('disponible','vendida','exhibicion') DEFAULT 'disponible',
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_disenador) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE SET NULL,
  FOREIGN KEY (id_estilo) REFERENCES estilo(id_estilo) ON DELETE SET NULL
);

CREATE TABLE imagenes_prenda (
  id_imagen INT AUTO_INCREMENT PRIMARY KEY,
  id_prenda INT NOT NULL,
  imagen_url VARCHAR(255),

  FOREIGN KEY (id_prenda) REFERENCES prendas_publicadas(id_prenda) ON DELETE CASCADE
);

CREATE TABLE prendas_portafolio (
    id_prenda INT AUTO_INCREMENT PRIMARY KEY,
    id_disenador INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(100),
    precio_minimo DECIMAL(10,2) NOT NULL,
    precio_maximo DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- extra  de la base de datos para 
ALTER TABLE postulaciones
  MODIFY COLUMN estado ENUM('pending', 'accepted', 'rejected', 'in_review', 'completed')
  DEFAULT 'pending';

  ALTER TABLE postulaciones
  MODIFY COLUMN estado ENUM('pending', 'accepted', 'rejected', 'in_review', 'completed')
  DEFAULT 'pending';