const db = require('../config/db');

const Roles = {
  // Get all roles with department info
  getAll: async () => {
    const sql = `
      SELECT r.id, r.name , d.dep_id AS departmentId, d.name AS departmentName
      FROM roles r
      LEFT JOIN departments d ON r.dep_id = d.dep_id
      ORDER BY r.id DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get role by ID
  findById: async (id) => {
    const sql = `
      SELECT r.id, r.name, d.dep_id AS departmentId, d.name AS departmentName
      FROM roles r
      LEFT JOIN departments d ON r.dep_id = d.dep_id
      WHERE r.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // Create role
  create: async (name, dep_id) => {
    const sql = 'INSERT INTO roles (name, dep_id) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      db.query(sql, [name, dep_id], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // Update role
  update: async (id, name, dep_id) => {
    const sql = 'UPDATE roles SET name = ?, dep_id = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [name, dep_id, id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  },

  // Delete role
  delete: async (id) => {
    const sql = 'DELETE FROM roles WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  },

  // Find role by unique name
  findByName: async (name) => {
    const sql = 'SELECT * FROM roles WHERE name = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [name], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  }
};

module.exports = Roles;
