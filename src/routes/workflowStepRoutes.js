// routes/workflowStepRoutes.js
const express = require('express');
const router = express.Router();
const workflowStepController = require('../controllers/workflowStepController');

router.get('/', workflowStepController.getAllWorkflowSteps);
router.get('/:id', workflowStepController.getWorkflowStepById);
router.post('/', workflowStepController.createWorkflowStep);
router.put('/:id', workflowStepController.updateWorkflowStep);
router.delete('/:id', workflowStepController.deleteWorkflowStep);

module.exports = router;
