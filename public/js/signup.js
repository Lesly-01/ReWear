// Obtener el rol de los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const selectedRole = urlParams.get('role'); // Devuelve "diseñador" o "comprador"

async function registrarUsuario(event) {
    event.preventDefault();

    const alertBox = document.getElementById("alertMessage");
    alertBox.classList.add("d-none");

    // Si el usuario intentó entrar a signup.html sin pasar por la selección de perfil
    if (!selectedRole || (selectedRole !== 'comprador' && selectedRole !== 'diseñador')) {
        mostrarMensaje("Por favor, selecciona primero tu perfil.", "danger");
        return;
    }

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
        role: selectedRole // Enviamos el rol capturado de la URL
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
                    window.location.href = "/public/clothes_catalog.html";
                } else if (result.role === "diseñador") {
                    window.location.href = "/public/clothes.html";
                }
            }, 1500);
        } else {
            mostrarMensaje(result.message, "danger");
        }
    } catch (error) {
        mostrarMensaje("Ocurrió un error al procesar la solicitud.", "danger");
        console.error(error);
    }
}