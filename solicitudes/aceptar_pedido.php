<?php
header("Content-Type: application/json");
include '../config/conexion.php';
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "message" => "No session found"]);
    exit;
}

$id_disenador = $_SESSION['id_usuario'];
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_postulacion'])) {
    echo json_encode(["success" => false, "message" => "Missing postulation ID"]);
    exit;
}

$id_postulacion = $data['id_postulacion'];

try {
    $conn->begin_transaction();

    // 1. Actualizar la postulación a 'aceptada'
    $stmt1 = $conn->prepare("UPDATE postulaciones SET estado = 'aceptada' WHERE id_postulacion = ? AND id_disenador = ?");
    $stmt1->bind_param("ii", $id_postulacion, $id_disenador);
    $stmt1->execute();

    if ($stmt1->affected_rows === 0) {
        throw new Exception("Postulation not found or not owned by this designer");
    }

    // 2. Obtener el id_solicitud asociado a esta postulación
    $stmt2 = $conn->prepare("SELECT id_solicitud FROM postulaciones WHERE id_postulacion = ?");
    $stmt2->bind_param("i", $id_postulacion);
    $stmt2->execute();
    $result = $stmt2->get_result();
    $row = $result->fetch_assoc();

    if (!$row) {
        throw new Exception("Could not find associated request");
    }

    $id_solicitud = $row['id_solicitud'];

    // 3. Actualizar la solicitud a 'en_trato'
    $stmt3 = $conn->prepare("UPDATE solicitudes SET estado = 'en_trato' WHERE id_solicitud = ?");
    $stmt3->bind_param("i", $id_solicitud);
    $stmt3->execute();

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Order accepted successfully!"]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>