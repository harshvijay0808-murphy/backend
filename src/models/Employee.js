const db = require('../config/db'); // your MySQL connection
const bcrypt = require('bcrypt');

const Employee = {
  // Get all active employees
  getAll: async () => {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT e.*, d.name AS departmentName, r.name AS roleName
      FROM employees e
      LEFT JOIN departments d ON e.dep_id = d.dep_id
      LEFT JOIN roles r ON e.role_id = r.id
    `; db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get employee by ID
  findById: async (emp_id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM employees WHERE emp_id = ?';
      db.query(sql, [emp_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // Find employee by email (case-insensitive)
  findByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM employees WHERE LOWER(registered_email) = LOWER(?)';
      db.query(sql, [email.trim()], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // Create a new employee

  create: async (data) => {
    return new Promise(async (resolve, reject) => {
      const connection = db; // your database connection

      // Start a transaction to ensure both inserts succeed or fail together
      connection.beginTransaction(async (err) => {
        if (err) return reject(err);

        try {
          // 1. Insert into employees table
          const employeeSql = `INSERT INTO employees 
          (user_id,name, dep_id, designation, role_id, registered_email, phone_number, address, 
           aadhar_num, pan_num, image_aadhar, image_pan, dob, doj, activeYN, created_at, updated_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW(), NOW())`;

          const employeeParams = [
            data.user_id,
            data.name,
            data.dep_id || null,
            data.designation || null,
            data.role_id || null,
            data.registered_email,
            data.phone_number || null,
            data.address || null,
            data.aadhar_num || null,
            data.pan_num || null,
            data.image_aadhar || null,
            data.image_pan || null,
            data.dob || null,
            data.doj || null,
            data.activeYN || 'Y',
          ];

          const employeeResult = await new Promise((res, rej) => {
            connection.query(employeeSql, employeeParams, (err, result) => {
              if (err) return rej(err);
              res(result);
            });
          });

          // 2. Hash default password
          const defaultPassword = 'Murphy@1972';
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);

          // 3. Insert into users table
          const userSql = `INSERT INTO users 
          (name, email, user_id , mobile, password, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;

          const userParams = [
            data.name,
            data.registered_email,
            data.user_id,
            data.phone_number || null,
            hashedPassword,
          ];

          await new Promise((res, rej) => {
            connection.query(userSql, userParams, (err, result) => {
              if (err) return rej(err);
              res(result);
            });
          });

          // Commit transaction
          connection.commit((err) => {
            if (err) return connection.rollback(() => reject(err));
            resolve(employeeResult.insertId);
          });

        } catch (error) {
          connection.rollback(() => reject(error));
        }
      });
    });
  },

  // create: async (data) => {
  //   return new Promise((resolve, reject) => {
  //     const sql = `INSERT INTO employees 
  //       (user_id,name, dep_id, designation, role_id, registered_email, phone_number, address, 
  //        aadhar_num, pan_num, image_aadhar, image_pan, dob, doj, activeYN, created_at, updated_at)
  //       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  //     const params = [
  //       data.user_id,
  //       data.name,
  //       data.dep_id || null,
  //       data.designation || null,
  //       data.role_id || null,
  //       data.registered_email,
  //       data.phone_number || null,
  //       data.address || null,
  //       data.aadhar_num || null,
  //       data.pan_num || null,
  //       data.image_aadhar || null,
  //       data.image_pan || null,
  //       data.dob || null,
  //       data.doj || null,
  //       data.activeYN || 'Y',
  //     ];

  //     db.query(sql, params, (err, result) => {
  //       console.log(data);
  //       if (err) return reject(err);
  //       resolve(result.insertId);
  //     });
  //   });
  // },

  // Update employee by ID
  // in your Employee model
// update: async (emp_id, data) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const allowedFields = [
//         'user_id', 'name', 'dep_id', 'designation', 'role_id',
//         'registered_email', 'phone_number', 'address',
//         'aadhar_num', 'pan_num', 'image_aadhar', 'image_pan',
//         'dob', 'doj', 'activeYN'
//       ];

//       const fields = [];
//       const params = [];

//       for (const key of allowedFields) {
//         if (data && data[key] !== undefined) {
//           fields.push(`${key} = ?`);
//           params.push(data[key]);
//         }
//       }

//       // If nothing valid to update, bail out
//       if (fields.length === 0) {
//         return reject(new Error('No valid fields to update'));
//       }

//       // Always update the timestamp (no placeholder)
//       fields.push('updated_at = NOW()');

//       // Build SQL and push emp_id as last param
//       const sql = `UPDATE employees SET ${fields.join(', ')} WHERE emp_id = ?`;
//       params.push(emp_id);

//       // Debug log: SQL and params
//       console.log('Employee.update SQL:', sql);
//       console.log('Employee.update params:', params);

//       db.query(sql, params, (err, result) => {
//         if (err) return reject(err);
//         resolve(result.affectedRows);
//       });
//     } catch (err) {
//       reject(err);
//     }
//   });
// },
update: async (emp_id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Get existing employee
      const existing = await module.exports.findById(emp_id);
      if (!existing) return reject(new Error("Employee not found"));

      const allowedFields = [
        'user_id', 'name', 'dep_id', 'designation', 'role_id',
        'registered_email', 'phone_number', 'address',
        'aadhar_num', 'pan_num', 'image_aadhar', 'image_pan',
        'dob', 'doj', 'activeYN'
      ];

      const fields = [];
      const params = [];

      for (const key of allowedFields) {
        if (data[key] !== undefined && data[key] !== 'u') {
          fields.push(`${key} = ?`);
          params.push(data[key]);
        } else if ((key === 'image_aadhar' || key === 'image_pan') && !data[key]) {
          // keep old image path if new file not uploaded
          fields.push(`${key} = ?`);
          params.push(existing[key] || null);
        }
      }

      if (fields.length === 0) return reject(new Error("No valid fields to update"));

      fields.push('updated_at = NOW()');
      const sql = `UPDATE employees SET ${fields.join(', ')} WHERE emp_id = ?`;
      params.push(emp_id);

      console.log('Employee.update SQL:', sql);
      console.log('Employee.update params:', params);

      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    } catch (error) {
      reject(error);
    }
  });
},
  // Delete employee by ID
  delete: async (emp_id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM employees WHERE emp_id = ?';
      db.query(sql, [emp_id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  }
};

module.exports = Employee;
