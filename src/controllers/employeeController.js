const Employee = require('../models/Employee');

const { generateUserId } = require('../utils/autogenerate');

const employeeController = {
  // Get all employees
  getEmployees: async (req, res) => {
    try {
      const employees = await Employee.getAll();
      res.json(employees);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get employee by ID
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create employee
  createEmployee: async (req, res) => {
    try {
      const data = req.body || {};   // ✅ avoid undefined
      data.user_id = generateUserId();
      // Handle file uploads
      if (req.files) {
        if (req.files.image_aadhar) data.image_aadhar = req.files.image_aadhar[0].path;
        if (req.files.image_pan) data.image_pan = req.files.image_pan[0].path;
      }

      // Check duplicate email
      if (data.registered_email) {
        const existing = await Employee.findByEmail(data.registered_email);
        if (existing) return res.status(400).json({ message: 'Email already exists' });
      }

      const insertId = await Employee.create(data);
      const employee = await Employee.findById(insertId);
      res.status(201).json(employee);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // in your controller file
// updateEmployee: async (req, res) => {
//   try {
//     // Allowed keys — same as model's allowedFields
//     const allowedFields = [
//       'user_id', 'name', 'dep_id', 'designation', 'role_id',
//       'registered_email', 'phone_number', 'address',
//       'aadhar_num', 'pan_num', 'image_aadhar', 'image_pan',
//       'dob', 'doj', 'activeYN'
//     ];

//     // Debug: log incoming body keys so you can spot unexpected keys like "u"
//     console.log('updateEmployee - req.body keys:', Object.keys(req.body || {}));

//     // Build sanitized data object containing only allowed fields
//     const data = {};
//     for (const key of allowedFields) {
//       if (req.body && req.body[key] !== undefined) {
//         data[key] = req.body[key];
//       }
//     }

//     // Files (multer) -> normalize path separators
//     if (req.files) {
//       if (req.files.image_aadhar && req.files.image_aadhar[0]) {
//         data.image_aadhar = req.files.image_aadhar[0].path.replace(/\\/g, '/');
//       }
//       if (req.files.image_pan && req.files.image_pan[0]) {
//         data.image_pan = req.files.image_pan[0].path.replace(/\\/g, '/');
//       }
//     }

//     // Nothing valid to update?
//     if (Object.keys(data).length === 0) {
//       return res.status(400).json({ success: false, message: 'No valid fields to update' });
//     }

//     const affectedRows = await Employee.update(req.params.id, data);
//     if (!affectedRows) return res.status(404).json({ success: false, message: 'Employee not found' });

//     const employee = await Employee.findById(req.params.id);
//     res.json({ success: true, data: employee });
//   } catch (err) {
//     console.error('Error in updateEmployee:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// },
updateEmployee: async (req, res) => {
  try {
    const allowedFields = [
      'user_id', 'name', 'dep_id', 'designation', 'role_id',
      'registered_email', 'phone_number', 'address',
      'aadhar_num', 'pan_num', 'image_aadhar', 'image_pan',
      'dob', 'doj', 'activeYN'
    ];

    // Fetch existing employee
    const existing = await Employee.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Build sanitized data object containing only allowed fields
    const data = {};
    for (const key of allowedFields) {
      if (req.body && req.body[key] !== undefined && req.body[key] !== 'u') {
        data[key] = req.body[key];
      } else if ((key === 'image_aadhar' || key === 'image_pan') && !req.files?.[key]) {
        // Keep existing image path if no new file uploaded
        data[key] = existing[key] || null;
      }
    }

    // Files (multer) -> normalize path separators
    if (req.files) {
      if (req.files.image_aadhar && req.files.image_aadhar[0]) {
        data.image_aadhar = req.files.image_aadhar[0].path.replace(/\\/g, '/');
      }
      if (req.files.image_pan && req.files.image_pan[0]) {
        data.image_pan = req.files.image_pan[0].path.replace(/\\/g, '/');
      }
    }

    // Nothing valid to update?
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const affectedRows = await Employee.update(req.params.id, data);
    if (!affectedRows) return res.status(404).json({ success: false, message: 'Employee not found' });

    const employee = await Employee.findById(req.params.id);
    res.json({ success: true, data: employee });
  } catch (err) {
    console.error('Error in updateEmployee:', err);
    res.status(500).json({ success: false, message: err.message });
  }
},

  // Delete employee
  deleteEmployee: async (req, res) => {
    try {
      const affectedRows = await Employee.delete(req.params.id);
      if (!affectedRows) return res.status(404).json({ message: 'Employee not found' });
      res.json({ message: 'Employee deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Soft delete
  deactivateEmployee: async (req, res) => {
    try {
      const affectedRows = await Employee.update(req.params.id, { activeYN: 'N' });
      if (!affectedRows) return res.status(404).json({ message: 'Employee not found' });
      res.json({ message: 'Employee deactivated' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = employeeController;
