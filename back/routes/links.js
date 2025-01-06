const express = require('express');
const router = express.Router();
const Link = require('../models/link');

// Obtener todos los enlaces 
router.get('/', async (req, res) => {
  try {
    const { tags } = req.query;
    
    // Si no hay tags, devuelve todos los links ordenados por votos
    if (!tags) {
      const links = await Link.find({}).sort({ votes: -1 });
      return res.json(links);
    }

    // Procesa los tags
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0); // elimina tags vacíos
    
    // Si después de procesar no hay tags válidos, devuelve todos los links
    if (tagsArray.length === 0) {
      const links = await Link.find({}).sort({ votes: -1 });
      return res.json(links);
    }

    // Busca links que contengan al menos uno de los tags (búsqueda inclusiva)
    const links = await Link.find({
      tags: { $in: tagsArray }
    }).sort({ votes: -1 });

    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un enlace específico con sus comentarios
router.get('/:id', async (req, res) => {
  try {
    const link = await Link.findById(req.params.id).populate('comments');
    if (!link) return res.status(404).json({ message: 'Enlace no encontrado' });
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nuevo enlace
router.post('/', async (req, res) => {
  const link = new Link({
    title: req.body.title,
    url: req.body.url,
    tags: req.body.tags
  });

  try {
    const newLink = await link.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Votar un enlace (up/down)
router.patch('/:id/vote', async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' o 'down'
    const increment = voteType === 'up' ? 1 : -1;
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: increment } },
      { new: true }
    );
    res.json(link);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;