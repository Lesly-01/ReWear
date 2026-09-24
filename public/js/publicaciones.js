document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const prendaId = urlParams.get('id');

    if (!prendaId) {
        console.error("No prenda ID found in URL");
        return;
    }

    try {
        const response = await fetch(`../prendas/read_single.php?id=${prendaId}`);
        const result = await response.json();

        if (result.success && result.data) {
            const data = result.data;

            // 1. Image
            const imgEl = document.getElementById('postMainImage');
            if (imgEl) imgEl.src = data.imagen_url ? `../public/${data.imagen_url}` : 'IMG/default_request.jpg';

            // 2. Title
            const titleEl = document.getElementById('postTitle');
            if (titleEl) titleEl.textContent = data.titulo;

            // 3. Designer
            const designerEl = document.getElementById('postDesignerName');
            if (designerEl) designerEl.textContent = `@${data.designer_name}`;

            // 4. Category/Tags
            const tagsContainer = document.getElementById('postTagsContainer');
            if (tagsContainer && data.categoria) {
                const categories = data.categoria.split(',');
                tagsContainer.innerHTML = categories.map(cat =>
                    `<span class="badge badge-rewear rounded-pill px-3 py-2 fw-semibold">${cat.trim()}</span>`
                ).join('');
            }

            // 5. Description
            const descEl = document.getElementById('postDescription');
            if (descEl) descEl.textContent = data.descripcion || 'No description provided.';

            // 6. Price Range
            const priceEl = document.getElementById('postPriceRange');
            if (priceEl) {
                priceEl.innerHTML = `$${parseFloat(data.precio_minimo).toFixed(2)} - $${parseFloat(data.precio_maximo).toFixed(2)} <small class="fs-6 text-muted">USD</small>`;
            }

            // 7. Date
            const dateEl = document.getElementById('postDate');
            if (dateEl && data.fecha_creacion) {
                const date = new Date(data.fecha_creacion);
                dateEl.textContent = `Post made on ${date.toLocaleDateString('en-US')}`;
            }

        } else {
            console.error("Error loading post details:", result.message);
        }
    } catch (error) {
        console.error("Fetch error in publicaciones.js:", error);
    }
});