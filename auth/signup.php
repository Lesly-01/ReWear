<?php
header("Content-Type: application/json; charset=UTF-8");
require_once("../config/conexion.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos válidos."
    ]);
    exit;
}

$email = isset($input['email']) ? trim($input['email']) : '';
$username = isset($input['username']) ? trim($input['username']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';
$confirm_password = isset($input['confirm_password']) ? trim($input['confirm_password']) : '';
$role = isset($input['role']) ? trim($input['role']) : '';

// Validaciones de campos obligatorios
if (empty($email) || empty($username) || empty($phone) || empty($password) || empty($confirm_password) || empty($role)) {
    echo json_encode([
        "success" => false,
        "message" => "Todos los campos son obligatorios."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "El formato del correo electrónico no es válido."
    ]);
    exit;
}

if ($password !== $confirm_password) {
    echo json_encode([
        "success" => false,
        "message" => "Las contraseñas no coinciden."
    ]);
    exit;
}

$roles_permitidos = ['comprador', 'diseñador'];
if (!in_array($role, $roles_permitidos)) {
    echo json_encode([
        "success" => false,
        "message" => "El rol seleccionado no es válido."
    ]);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Verificar si el correo ya está registrado
    $checkQuery = "SELECT id_usuario FROM usuarios WHERE correo = :correo LIMIT 1";
    $stmtCheck = $db->prepare($checkQuery);
    $stmtCheck->bindParam(':correo', $email);
    $stmtCheck->execute();

    if ($stmtCheck->rowCount() > 0) {
        echo json_encode([
            "success" => false,
            "message" => "El correo electrónico ya se encuentra registrado."
        ]);
        exit;
    }

    $db->beginTransaction();

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Consulta de inserción (mapeando a las columnas de tu base de datos)
    $insertQuery = "INSERT INTO usuarios (nombre, correo, password_hash, rol, Teléfono) 
                    VALUES (:nombre, :correo, :password_hash, :rol, :telefono)";
    
    $stmtInsert = $db->prepare($insertQuery);
    $stmtInsert->bindParam(':nombre', $username);
    $stmtInsert->bindParam(':correo', $email);
    $stmtInsert->bindParam(':password_hash', $password_hash);
    $stmtInsert->bindParam(':rol', $role);
    $stmtInsert->bindParam(':telefono', $phone);

    $stmtInsert->execute();
    $id_usuario = $db->lastInsertId();

    // Si el rol es diseñador, crear su perfil inicial
    if ($role === 'diseñador') {
        $profileQuery = "INSERT INTO perfiles_disenador (id_usuario) VALUES (:id_usuario)";
        $stmtProfile = $db->prepare($profileQuery);
        $stmtProfile->bindParam(':id_usuario', $id_usuario);
        $stmtProfile->execute();
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Usuario registrado exitosamente.",
        "role" => $role
    ]);

} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode([
        "success" => false,
        "message" => "Error de base de datos: " . $e->getMessage()
    ]);
}