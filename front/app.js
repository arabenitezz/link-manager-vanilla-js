// API endpoints configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const addLinkForm = document.getElementById('addLinkForm');
const linksList = document.getElementById('linksList');
const detailsPage = document.getElementById('detailsPage');
const mainPage = document.querySelector('main:not(#detailsPage)');
const backToHomeBtn = document.getElementById('backToHome');
const addCommentForm = document.getElementById('addCommentForm');

// State management
let currentLinkId = null;

// API Functions
async function fetchLinks(tag = '') {
  const response = await fetch(`${API_BASE_URL}/links${tag ? `?tag=${tag}` : ''}`);
  return await response.json();
}

async function createLink(linkData) {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkData)
  });
  return await response.json();
}

async function getLinkDetails(linkId) {
  const response = await fetch(`${API_BASE_URL}/links/${linkId}`);
  return await response.json();
}

async function voteLink(linkId, voteType) {
  const response = await fetch(`${API_BASE_URL}/links/${linkId}/vote`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voteType })
  });
  return await response.json();
}

async function addComment(linkId, text) {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkId, text })
  });
  return await response.json();
}

// UI Functions
function createLinkElement(link) {
  const linkDiv = document.createElement('div');
  linkDiv.className = 'link-item';
  
  // Aseguramos que los tags existan antes de usar join
  const tagsDisplay = Array.isArray(link.tags) ? link.tags.join(', ') : '';
  
  linkDiv.innerHTML = `
    <h3>${link.title}</h3>
    <p><a href="${link.url}" target="_blank">${link.url}</a></p>
    <p>Etiquetas: ${tagsDisplay}</p>
    <p>Votos: ${link.votes || 0}</p>
    <button class="details-btn" data-link-id="${link._id}">Ver detalles</button>
  `;

  // Añadimos el event listener directamente al botón
  const detailsBtn = linkDiv.querySelector('.details-btn');
  detailsBtn.addEventListener('click', async () => {
    currentLinkId = link._id;
    try {
      const linkDetails = await getLinkDetails(link._id);
      renderLinkDetails(linkDetails);
      showDetailsPage();
    } catch (error) {
      console.error('Error al obtener detalles del enlace:', error);
    }
  });

  return linkDiv;
}

function renderLinks(links) {
  linksList.innerHTML = '';
  links.forEach(link => {
    linksList.appendChild(createLinkElement(link));
  });
}

function renderLinkDetails(link) {
  document.getElementById('linkTitle').textContent = link.title;
  const linkUrlElement = document.getElementById('linkUrl');
  linkUrlElement.href = link.url;
  linkUrlElement.textContent = link.url;
  
  // Aseguramos que los tags existan antes de usar join
  const tagsDisplay = Array.isArray(link.tags) ? link.tags.join(', ') : '';
  document.getElementById('linkTags').textContent = tagsDisplay;
  
  document.getElementById('linkVotes').textContent = link.votes || 0;

  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = '';
  
  // Aseguramos que los comentarios existan antes de iterar
  if (Array.isArray(link.comments)) {
    link.comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      commentDiv.textContent = comment.text;
      commentsContainer.appendChild(commentDiv);
    });
  }
}

function showDetailsPage() {
  if (mainPage) mainPage.style.display = 'none';
  if (detailsPage) detailsPage.style.display = 'block';
}

function showMainPage() {
  if (detailsPage) detailsPage.style.display = 'none';
  if (mainPage) mainPage.style.display = 'block';
}

// Event Listeners
addLinkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    title: document.getElementById('title').value,
    url: document.getElementById('url').value,
    tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
  };

  try {
    await createLink(formData);
    addLinkForm.reset();
    const links = await fetchLinks();
    renderLinks(links);
  } catch (error) {
    console.error('Error al crear el enlace:', error);
  }
});

backToHomeBtn.addEventListener('click', () => {
  showMainPage();
  currentLinkId = null;
});

document.getElementById('voteUp').addEventListener('click', async () => {
  if (currentLinkId) {
    try {
      const updatedLink = await voteLink(currentLinkId, 'up');
      document.getElementById('linkVotes').textContent = updatedLink.votes;
    } catch (error) {
      console.error('Error al votar:', error);
    }
  }
});

document.getElementById('voteDown').addEventListener('click', async () => {
  if (currentLinkId) {
    try {
      const updatedLink = await voteLink(currentLinkId, 'down');
      document.getElementById('linkVotes').textContent = updatedLink.votes;
    } catch (error) {
      console.error('Error al votar:', error);
    }
  }
});

addCommentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (currentLinkId) {
    const commentText = document.getElementById('commentText').value;
    try {
      await addComment(currentLinkId, commentText);
      const link = await getLinkDetails(currentLinkId);
      renderLinkDetails(link);
      addCommentForm.reset();
    } catch (error) {
      console.error('Error al añadir comentario:', error);
    }
  }
});

// Initial load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const links = await fetchLinks();
    renderLinks(links);
    // Aseguramos que la página principal esté visible al inicio
    showMainPage();
  } catch (error) {
    console.error('Error al cargar enlaces:', error);
  }
});