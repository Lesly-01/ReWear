<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/conexion.php';

// 1. Validar que el usuario haya iniciado sesión
$id_usuario = $_SESSION['id_usuario'] ?? null; 

if (!$id_usuario) {
    echo json_encode(['success' => false, 'message' => 'Sesión no válida o no iniciada']);
    exit;
}

try {
    $database = new Database();
    $pdo = $database->getConnection();

    // 2. Procesar la foto de perfil si fue enviada en el formulario
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        
        $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $nombreFoto = 'perfil_' . $id_usuario . '.' . strtolower($extension);
        
        // Ruta absoluta donde PHP guarda el archivo físicamente
        $rutaServidor = __DIR__ . '/../uploads/perfiles/' . $nombreFoto;

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaServidor)) {
            // Ruta relativa que se registra en la base de datos
            $rutaBD = 'uploads/perfiles/' . $nombreFoto;
            
            $stmtFoto = $pdo->prepare("UPDATE perfiles_disenador SET foto_perfil = ? WHERE id_usuario = ?");
            $stmtFoto->execute([$rutaBD, $id_usuario]);
        }
    }

    // 3. Procesar datos adicionales de texto (opcional)
    $biografia = $_POST['biografia'] ?? null;
    if ($biografia !== null) {
        $stmtBio = $pdo->prepare("UPDATE perfiles_disenador SET biografia = ? WHERE id_usuario = ?");
        $stmtBio->execute([$biografia, $id_usuario]);
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Perfil actualizado correctamente'
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error al actualizar perfil: ' . $e->getMessage()
    ]);
}
?>