const Rights = require('../models/Rights');

// Get all rights
exports.getRights = async (req, res) => {
  try {
    const results = await Rights.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one right by ID
exports.getRightsById = async (req, res) => {
  try {
    const result = await Rights.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Right not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new right
exports.createRights = async (req, res) => {
  const { rightName, dep_id } = req.body;
  if (!rightName) return res.status(400).json({ message: 'Right name required' });

  try {
    // Check for unique right name
    const existing = await Rights.findByName(rightName);
    if (existing) return res.status(400).json({ message: 'Right name already exists' });

    const id = await Rights.create(rightName, dep_id || null);
    res.status(201).json({ id, rightName, dep_id: dep_id || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a right
exports.updateRights = async (req, res) => {
  const { rightName, dep_id } = req.body;

  try {
    // Check for unique right name excluding current record
    const existing = await Rights.findByName(rightName);
    if (existing && existing.id !== parseInt(req.params.id)) {
      return res.status(400).json({ message: 'Right name already exists' });
    }

    const affectedRows = await Rights.update(req.params.id, rightName, dep_id || null);
    if (affectedRows === 0) return res.status(404).json({ message: 'Right not found' });

    res.json({ id: req.params.id, rightName, dep_id: dep_id || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a right
exports.deleteRights = async (req, res) => {
  try {
    const affectedRows = await Rights.delete(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ message: 'Right not found' });
    res.json({ message: 'Right deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
