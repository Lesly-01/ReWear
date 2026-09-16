<?php
header("Content-Type: application/json");
require_once "conexion.php";

$sql = "SELECT p.*, u.nombre AS disenador_nombre 
        FROM prendas_publicadas p 
        INNER JOIN usuarios u ON p.id_disenador = u.id_usuario 
        ORDER BY p.fecha_publicacion DESC";

$result = $conn->query($sql);
$prendas = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $prendas[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $prendas]);
?>