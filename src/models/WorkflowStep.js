const db = require('../config/db');

const WorkflowStep = {
  getAll: () => {
    const query = `
      SELECT 
        ws.step_id,
        ws.step_number,
        ws.name AS name,
        ws.tat,
        ws.is_auto_approved,
        ws.workflow_template_id,
        wt.name AS workflowTemplateName,
        ws.assigned_department,
        d.name AS departmentName,
        ws.assigned_user_id,
        u.name AS username
      FROM workflow_steps ws
      LEFT JOIN workflow_templates wt ON ws.workflow_template_id = wt.workflow_template_id
      LEFT JOIN departments d ON ws.assigned_department = d.dep_id
      LEFT JOIN users u ON ws.assigned_user_id = u.id
      ORDER BY  ws.step_number ASC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => (err ? reject(err) : resolve(results)));
    });
  },
// ws.workflow_template_id,
  getAllByWorkflow: (workflow_template_id) => {
    const query = `
      SELECT * FROM workflow_steps
      WHERE workflow_template_id = ?
      ORDER BY step_number ASC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [workflow_template_id], (err, results) => (err ? reject(err) : resolve(results)));
    });
  },

  findById: (id) => {
    const query = `
      SELECT 
        ws.step_id,
        ws.step_number,
        ws.name AS name,
        ws.tat,
        ws.is_auto_approved,
        ws.workflow_template_id,
        wt.name AS workflowTemplateName,
        ws.assigned_department,
        d.name AS departmentName,
        ws.assigned_user_id,
        u.name AS username
      FROM workflow_steps ws
      LEFT JOIN workflow_templates wt ON ws.workflow_template_id = wt.workflow_template_id
      LEFT JOIN departments d ON ws.assigned_department = d.dep_id
      LEFT JOIN users u ON ws.assigned_user_id = u.id
      WHERE ws.step_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => (err ? reject(err) : resolve(results)));
    });
  },

  create: (workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved) => {
    const query = `
      INSERT INTO workflow_steps 
      (workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved],
        (err, result) => (err ? reject(err) : resolve({ insertId: result.insertId }))
      );
    });
  },

  update: (id, workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved) => {
    const query = `
      UPDATE workflow_steps
      SET workflow_template_id = ?, step_number = ?, name = ?, 
          assigned_department = ?, assigned_user_id = ?, tat = ?, is_auto_approved = ?
      WHERE step_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved, id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  },

  delete: (id) => {
    const query = `DELETE FROM workflow_steps WHERE step_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => (err ? reject(err) : resolve(result)));
    });
  }
};

module.exports = WorkflowStep;
