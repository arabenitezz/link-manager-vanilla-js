const API_BASE_URL = 'https://link-manager-backend-production.up.railway.app/api';

// DOM Elements
const elements = {
  addLinkForm: document.getElementById('addLinkForm'),
  linksList: document.getElementById('linksList'),
  detailsPage: document.getElementById('detailsPage'),
  mainPage: document.querySelector('main:not(#detailsPage)'),
  backToHomeBtn: document.getElementById('backToHome'),
  addCommentForm: document.getElementById('addCommentForm'),
  searchForm: document.getElementById('searchForm'),
  tagsSearch: document.getElementById('tagsSearch')
  
};

let currentLinkId = null;

// API Functions
const api = {
  async fetchLinks(tags = '') {
    const queryString = tags ? `?tags=${tags}` : '';
    const response = await fetch(`${API_BASE_URL}/links${queryString}`);
    return response.json();
  },

  async createLink(linkData) {
    const response = await fetch(`${API_BASE_URL}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData)
    });
    return response.json();
  },

  async getLinkDetails(linkId) {
    const response = await fetch(`${API_BASE_URL}/links/${linkId}`);
    return response.json();
  },

  async voteLink(linkId, voteType) {
    const response = await fetch(`${API_BASE_URL}/links/${linkId}/vote`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteType })
    });
    return response.json();
  },

  async copiarContenido() {
    try {
      await navigator.clipboard.writeText('Este es el texto a copiar');
      console.log('Contenido copiado al portapapeles');
      /* Resuelto - texto copiado al portapapeles con éxito */
    } catch (err) {
      console.error('Error al copiar: ', err);
      /* Rechazado - fallo al copiar el texto al portapapeles */
    }
  },

  async addComment(linkId, text) {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId, text })
    });
    return response.json();
  },

};


// UI Functions
function createLinkElement(link) {
  const linkDiv = document.createElement('div');
  linkDiv.className = 'link-item';
  
  linkDiv.innerHTML = `
    <h3>${link.title}</h3>
    <p><a href="${link.url}" target="_blank">${link.url}</a></p>
    <p>Etiquetas: ${Array.isArray(link.tags) ? link.tags.join(', ') : ''}</p>
    <p>Votos: ${link.votes || 0}</p>
    <button class="details-btn" data-link-id="${link._id}">Ver detalles</button>
  `;

  linkDiv.querySelector('.details-btn').addEventListener('click', async () => {
    currentLinkId = link._id;
    try {
      const linkDetails = await api.getLinkDetails(link._id);
      showDetailsView();
      renderLinkDetails(linkDetails);
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
  });

  return linkDiv;
}

function renderLinks(links) {
  elements.linksList.innerHTML = '';
  links.forEach(link => elements.linksList.appendChild(createLinkElement(link)));
}

function renderLinkDetails(link) {
  document.getElementById('linkTitle').textContent = link.title;
  const urlElement = document.getElementById('linkUrl');
  urlElement.href = link.url;
  urlElement.textContent = link.url;
  document.getElementById('linkTags').textContent = Array.isArray(link.tags) ? link.tags.join(', ') : '';
  document.getElementById('linkVotes').textContent = link.votes || 0;

  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = '';
  
  if (Array.isArray(link.comments)) {
    link.comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      commentDiv.textContent = comment.text;
      commentsContainer.appendChild(commentDiv);
    });
  }
}

// Event Handlers
elements.addLinkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    title: document.getElementById('title').value,
    url: document.getElementById('url').value,
    tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(Boolean)
  };

  try {
    await api.createLink(formData);
    elements.addLinkForm.reset();
    renderLinks(await api.fetchLinks());
  } catch (error) {
    console.error('Error al crear enlace:', error);
  }
});

elements.backToHomeBtn.addEventListener('click', () => {
  showMainView();
  currentLinkId = null;
});

['up', 'down'].forEach(voteType => {
  document.getElementById(`vote${voteType.charAt(0).toUpperCase() + voteType.slice(1)}`)
    .addEventListener('click', async () => {
      if (currentLinkId) {
        try {
          const link = await api.voteLink(currentLinkId, voteType);
          document.getElementById('linkVotes').textContent = link.votes;
        } catch (error) {
          console.error('Error al votar:', error);
        }
      }
    });
});

elements.addCommentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (currentLinkId) {
    try {
      await api.addComment(currentLinkId, document.getElementById('commentText').value);
      renderLinkDetails(await api.getLinkDetails(currentLinkId));
      elements.addCommentForm.reset();
    } catch (error) {
      console.error('Error al añadir comentario:', error);
    }
  }
});

// Add this event handler with the other event handlers
elements.searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchTags = elements.tagsSearch.value;
  try {
    const links = await api.fetchLinks(searchTags);
    renderLinks(links);
  } catch (error) {
    console.error('Error al buscar enlaces:', error);
  }
});

// Obtiene el año actual y lo asigna al elemento con ID 'current-year'
document.getElementById('current-year').textContent = new Date().getFullYear();

// Añadir estas nuevas funciones para manejar las vistas
function showDetailsView() {
  elements.detailsPage.classList.remove('hidden');
  elements.mainPage.classList.add('hidden');
}

function showMainView() {
  elements.detailsPage.classList.add('hidden');
  elements.mainPage.classList.remove('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  try {
    renderLinks(await api.fetchLinks());
    showMainView();
  } catch (error) {
    console.error('Error al cargar enlaces:', error);
  }
});
