const Presentation = require('../models/presentationModel');
const path = require('path');
const fs = require('fs');

// List all presentations
exports.getPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.findAll();
    res.status(200).json(presentations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new presentation
exports.createPresentation = async (req, res) => {
  const presentation_name = req.body.presentation_name;
  const created_by_name = req.body.created_by_name;
  const thumbnail_image = req.file ? req.file.filename : null;
  const last_updated_date = new Date();
  try {
    const newPresentation = await Presentation.create({ presentation_name, created_by_name, last_updated_date, thumbnail_image });
    res.status(201).json(newPresentation);
    console.log(newPresentation)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

// Rename presentation name
exports.renamePresentation = async (req, res) => {
  const { id } = req.params;
  const name  = req.body.presentation_name;
  const last_updated_date = req.body.last_updated_date;

  try {
    const presentation = await Presentation.findByPk(id);
    if (!presentation) return res.status(404).json({ message: 'Presentation not found' });

    presentation.presentation_name = name;
    presentation.last_updated_date = last_updated_date;
    await presentation.save();
    
    res.status(200).json(presentation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a presentation
exports.deletePresentation = async (req, res) => {
  const { id } = req.params;

  try {
    const presentation = await Presentation.findByPk(id);
    if (!presentation) return res.status(404).json({ message: 'Presentation not found' });

    // Delete thumbnail file if exists
    if (presentation.thumbnail_image) {
      const thumbnailPath = path.join(__dirname, '../uploads/', presentation.thumbnail_image);
      try {
        fs.unlinkSync(thumbnailPath);
      } catch (err) {
        console.error("Error deleting thumbnail file:", err);
        // You might want to log the error and still proceed to delete the presentation.
      }
    }

    await presentation.destroy();
    res.status(200).json({ message: 'Presentation deleted successfully' });
  } catch (err) {
    console.error("Error deleting presentation:", err);
    res.status(500).json({ error: err.message });
  }
};

