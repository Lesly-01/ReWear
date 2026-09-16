<?php
session_start();
header('Content-Type: application/json');
require_once("../config/conexion.php");

$database = new Database();
$db = $database->getConnection();

// ID del comprador logueado (puedes ajustar la variable de sesión si usas otra)
$id_comprador = $_SESSION['id_usuario'] ?? $_SESSION['user_id'] ?? 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = trim($_POST['request_title'] ?? '');
    $tipo_prenda = trim($_POST['garment_type'] ?? '');
    $metodo = trim($_POST['customization_method'] ?? '');
    $instrucciones = trim($_POST['instructions'] ?? '');
    $presupuesto_min = floatval($_POST['min_budget'] ?? 0);
    $presupuesto_max = floatval($_POST['max_budget'] ?? 0);

    // Guardar Foto de la Prenda
    $foto_prenda = 'IMG/default_request.jpg';
    if (isset($_FILES['garment_photo']) && $_FILES['garment_photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../public/imagenes/uploads_requests/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $ext = strtolower(pathinfo($_FILES['garment_photo']['name'], PATHINFO_EXTENSION));
        $newName = 'req_' . md5(time() . rand()) . '.' . $ext;

        if (move_uploaded_file($_FILES['garment_photo']['tmp_name'], $uploadDir . $newName)) {
            $foto_prenda = 'imagenes/uploads_requests/' . $newName;
        }
    }

    try {
        $sql = "INSERT INTO solicitudes_personalizacion 
                (id_comprador, titulo, tipo_prenda, metodo, instrucciones, presupuesto_min, presupuesto_max, foto_prenda) 
                VALUES (:id_comprador, :titulo, :tipo_prenda, :metodo, :instrucciones, :presupuesto_min, :presupuesto_max, :foto_prenda)";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id_comprador'   => $id_comprador,
            ':titulo'         => $titulo,
            ':tipo_prenda'    => $tipo_prenda,
            ':metodo'         => $metodo,
            ':instrucciones'  => $instrucciones,
            ':presupuesto_min'=> $presupuesto_min,
            ':presupuesto_max'=> $presupuesto_max,
            ':foto_prenda'    => $foto_prenda
        ]);

        echo json_encode(['success' => true, 'message' => '¡Solicitud publicada exitosamente!']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $e->getMessage()]);
    }
}
?>