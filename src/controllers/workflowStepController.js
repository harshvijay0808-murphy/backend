const WorkflowStep = require('../models/WorkflowStep');

// Get all workflow steps
exports.getAllWorkflowSteps = async (req, res) => {
  try {
    const steps = await WorkflowStep.getAll();
    res.json({ success: true, data: steps });
  } catch (err) {
    console.error('Error fetching workflow steps:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Get workflow step by ID
exports.getWorkflowStepById = async (req, res) => {
  const { id } = req.params;
  try {
    const step = await WorkflowStep.findById(id);
    if (!step || step.length === 0) return res.status(404).json({ success: false, message: 'Workflow step not found' });
    res.json({ success: true, data: step[0] });
  } catch (err) {
    console.error('Error fetching workflow step:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Create workflow step
exports.createWorkflowStep = async (req, res) => {
  const { workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved } = req.body;

  if (!workflow_template_id || !step_number || !name) {
    return res.status(400).json({ success: false, message: 'Workflow, step number, and name are required' });
  }

  try {
    const result = await WorkflowStep.create(workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved);
    res.status(201).json({ success: true, message: 'Workflow step created successfully', stepId: result.insertId });
  } catch (err) {
    console.error('Error creating workflow step:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Update workflow step (Append or Renumber)
exports.updateWorkflowStep = async (req, res) => {
  const { id } = req.params;
  const { workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved, stepAction } = req.body;

  if (!workflow_template_id || !step_number || !name) {
    return res.status(400).json({ success: false, message: 'Workflow, step number, and name are required' });
  }

  try {
    if (stepAction === 'renumber') {
      // Fetch all steps for this workflow
      const steps = await WorkflowStep.getAllByWorkflow(workflow_template_id);

      // Insert new step and shift following steps
      const updatedSteps = steps.map(step => {
        if (parseFloat(step.step_number) >= parseFloat(step_number)) {
          return { ...step, step_number: parseFloat(step.step_number) + 1 };
        }
        return step;
      });

      // Update all affected steps
      await Promise.all(updatedSteps.map(s => WorkflowStep.update(
        s.step_id,
        s.workflow_template_id,
        s.step_number,
        s.name,
        s.assigned_department,
        s.assigned_user_id,
        s.tat,
        s.is_auto_approved
      )));

      // Update the target step
      await WorkflowStep.update(id, workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved);

      return res.json({ success: true, message: 'Workflow step updated and renumbered successfully' });
    } else {
      // Append: just update normally
      const result = await WorkflowStep.update(id, workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved);
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Workflow step not found' });
      return res.json({ success: true, message: 'Workflow step updated successfully' });
    }
  } catch (err) {
    console.error('Error updating workflow step:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Delete workflow step
// exports.deleteWorkflowStep = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await WorkflowStep.delete(id);
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Workflow step not found' });
//     res.json({ success: true, message: 'Workflow step deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting workflow step:', err);
//     res.status(500).json({ success: false, error: 'Database error' });
//   }
// };
// Delete workflow step and renumber
exports.deleteWorkflowStep = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get the step to know its workflow_template_id
    const step = await WorkflowStep.findById(id);
    console.log(step);
    if (!step || step.length === 0) {
      return res.status(404).json({ success: false, message: 'Workflow step not found' });
    }
    const workflow_template_id = step[0].workflow_template_id;

    // 2. Delete the step
    await WorkflowStep.delete(id);

    // 3. Fetch remaining steps for this workflow
    const remainingSteps = await WorkflowStep.getAllByWorkflow(workflow_template_id);

    // 4. Renumber sequentially
    for (let i = 0; i < remainingSteps.length; i++) {
      const s = remainingSteps[i];
      await WorkflowStep.update(
        s.step_id,
        s.workflow_template_id,
        i + 1, // new sequential step_number
        s.name,
        s.assigned_department,
        s.assigned_user_id,
        s.tat,
        s.is_auto_approved
      );
    }

    res.json({ success: true, message: 'Step deleted and remaining steps renumbered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

