const db = require('../config/db');

const Rights = {
  getAll: async () => {
    const sql = `
      SELECT r.id, r.name AS rightName, d.dep_id AS departmentId, d.name AS departmentName
      FROM rights r
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

  findById: async (id) => {
    const sql = `
      SELECT r.id, r.name AS rightName, d.dep_id AS departmentId, d.name AS departmentName
      FROM rights r
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

  create: async (name, dep_id) => {
    const sql = 'INSERT INTO rights (name, dep_id) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      db.query(sql, [name, dep_id], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  update: async (id, name, dep_id) => {
    const sql = 'UPDATE rights SET name = ?, dep_id = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [name, dep_id, id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  },

  delete: async (id) => {
    const sql = 'DELETE FROM rights WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  },

  findByName: async (name) => {
    const sql = 'SELECT * FROM rights WHERE name = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [name], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  }
};

module.exports = Rights;
