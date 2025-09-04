const RoleRights = require('../models/RoleRights');

exports.getRoleRights = async (req, res) => {
  try {
    const results = await RoleRights.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRightsByRole = async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const results = await RoleRights.getByRoleId(roleId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignRights = async (req, res) => {
  try {
    const { roleId, rights } = req.body; // rights = [1, 2, 3]
    if (!roleId || !Array.isArray(rights)) return res.status(400).json({ message: 'Invalid request' });

    const result = await RoleRights.assignRights(roleId, rights);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
