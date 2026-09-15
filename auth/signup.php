<?php
header("Content-Type: application/json; charset=UTF-8");
session_start();
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
        "message" => "All fields are required."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "The email format is invalid."
    ]);
    exit;
}

if ($password !== $confirm_password) {
    echo json_encode([
        "success" => false,
        "message" => "Passwords do not match."
    ]);
    exit;
}

$roles_permitidos = ['comprador', 'disenador'];
if (!in_array($role, $roles_permitidos)) {
    echo json_encode([
        "success" => false,
        "message" => "The selected role is invalid."
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
            "message" => "User or email already registered."
        ]);
        exit;
    }

    $db->beginTransaction();

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Consulta de inserción (mapeando a las columnas de tu base de datos)
    $insertQuery = "INSERT INTO usuarios (nombre, correo, password_hash, rol, telefono) 
                    VALUES (:nombre, :correo, :password_hash, :rol, :telefono)";
    
    $stmtInsert = $db->prepare($insertQuery);
    $stmtInsert->bindParam(':nombre', $username);
    $stmtInsert->bindParam(':correo', $email);
    $stmtInsert->bindParam(':password_hash', $password_hash);
    $stmtInsert->bindParam(':rol', $role);
    $stmtInsert->bindParam(':telefono', $phone);

    $stmtInsert->execute();
    $id_usuario = $db->lastInsertId();

    
// Si el rol es disenador, crear su perfil inicial
    if ($role === 'disenador') {
        $profileQuery = "INSERT INTO perfiles_disenador (id_usuario) VALUES (:id_usuario)";
        $stmtProfile = $db->prepare($profileQuery);
        $stmtProfile->bindParam(':id_usuario', $id_usuario);
        $stmtProfile->execute();
    }

    // Guardar variables de sesión al registrarse exitosamente
    $_SESSION['id_usuario'] = $id_usuario;
    $_SESSION['nombre']     = $username;
    $_SESSION['correo']     = $email;
    $_SESSION['rol']        = $role;

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "User registered successfully.",
        "role"    => $role
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