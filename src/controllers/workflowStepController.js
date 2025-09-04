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

// 🔥 Create workflow step (Append or Renumber)
exports.createWorkflowStep = async (req, res) => {
  const { workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved, stepAction } = req.body;

  if (!workflow_template_id || !step_number || !name) {
    return res.status(400).json({ success: false, message: 'Workflow, step number, and name are required' });
  }

  try {
    if (stepAction === 'renumber') {
      // shift all steps >= step_number
      await WorkflowStep.shiftStepsDown(workflow_template_id, step_number);

      // insert new step at chosen position
      const result = await WorkflowStep.create(
        workflow_template_id,
        step_number,
        name,
        assigned_department,
        assigned_user_id,
        tat,
        is_auto_approved
      );

      return res.status(201).json({
        success: true,
        message: 'Workflow step inserted and steps renumbered successfully',
        stepId: result.insertId
      });
    } else {
      // default append → insert at end
      const maxStep = await WorkflowStep.getMaxStepNumber(workflow_template_id);
      const newStepNumber = maxStep + 1;

      const result = await WorkflowStep.create(
        workflow_template_id,
        newStepNumber,
        name,
        assigned_department,
        assigned_user_id,
        tat,
        is_auto_approved
      );

      return res.status(201).json({
        success: true,
        message: 'Workflow step appended successfully',
        stepId: result.insertId
      });
    }
  } catch (err) {
    console.error('Error creating workflow step:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Update workflow step (simplified, no renumber here)
exports.updateWorkflowStep = async (req, res) => {
  const { id } = req.params;
  const { workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved, stepAction } = req.body;

  if (!workflow_template_id || !step_number || !name) {
    return res.status(400).json({ success: false, message: 'Workflow, step number, and name are required' });
  }

  try {
    if (stepAction === 'renumber') {
      // Get all steps for this workflow
      const steps = await WorkflowStep.getAllByWorkflow(workflow_template_id);
      const oldStep = steps.find(s => s.step_id == id);
      if (!oldStep) return res.status(404).json({ success: false, message: 'Workflow step not found' });

      const newNumber = parseInt(step_number);
      const oldNumber = parseInt(oldStep.step_number);

      // Shift steps accordingly
      const updatedSteps = steps.map(s => {
        if (s.step_id == id) return s; // skip the step being edited

        if (newNumber < oldNumber) {
          // moving up → shift steps between newNumber and oldNumber-1 down (+1)
          if (s.step_number >= newNumber && s.step_number < oldNumber) {
            return { ...s, step_number: s.step_number + 1 };
          }
        } else if (newNumber > oldNumber) {
          // moving down → shift steps between oldNumber+1 and newNumber up (-1)
          if (s.step_number <= newNumber && s.step_number > oldNumber) {
            return { ...s, step_number: s.step_number - 1 };
          }
        }
        return s;
      });

      // Update affected steps
      await Promise.all(updatedSteps.map(s =>
        WorkflowStep.update(
          s.step_id,
          s.workflow_template_id,
          s.step_number,
          s.name,
          s.assigned_department,
          s.assigned_user_id,
          s.tat,
          s.is_auto_approved
        )
      ));

      // Update the edited step
      await WorkflowStep.update(id, workflow_template_id, newNumber, name, assigned_department, assigned_user_id, tat, is_auto_approved);

      return res.json({ success: true, message: 'Workflow step updated and renumbered successfully' });

    } else {
      // Normal update without renumber
      const result = await WorkflowStep.update(
        id,
        workflow_template_id,
        step_number,
        name,
        assigned_department,
        assigned_user_id,
        tat,
        is_auto_approved
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Workflow step not found' });
      return res.json({ success: true, message: 'Workflow step updated successfully' });
    }

  } catch (err) {
    console.error('Error updating workflow step:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};


// Delete workflow step and renumber
exports.deleteWorkflowStep = async (req, res) => {
  const { id } = req.params;

  try {
    const step = await WorkflowStep.findById(id);
    if (!step || step.length === 0) {
      return res.status(404).json({ success: false, message: 'Workflow step not found' });
    }
    const workflow_template_id = step[0].workflow_template_id;

    await WorkflowStep.delete(id);

    const remainingSteps = await WorkflowStep.getAllByWorkflow(workflow_template_id);

    for (let i = 0; i < remainingSteps.length; i++) {
      const s = remainingSteps[i];
      await WorkflowStep.update(
        s.step_id,
        s.workflow_template_id,
        i + 1, // sequential renumber
        s.name,
        s.assigned_department,
        s.assigned_user_id,
        s.tat,
        s.is_auto_approved
      );
    }

    res.json({ success: true, message: 'Step deleted and remaining steps renumbered' });
  } catch (err) {
    console.error('Error deleting workflow step:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};
