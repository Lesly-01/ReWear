<?php
// Ocultar warnings de PHP para no romper el formato JSON
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');
require_once("../config/conexion.php");

$database = new Database();
$db = $database->getConnection();

// ID del usuario logueado
$id_usuario = $_SESSION['id_usuario'] ?? $_SESSION['user_id'] ?? 1;

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
        // Pasamos NULL a id_categoria para evitar conflictos de clave foránea
        $sql = "INSERT INTO solicitudes 
                (id_usuario, id_categoria, titulo, tipo_prenda, metodo, instrucciones, presupuesto_min, presupuesto_max, foto_prenda) 
                VALUES (:id_usuario, NULL, :titulo, :tipo_prenda, :metodo, :instrucciones, :presupuesto_min, :presupuesto_max, :foto_prenda)";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id_usuario'     => $id_usuario,
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
        echo json_encode(['success' => false, 'message' => 'Error al guardar en BD: ' . $e->getMessage()]);
    }
}

// Manejo de foto_prenda
$foto_prenda = null;

if (isset($_FILES['foto_prenda']) && $_FILES['foto_prenda']['error'] === UPLOAD_ERR_OK) {
    // Si el usuario subió una nueva imagen
    $rutaDestino = '../public/uploads/' . time() . '_' . $_FILES['foto_prenda']['name'];
    move_uploaded_file($_FILES['foto_prenda']['tmp_name'], $rutaDestino);
    $foto_prenda = 'uploads/' . time() . '_' . $_FILES['foto_prenda']['name'];
} elseif (!empty($_POST['foto_prenda_existente'])) {
    // Si no subió una nueva, usa la imagen de la publicación previa
    $foto_prenda = $_POST['foto_prenda_existente'];
} else {
    $foto_prenda = 'IMG/default_request.jpg';
}

// Manejo de foto_referencia (opcional)
$foto_referencia = null;
if (isset($_FILES['foto_referencia']) && $_FILES['foto_referencia']['error'] === UPLOAD_ERR_OK) {
    $rutaRef = '../public/uploads/ref_' . time() . '_' . $_FILES['foto_referencia']['name'];
    move_uploaded_file($_FILES['foto_referencia']['tmp_name'], $rutaRef);
    $foto_referencia = 'uploads/ref_' . time() . '_' . $_FILES['foto_referencia']['name'];
}
?>