const express = require('express');
const router = express.Router();
const roleRightsController = require('../controllers/roleRightsController');

// Get all role rights
router.get('/', roleRightsController.getRoleRights);

// Get rights for a specific role
router.get('/:roleId', roleRightsController.getRightsByRole);

// Assign/update rights
router.post('/', roleRightsController.assignRights);

module.exports = router;
