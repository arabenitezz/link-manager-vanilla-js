const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Link = require('../models/link');

// Crear nuevo comentario
router.post('/', async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    link: req.body.linkId
  });

  try {
    const newComment = await comment.save();
    // Añadir el comentario al array de comentarios del enlace
    await Link.findByIdAndUpdate(
      req.body.linkId,
      { $push: { comments: newComment._id } }
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;