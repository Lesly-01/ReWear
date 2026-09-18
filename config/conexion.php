<?php
class Database {
    private $host = "localhost";
    private $db_name = "rewear";
    private $username = "root";
    private $password = ""; // En Laragon la contraseña por defecto de root suele estar vacía
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo json_encode([
                "success" => false,
                "message" => "Error de conexión a la base de datos: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}