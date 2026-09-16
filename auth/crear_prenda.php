<?php
header("Content-Type: application/json");
require_once "conexion.php";

session_start();

// Validar que se haya enviado por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Obtener id del diseñador (de la sesión o enviado desde el cliente)
    $id_disenador = $_SESSION['id_usuario'] ?? $_POST['id_disenador'] ?? 1; // 1 como valor por defecto de prueba

    $titulo = trim($_POST['postTitle'] ?? '');
    $tecnicas = trim($_POST['postCategory'] ?? '');
    $precio_minimo = floatval($_POST['postMinPrice'] ?? 0);
    $precio_maximo = floatval($_POST['postMaxPrice'] ?? 0);
    $descripcion = trim($_POST['postDescription'] ?? '');
    $imagen_url = trim($_POST['postImg'] ?? '');

    // Validaciones básicas
    if (empty($titulo) || empty($descripcion) || $precio_minimo <= 0) {
        echo json_encode(["success" => false, "message" => "Por favor completa todos los campos requeridos."]);
        exit;
    }

    // Insertar en la tabla prendas_publicadas
    $stmt = $conn->prepare("INSERT INTO prendas_publicadas (id_disenador, titulo, descripcion, precio_minimo, precio_maximo, tecnicas_usadas, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("issddss", $id_disenador, $titulo, $descripcion, $precio_minimo, $precio_maximo, $tecnicas, $imagen_url);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true, 
            "message" => "¡Proyecto publicado correctamente en tu portafolio!",
            "id_prenda" => $stmt->insert_id
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar en la base de datos: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>