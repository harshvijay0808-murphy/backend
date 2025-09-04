const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Get all roles
router.get('/', rolesController.getRoles);

// Get one role by ID
router.get('/:id', rolesController.getRolesById);

// Create a new role
router.post('/', rolesController.createRoles);

// Update a role by ID
router.put('/:id', rolesController.updateRoles);

// Delete a role by ID
router.delete('/:id', rolesController.deleteRoles);

module.exports = router;
