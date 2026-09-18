<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

session_start();

// Incluir la conexión a la base de datos
require_once '../config/conexion.php'; 

$database = new Database();
$db = $database->getConnection();

// Obtener los datos JSON enviados desde JS
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->identifier) && !empty($data->password)) {
    $identifier = trim($data->identifier);
    $password = $data->password;

    // Buscar por correo O por nombre de usuario
    $query = "SELECT id_usuario, nombre, correo, password_hash, rol, estado 
              FROM usuarios 
              WHERE correo = :identifier OR nombre = :identifier 
              LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":identifier", $identifier);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si la cuenta está activa
        if ($row['estado'] !== 'activo') {
            echo json_encode([
                "success" => false, 
                "message" => "Your account is inactive. Please contact support."
            ]);
            exit;
        }

        // Verificar la contraseña
        if (password_verify($password, $row['password_hash'])) {
            // Guardar variables en la sesión
            $_SESSION['id_usuario'] = $row['id_usuario'];
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['correo'] = $row['correo'];
            $_SESSION['rol'] = $row['rol'];

            echo json_encode([
                "success" => true,
                "message" => "Login successful! Redirecting...",
                "role" => $row['rol']
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "Invalid password. Please try again."
            ]);
        }
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Account not found with that email or username."
        ]);
    }
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Please complete all fields."
    ]);
}
?>