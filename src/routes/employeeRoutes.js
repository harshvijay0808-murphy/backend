const express = require('express');
const router = express.Router();
const upload = require('../utils/multer'); // ✅ single import
const employeeController = require('../controllers/employeeController');

// CRUD routes
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.get('/email/:email', async (req, res) => {
  try {
    const employee = await require('../models/Employee').findByEmail(req.params.email);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply multer middleware for POST & PUT
router.post(
  '/',
  upload.fields([
    { name: 'image_aadhar', maxCount: 1 },
    { name: 'image_pan', maxCount: 1 }
  ]),
  employeeController.createEmployee
);

router.put(
  '/:id',
  upload.fields([
    { name: 'image_aadhar', maxCount: 1 },
    { name: 'image_pan', maxCount: 1 }
  ]),
  employeeController.updateEmployee
);

router.delete('/:id', employeeController.deleteEmployee);
router.patch('/:id/deactivate', employeeController.deactivateEmployee);

module.exports = router;
