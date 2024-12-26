// Elementos del DOM
const addLinkForm = document.getElementById('addLinkForm');
const linksContainer = document.getElementById('linksList');
const detailsPage = document.getElementById('detailsPage');
const mainPage = document.querySelector('main:not(#detailsPage)');
const backToHomeButton = document.getElementById('backToHome');
const addCommentForm = document.getElementById('addCommentForm');

// Gestión de enlaces
addLinkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        url: document.getElementById('url').value,
        tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
        votes: 0,
        comments: []
    };
  
    try {
        const response = await fetch('http://localhost:5000/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
  
        if (!response.ok) {
            throw new Error('Error al guardar el enlace');
        }
  
        const data = await response.json();
        console.log('Enlace guardado:', data);
        
        addLinkForm.reset();
        loadLinks();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Cargar enlaces
async function loadLinks() {
    try {
        const response = await fetch('http://localhost:5000/api/links');
        const links = await response.json();
        
        linksContainer.innerHTML = links.map(link => `
            <div class="link-item" data-id="${link._id}">
                <h3>${link.title}</h3>
                <a href="${link.url}" target="_blank">${link.url}</a>
                <p>Tags: ${link.tags.join(', ')}</p>
                <p>Votos: ${link.votes || 0}</p>
                <button class="view-details-btn" onclick="showLinkDetails('${link._id}')">
                    Ver detalles / Comentar / Votar
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar los enlaces:', error);
    }
}

// Mostrar detalles del enlace
async function showLinkDetails(linkId) {
    try {
        const response = await fetch(`http://localhost:5000/api/links/${linkId}`);
        const link = await response.json();

        // Actualizar la información en la página de detalles
        document.getElementById('linkTitle').textContent = link.title;
        document.getElementById('linkUrl').href = link.url;
        document.getElementById('linkUrl').textContent = link.url;
        document.getElementById('linkTags').textContent = link.tags.join(', ');
        document.getElementById('linkVotes').textContent = link.votes || 0;

        // Mostrar comentarios
        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = (link.comments || []).map(comment => `
            <div class="comment">
                <p>${comment.text}</p>
                <small>Fecha: ${new Date(comment.date).toLocaleDateString()}</small>
            </div>
        `).join('');

        // Configurar botones de votación
        document.getElementById('voteUp').onclick = () => handleVote(linkId, 1);
        document.getElementById('voteDown').onclick = () => handleVote(linkId, -1);

        // Configurar el formulario de comentarios
        addCommentForm.onsubmit = (e) => handleNewComment(e, linkId);

        // Mostrar la página de detalles
        mainPage.style.display = 'none';
        detailsPage.style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los detalles:', error);
    }
}

// Manejar votaciones
async function handleVote(linkId, value) {
    try {
        const response = await fetch(`http://localhost:5000/api/links/${linkId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
        });

        if (!response.ok) {
            throw new Error('Error al votar');
        }

        const updatedLink = await response.json();
        document.getElementById('linkVotes').textContent = updatedLink.votes;
    } catch (error) {
        console.error('Error al votar:', error);
        alert('Error al votar. Por favor, intenta nuevamente.');
    }
}

// Manejar nuevos comentarios
async function handleNewComment(e, linkId) {
    e.preventDefault();
    const commentText = document.getElementById('commentText').value;

    try {
        const response = await fetch(`http://localhost:5000/api/links/${linkId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: commentText,
                date: new Date()
            })
        });

        if (!response.ok) {
            throw new Error('Error al añadir comentario');
        }

        // Recargar los detalles para mostrar el nuevo comentario
        await showLinkDetails(linkId);
        document.getElementById('commentText').value = '';
    } catch (error) {
        console.error('Error al añadir comentario:', error);
        alert('Error al añadir el comentario. Por favor, intenta nuevamente.');
    }
}

// Volver a la página principal
backToHomeButton.addEventListener('click', () => {
    detailsPage.style.display = 'none';
    mainPage.style.display = 'block';
    loadLinks(); // Recargar los enlaces para mostrar cambios
});

// Cargar enlaces al iniciar la página
document.addEventListener('DOMContentLoaded', loadLinks);