const db = require('../config/db');

const RoleRights = {
  // Get all role rights with role and right names
  getAll: async () => {
    const sql = `
      SELECT rr.id, rr.role_id, rr.right_id, r.name AS roleName, rt.name AS rightName
      FROM roleRights rr
      LEFT JOIN roles r ON rr.role_id = r.id
      LEFT JOIN rights rt ON rr.right_id = rt.id
      ORDER BY rr.id DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get all rights for a specific role
  getByRoleId: async (roleId) => {
    const sql = 'SELECT * FROM roleRights WHERE role_id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [roleId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Assign/update rights for a role
  assignRights: async (roleId, rights) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM roleRights WHERE role_id = ?', [roleId], (err) => {
        if (err) return reject(err);
        if (rights.length === 0) return resolve({ message: 'Rights cleared' });

        const values = rights.map(rId => [roleId, rId]);
        db.query('INSERT INTO roleRights (role_id, right_id) VALUES ?', [values], (err2) => {
          if (err2) return reject(err2);
          resolve({ message: 'Rights updated successfully' });
        });
      });
    });
  }
};

module.exports = RoleRights;
