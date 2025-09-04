const Document = require('../models/Document');

// Get all documents
exports.getDocuments = (req, res) => {
    Document.getAll((err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
};

// Get a document by ID
exports.getDocumentById = (req, res) => {
    Document.findById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Document not found' });
        res.json(results[0]);
    });
};

// Create a new document
exports.createDocument = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Document name required' });

    Document.create(name, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: result.insertId, name });
    });
};

// Update a document
exports.updateDocument = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Document name required' });

    Document.update(req.params.id, name, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Document not found' });
        res.json({ id: req.params.id, name });
    });
};

// Delete a document
exports.deleteDocument = (req, res) => {
    Document.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Document not found' });
        res.json({ message: 'Document deleted successfully' });
    });
};
