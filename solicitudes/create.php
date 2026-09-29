<?php
// Ocultar advertencias para evitar alterar el formato JSON
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json; charset=UTF-8');
require_once("../config/conexion.php");

$database = new Database();
$db = $database->getConnection();

// ID del usuario autenticado (con fallback para pruebas)
$id_usuario = $_SESSION['id_usuario'] ?? $_SESSION['user_id'] ?? 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lectura y mapeo de datos recibidos desde el formulario en inglés
    $titulo          = trim($_POST['request_title'] ?? '');
    $tipo_prenda     = trim($_POST['garment_type'] ?? '');
    $metodo          = trim($_POST['customization_method'] ?? '');
    $instrucciones   = trim($_POST['instructions'] ?? '');
    $presupuesto_min = floatval($_POST['min_budget'] ?? 0);
    $presupuesto_max = floatval($_POST['max_budget'] ?? 0);

    // Procesamiento de la foto principal (garment_photo)
    $foto_prenda = '../public/imagenes/uploads_requests'; // Ruta por defecto
    
    if (isset($_FILES['garment_photo']) && $_FILES['garment_photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../public/imagenes/uploads_requests/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = strtolower(pathinfo($_FILES['garment_photo']['name'], PATHINFO_EXTENSION));
        $newName = 'req_' . md5(time() . rand()) . '.' . $ext;

        if (move_uploaded_file($_FILES['garment_photo']['tmp_name'], $uploadDir . $newName)) {
            $foto_prenda = 'imagenes/uploads_requests/' . $newName;
        }
    }

    // Procesamiento de la foto de referencia (opcional - reference_photo)
    $foto_referencia = null;
    if (isset($_FILES['reference_photo']) && $_FILES['reference_photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDirRef = '../public/imagenes/uploads_requests/';
        if (!is_dir($uploadDirRef)) {
            mkdir($uploadDirRef, 0755, true);
        }

        $extRef = strtolower(pathinfo($_FILES['reference_photo']['name'], PATHINFO_EXTENSION));
        $newNameRef = 'ref_' . md5(time() . rand()) . '.' . $extRef;

        if (move_uploaded_file($_FILES['reference_photo']['tmp_name'], $uploadDirRef . $newNameRef)) {
            $foto_referencia = 'imagenes/uploads_requests/' . $newNameRef;
        }
    }

    try {
        // Inserción en la tabla solicitudes
        $sql = "INSERT INTO solicitudes 
                (id_usuario, id_categoria, titulo, tipo_prenda, metodo, instrucciones, presupuesto_min, presupuesto_max, foto_prenda, foto_referencia) 
                VALUES (:id_usuario, NULL, :titulo, :tipo_prenda, :metodo, :instrucciones, :presupuesto_min, :presupuesto_max, :foto_prenda, :foto_referencia)";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id_usuario'      => $id_usuario,
            ':titulo'          => $titulo,
            ':tipo_prenda'     => $tipo_prenda,
            ':metodo'          => $metodo,
            ':instrucciones'   => $instrucciones,
            ':presupuesto_min' => $presupuesto_min,
            ':presupuesto_max' => $presupuesto_max,
            ':foto_prenda'     => $foto_prenda,
            ':foto_referencia' => $foto_referencia
        ]);

        echo json_encode(['success' => true, 'message' => 'Request published successfully!']);
        exit; // Detiene la ejecución para enviar la respuesta JSON correctamente
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
}
?>