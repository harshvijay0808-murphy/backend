const Roles = require('../models/Roles');

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const results = await Roles.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one role by ID
exports.getRolesById = async (req, res) => {
  try {
    const result = await Roles.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Role not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new role
exports.createRoles = async (req, res) => {
  const { name, dep_id } = req.body;
  if (!name) return res.status(400).json({ message: 'Role name required' });

  try {
    // Check for unique role name
    const existing = await Roles.findByName(name);
    if (existing) return res.status(400).json({ message: 'Role name already exists' });

    const id = await Roles.create(name, dep_id || null);
    res.status(201).json({ id, name, dep_id: dep_id || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a role
exports.updateRoles = async (req, res) => {
  const { name, dep_id } = req.body;

  try {
    // Check for unique role name excluding current record
    const existing = await Roles.findByName(name);
    if (existing && existing.id !== parseInt(req.params.id)) {
      return res.status(400).json({ message: 'Role name already exists' });
    }

    const affectedRows = await Roles.update(req.params.id, name, dep_id || null);
    if (affectedRows === 0) return res.status(404).json({ message: 'Role not found' });

    res.json({ id: req.params.id, name, dep_id: dep_id || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a role
exports.deleteRoles = async (req, res) => {
  try {
    const affectedRows = await Roles.delete(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
