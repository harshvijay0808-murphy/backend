const db = require('../config/db');

const Department = {
  getAll: (callback) => {
    db.query(
      'SELECT dep_id AS id, name AS departmentName FROM departments ORDER BY dep_id ASC',
      callback
    );
  },
  findById: (id, callback) => {
    db.query(
      'SELECT dep_id AS id, name AS departmentName FROM departments WHERE dep_id = ?',
      [id],
      callback
    );
  },
  create: (departmentName, callback) => {
    const now = new Date();
    db.query(
      'INSERT INTO departments (name, created_at, updated_at) VALUES (?, ?, ?)',
      [departmentName, now, now],
      callback
    );
  },
  update: (id, departmentName, callback) => {
    const now = new Date();
    db.query(
      'UPDATE departments SET name = ?, updated_at = ? WHERE dep_id = ?',
      [departmentName, now, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query(
      'DELETE FROM departments WHERE dep_id = ?',
      [id],
      callback
    );
  }
};

module.exports = Department;
