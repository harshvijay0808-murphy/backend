const Workflow = require('../models/Workflow');
const Document = require('../models/Document');

// Get all workflow templates
exports.getWorkflows = (req, res) => {
    Workflow.getAll((err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
};

// Get a workflow template by ID
exports.getWorkflowById = (req, res) => {
    Workflow.findById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Workflow template not found' });
        res.json(results[0]);
    });
};

// Create a new workflow template
exports.createWorkflow = (req, res) => {
    const { name, tat, document_id, status } = req.body;
    if (!name || !tat || !document_id)
        return res.status(400).json({ message: 'Name, TAT, and Document ID are required' });

    // Default status to 'active' if not provided
    const workflowStatus = status || 'active';

    // Check if document exists
    Document.findById(document_id, (err, docResults) => {
        if (err) return res.status(500).json({ message: err.message });
        if (docResults.length === 0) return res.status(400).json({ message: 'Document not found' });

        Workflow.create(name, tat, document_id, workflowStatus, (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ 
                workflow_template_id: result.insertId, 
                name, 
                tat, 
                document_id,
                status: workflowStatus
            });
        });
    });
};

// Update a workflow template
// exports.updateWorkflow = (req, res) => {
//     const {tat, document_id, status } = req.body;
//     if (!tat || !document_id || !status)
//         return res.status(400).json({ message: 'TAT, Document ID, and Status are required' });

//     Workflow.update(req.params.id, tat, document_id, status, (err, result) => {
//         if (err) return res.status(500).json({ message: err.message });
//         if (result.affectedRows === 0) return res.status(404).json({ message: 'Workflow template not found' });
//         res.json({ 
//             workflow_template_id: req.params.id,  
//             tat, 
//             document_id,
//             status
//         });
//     });
// };const Workflow = require('../models/Workflow');

// Update a workflow template
exports.updateWorkflow = (req, res) => {
  const { name, tat, document_id, status } = req.body;

  if (!tat || !document_id || !status)
    return res.status(400).json({ message: 'TAT, Document ID, and Status are required' });

  // Fetch the current workflow first
  Workflow.findById(req.params.id, (err, workflow) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!workflow[0]) return res.status(404).json({ message: 'Workflow template not found' });

    // Check if the user tried to change the name
    if (name && name !== workflow[0].name) {
      return res.status(400).json({ message: 'Workflow name cannot be changed' });
    }

    // Proceed to update
    Workflow.update(req.params.id, tat, document_id, status, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Workflow template not found' });

      res.json({
        workflow_template_id: workflow[0].workflow_template_id,
        name: workflow[0].name, // name remains unchanged
        tat,
        document_id,
        status
      });
    });
  });
};


// Delete a workflow template
exports.deleteWorkflow = (req, res) => {
    Workflow.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Workflow template not found' });
        res.json({ message: 'Workflow template deleted successfully' });
    });
};
