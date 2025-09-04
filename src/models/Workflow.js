const db = require('../config/db');

const Workflow = {
  // Get all workflows
  getAll: (callback) => {
    const query = `
      SELECT 
        w.workflow_template_id,
        w.name,
        w.tat,
        w.document_id,
        w.status,
        d.name AS documentName
      FROM workflow_templates w
      LEFT JOIN documents d ON w.document_id = d.id
      ORDER BY w.workflow_template_id ASC
    `;
    db.query(query, callback);
  },

  // Find workflow by ID
  findById: (id, callback) => {
    const query = `
      SELECT 
        w.workflow_template_id,
        w.name,
        w.tat,
        w.document_id,
        w.status,
        d.name AS documentName
      FROM workflow_templates w
      LEFT JOIN documents d ON w.document_id = d.id
      WHERE w.workflow_template_id = ?
    `;
    db.query(query, [id], callback);
  },

  // Create workflow
  create: (name, tat, document_id, status, callback) => {
    const now = new Date();
    const query = `
      INSERT INTO workflow_templates (name, tat, document_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, tat, document_id, status, now, now], callback);
  },

  // Update workflow
// Update workflow (name cannot be edited)
update: (id, tat, document_id, status, callback) => {
  const now = new Date();
  const query = `
    UPDATE workflow_templates
    SET tat = ?, document_id = ?, status = ?, updated_at = ?
    WHERE workflow_template_id = ?
  `;
  db.query(query, [tat, document_id, status, now, id], callback);
},

  // Delete workflow
  delete: (id, callback) => {
    const query = `DELETE FROM workflow_templates WHERE workflow_template_id = ?`;
    db.query(query, [id], callback);
  },
};

module.exports = Workflow;
