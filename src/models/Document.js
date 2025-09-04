const db = require('../config/db');

const Document = {
  getAll: (callback) => {
    db.query(
      'SELECT id, name FROM documents ORDER BY id ASC',
      callback
    );
  },
  findById: (id, callback) => {
    db.query(
      'SELECT id, name FROM documents WHERE id = ?',
      [id],
      callback
    );
  },
  create: (name, callback) => {
    const now = new Date();
    db.query(
      'INSERT INTO documents (name, created_at, updated_at) VALUES (?, ?, ?)',
      [name, now, now],
      callback
    );
  },
  update: (id, name, callback) => {
    const now = new Date();
    db.query(
      'UPDATE documents SET name = ?, updated_at = ? WHERE id = ?',
      [name, now, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query(
      'DELETE FROM documents WHERE id = ?',
      [id],
      callback
    );
  }
};

module.exports = Document;
