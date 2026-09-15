function mostrarMensaje(mensaje, tipo) {
    const alertBox = document.getElementById("alertMessage");
    if (alertBox) {
        alertBox.className = `alert alert-${tipo} w-100`;
        alertBox.textContent = mensaje;
        alertBox.classList.remove("d-none");
    }
}

async function iniciarSesion(event) {
    event.preventDefault();

    const alertBox = document.getElementById("alertMessage");
    if (alertBox) alertBox.classList.add("d-none");

    const identifier = document.getElementById("identifier").value.trim();
    const password = document.getElementById("password").value;

    const data = {
        identifier: identifier,
        password: password
    };

    try {
        const response = await fetch("../auth/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // 1. GUARDAR DATOS AQUÍ (Antes del setTimeout y de la redirección)
            // Guardamos el objeto que devuelve tu backend o el nombre ingresado
            const usuarioSesion = {
                username: result.username || identifier, // Usa la respuesta del servidor o el identificador ingresado
                role: result.role
            };
            localStorage.setItem('usuarioSesion', JSON.stringify(usuarioSesion));

            mostrarMensaje(result.message, "success");

            // 2. Redirección basada en el rol
            setTimeout(() => {
                if (result.role === "comprador") {
                    window.location.href = "clothes_catalog.html";
                } else if (result.role === "disenador") {
                    window.location.href = "clothes.html";
                } else {
                    window.location.href = "homepage.html";
                }
            }, 1200);
        } else {
            mostrarMensaje(result.message, "danger");
        }
    } catch (error) {
        mostrarMensaje("An error occurred while connecting to the server.", "danger");
        console.error("Error en Fetch Login:", error);
    }
}