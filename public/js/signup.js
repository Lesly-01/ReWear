function mostrarMensaje(mensaje, tipo) {
    const alertBox = document.getElementById("alertMessage");
    if (alertBox) {
        alertBox.className = `alert alert-${tipo} w-100`;
        alertBox.textContent = mensaje;
        alertBox.classList.remove("d-none");
    }
}

async function registrarUsuario(event) {
    event.preventDefault();

    // 1. Obtener el rol directamente adentro para evitar problemas de inicialización
    const urlParams = new URLSearchParams(window.location.search);
    const selectedRole = urlParams.get('role'); // Devuelve "diseñador" o "comprador"

    const alertBox = document.getElementById("alertMessage");
    if (alertBox) alertBox.classList.add("d-none");

    // 2. Validar que la URL traiga un rol válido
    if (!selectedRole || (selectedRole !== 'comprador' && selectedRole !== 'diseñador')) {
        mostrarMensaje("Por favor, selecciona primero tu perfil.", "danger");
        return;
    }

    // 3. Capturar valores de los campos
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        mostrarMensaje("Las contraseñas no coinciden.", "danger");
        return;
    }

    const data = {
        email: email,
        username: username,
        phone: phone,
        password: password,
        confirm_password: confirmPassword,
        role: selectedRole
    };

    try {
        const response = await fetch("../auth/signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            mostrarMensaje(result.message, "success");
            
            setTimeout(() => {
                if (result.role === "comprador") {
                    window.location.href = "clothes_catalog.html";
                } else if (result.role === "diseñador") {
                    window.location.href = "clothes.html";
                }
            }, 1500);
        } else {
            mostrarMensaje(result.message, "danger");
        }
    } catch (error) {
        mostrarMensaje("Ocurrió un error al procesar la solicitud.", "danger");
        console.error("Error en Fetch:", error);
    }
}