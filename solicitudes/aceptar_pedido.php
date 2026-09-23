<?php
// Deshabilitar la visualización de errores en la salida para evitar corromper el JSON
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
require_once("../config/conexion.php");
session_start();

try {
    $database = new Database();
    $db = $database->getConnection(); // Retorna un objeto PDO

    // Obtención de datos desde JSON (Fetch API) o POST tradicional
    $json_data = json_decode(file_get_contents("php://input"), true);

    $id_postulacion = $json_data['id_postulacion'] ?? $_POST['id_postulacion'] ?? null;
    $id_solicitud = $json_data['id_solicitud'] ?? $_POST['id_solicitud'] ?? null;
    $nuevo_estado = $json_data['estado'] ?? $_POST['estado'] ?? 'aceptada';

    // Corregido: Limpieza de la asignación de $comentario
    $comentario = null;
    if ($json_data) {
        $comentario = $json_data['mensaje'] ?? $json_data['comentario'] ?? null;
    }
    if (!$comentario) {
        $comentario = $_POST['mensaje'] ?? $_POST['comentario'] ?? null;
    }

    $precio = $json_data['precio_ofrecido'] ?? $_POST['precio_ofrecido'] ?? null;

    if (!$id_postulacion && !$id_solicitud) {
        echo json_encode(["success" => false, "message" => "Missing required ID (postulation or request)"]);
        exit;
    }

    $id_disenador = $_SESSION['id_usuario'] ?? null;
    if (!$id_disenador) {
        echo json_encode(["success" => false, "message" => "User session not found"]);
        exit;
    }

    $db->beginTransaction();

    if ($id_postulacion) {
        // ESCENARIO A: Actualizar una postulación existente
        $stmt1 = $db->prepare("UPDATE postulaciones SET estado = ?, mensaje = ? WHERE id_postulacion = ? AND id_disenador = ?");
        $stmt1->execute([$nuevo_estado, $comentario, $id_postulacion, $id_disenador]);

        if ($stmt1->rowCount() === 0) {
            $check = $db->prepare("SELECT id_postulacion FROM postulaciones WHERE id_postulacion = ? AND id_disenador = ?");
            $check->execute([$id_postulacion, $id_disenador]);
            if (!$check->fetch()) {
                throw new Exception("Postulation not found or not owned by this designer");
            }
        }

        $stmt_sol = $db->prepare("SELECT id_solicitud FROM postulaciones WHERE id_postulacion = ?");
        $stmt_sol->execute([$id_postulacion]);
        $res_sol = $stmt_sol->fetch();
        $id_sol_actual = $res_sol['id_solicitud'] ?? null;

    } else {
        // ESCENARIO B: Nueva aceptación (Crea postulación)
        $stmt_post = $db->prepare("INSERT INTO postulaciones (id_solicitud, id_disenador, precio_ofrecido, mensaje, estado) VALUES (?, ?, ?, ?, ?)");
        $stmt_post->execute([$id_solicitud, $id_disenador, $precio, $comentario, $nuevo_estado]);

        $id_postulacion = $db->lastInsertId();
        $id_sol_actual = $id_solicitud;
    }

    // Marcar la solicitud como 'en_trato'
    if ($id_sol_actual) {
        $stmt3 = $db->prepare("UPDATE solicitudes SET estado = 'en_trato' WHERE id_solicitud = ?");
        $stmt3->execute([$id_sol_actual]);
    }

    $db->commit();
    echo json_encode(["success" => true, "message" => "Order processed successfully!"]);

} catch (Exception $e) {
    if (isset($db)) $db->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>