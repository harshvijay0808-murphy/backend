const Department = require('../models/Department');

// Get all
exports.getDepartments = (req, res) => {
    Department.getAll((err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
};

// Get one
exports.getDepartmentById = (req, res) => {
    Department.findById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(results[0]);
    });
};

// Create
exports.createDepartment = (req, res) => {
    const { departmentName } = req.body;
    if (!departmentName) return res.status(400).json({ message: 'Department name required' });

    Department.create(departmentName, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: result.insertId, departmentName });
    });
};

// Update
exports.updateDepartment = (req, res) => {
    const { departmentName } = req.body;
    Department.update(req.params.id, departmentName, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ id: req.params.id, departmentName });
    });
};

// Delete
exports.deleteDepartment = (req, res) => {
    Department.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Department deleted successfully' });
    });
};
