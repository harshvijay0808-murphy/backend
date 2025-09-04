const express = require('express');
const router = express.Router();
const rightsController = require('../controllers/rightsController');

// Get all rights
router.get('/', rightsController.getRights);

// Get one right by ID
router.get('/:id', rightsController.getRightsById);

// Create a new right
router.post('/', rightsController.createRights);

// Update a right by ID
router.put('/:id', rightsController.updateRights);

// Delete a right by ID
router.delete('/:id', rightsController.deleteRights);

module.exports = router;
