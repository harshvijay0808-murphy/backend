const db = require('../config/db');

const Customer = {
  // Get all customers with joined subtables
  getAll: async () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, od.*, ph.*, sd.*, bd.*, ct.*, tm.*
        FROM customers c
        LEFT JOIN customers_other_details od ON c.id = od.cust_id
        LEFT JOIN customers_photos ph ON c.id = ph.cust_id
        LEFT JOIN customers_shipping_details sd ON c.id = sd.cust_id
        LEFT JOIN customers_billing_details bd ON c.id = bd.cust_id
        LEFT JOIN customers_contact ct ON c.id = ct.cust_id
        LEFT JOIN customers_terms tm ON c.id = tm.cust_id
      `;
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get customer by ID
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, od.*, ph.*, sd.*, bd.*, ct.*, tm.*
        FROM customers c
        LEFT JOIN customers_other_details od ON c.id = od.cust_id
        LEFT JOIN customers_photos ph ON c.id = ph.cust_id
        LEFT JOIN customers_shipping_details sd ON c.id = sd.cust_id
        LEFT JOIN customers_billing_details bd ON c.id = bd.cust_id
        LEFT JOIN customers_contact ct ON c.id = ct.cust_id
        LEFT JOIN customers_terms tm ON c.id = tm.cust_id
        WHERE c.id = ?
      `;
      db.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // Create customer with all subtables
  create: async (data) => {
    return new Promise((resolve, reject) => {
      db.beginTransaction(async (err) => {
        if (err) return reject(err);

        try {
          // Insert into customers
          const custSql = `
            INSERT INTO customers (cust_name, gst_no, udyam_reg_no, cust_status, pan, aadhar)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const custParams = [
            data.cust_name, data.gst_no, data.udyam_reg_no,
            data.cust_status, data.pan, data.aadhar
          ];

          const custResult = await new Promise((res, rej) => {
            db.query(custSql, custParams, (err, result) => {
              if (err) return rej(err);
              res(result);
            });
          });

          const custId = custResult.insertId;

          // Insert other details
          if (data.annual_turnover || data.no_counters_in_chain) {
            const odSql = `
              INSERT INTO customers_other_details (cust_id, annual_turnover, no_counters_in_chain)
              VALUES (?, ?, ?)
            `;
            await new Promise((res, rej) => {
              db.query(odSql, [custId, data.annual_turnover || null, data.no_counters_in_chain || null], (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          // Insert photo
          if (data.photo_url) {
            const phSql = `
              INSERT INTO customers_photos (cust_id, photo_url)
              VALUES (?, ?)
            `;
            await new Promise((res, rej) => {
              db.query(phSql, [custId, data.photo_url], (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          // Insert shipping details
          if (data.shipping_address) {
            const sdSql = `
              INSERT INTO customers_shipping_details (cust_id, shipping_address, city, state, pincode)
              VALUES (?, ?, ?, ?, ?)
            `;
            await new Promise((res, rej) => {
              db.query(sdSql, [custId, data.shipping_address, data.shipping_city, data.shipping_state, data.shipping_pincode], (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          // Insert billing details
          if (data.billing_address) {
            const bdSql = `
              INSERT INTO customers_billing_details (cust_id, billing_address, city, state, pincode)
              VALUES (?, ?, ?, ?, ?)
            `;
            await new Promise((res, rej) => {
              db.query(bdSql, [custId, data.billing_address, data.billing_city, data.billing_state, data.billing_pincode], (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          // Insert contact
          if (data.contact_person) {
            const ctSql = `
              INSERT INTO customers_contact (cust_id, contact_person, phone, email)
              VALUES (?, ?, ?, ?)
            `;
            await new Promise((res, rej) => {
              db.query(ctSql, [custId, data.contact_person, data.contact_phone, data.contact_email], (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          // Insert terms
          if (data.payment_terms) {
            const tmSql = `
              INSERT INTO customers_terms (cust_id, payment_terms, credit_limit)
              VALUES (?, ?, ?)
            `;
            await new Promise((res, rej) => {
              db.query(tmSql, [custId, data.payment_terms, data.credit_limit], (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          db.commit((err) => {
            if (err) return db.rollback(() => reject(err));
            resolve(custId);
          });
        } catch (e) {
          db.rollback(() => reject(e));
        }
      });
    });
  },

  // Update only main customers (can be extended for subtables)
  update: async (id, data) => {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];

      const allowedFields = ['cust_name', 'gst_no', 'udyam_reg_no', 'cust_status', 'pan', 'aadhar'];
      for (const key of allowedFields) {
        if (data[key] !== undefined) {
          fields.push(`${key} = ?`);
          params.push(data[key]);
        }
      }

      if (fields.length === 0) return reject(new Error("No valid fields"));

      const sql = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
      params.push(id);

      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM customers WHERE id = ?';
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  }
};

module.exports = Customer;
