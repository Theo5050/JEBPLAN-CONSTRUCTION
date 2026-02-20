const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Payment = require('../models/Payment');

// Simple admin login (no JWT for simplicity)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Simple hardcoded admin for demo - you can change this
        if (username === 'admin' && password === 'jebplan2026') {
            res.json({ 
                success: true, 
                message: 'Login successful' 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get all contact submissions
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Get all payment records
router.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Get single contact
router.get('/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
});

// Get single payment
router.get('/payments/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment' });
    }
});

// Mark contact as read (optional)
router.put('/contacts/:id/read', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json({ success: true, contact });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// Delete contact (optional)
router.delete('/contacts/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Delete payment (optional)
router.delete('/payments/:id', async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete payment' });
    }
});

module.exports = router;