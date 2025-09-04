const Customer = require('../models/Customer');

const customerController = {
  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      res.json(customers);
    } catch (err) {
      console.error("❌ Get Customers Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    } catch (err) {
      console.error("❌ Get Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  createCustomer: async (req, res) => {
    try {
      console.log("📥 Incoming Data:", req.body);
      const custId = await Customer.create(req.body);
      const newCustomer = await Customer.findById(custId);
      res.status(201).json(newCustomer);
    } catch (err) {
      console.error("❌ Create Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      console.log("✏️ Update Data:", req.body);
      const affected = await Customer.update(req.params.id, req.body);
      if (!affected) return res.status(404).json({ message: 'Customer not found' });
      const updated = await Customer.findById(req.params.id);
      res.json(updated);
    } catch (err) {
      console.error("❌ Update Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const affected = await Customer.delete(req.params.id);
      if (!affected) return res.status(404).json({ message: 'Customer not found' });
      res.json({ message: 'Customer deleted' });
    } catch (err) {
      console.error("❌ Delete Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = customerController;
