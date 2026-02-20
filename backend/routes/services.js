const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get services by category
router.get('/category/:category', async (req, res) => {
    try {
        const services = await Service.find({ category: req.params.category });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Initialize services (seed data)
router.post('/seed', async (req, res) => {
    try {
        const services = [
            {
                name: 'Scaffold Wholesale',
                description: 'High-quality scaffolding materials at wholesale prices. Perfect for large construction projects.',
                icon: 'fas fa-building',
                category: 'scaffold-wholesale',
                features: ['Steel Scaffolding', 'Aluminum Scaffolding', 'Frame Scaffolding', 'System Scaffolding'],
                price: 'Contact for pricing'
            },
            {
                name: 'Scaffold Rentals',
                description: 'Flexible rental options for scaffolding equipment. Daily, weekly, and monthly rates available.',
                icon: 'fas fa-calendar-alt',
                category: 'scaffold-rental',
                features: ['Daily Rentals', 'Weekly Rentals', 'Monthly Rentals', 'Delivery & Setup'],
                price: 'From GHS 500/day'
            },
            {
                name: 'Security Doors',
                description: 'Heavy-duty security doors for homes and businesses. Custom sizes available.',
                icon: 'fas fa-shield-alt',
                category: 'security-doors',
                features: ['Steel Doors', 'Fire Rated', 'Sound Proof', 'Custom Designs'],
                price: 'Starting at GHS 2,500'
            },
            {
                name: 'Door Accessories',
                description: 'Complete range of door hardware and accessories. Quality guaranteed.',
                icon: 'fas fa-door-open',
                category: 'door-accessories',
                features: ['Hinges & Handles', 'Locks & Latches', 'Door Closers', 'Security Bars'],
                price: 'From GHS 100'
            },
            {
                name: 'Bathroom and Kitchen Poduct',
                description: 'Wide selection of bathroom and kitchen accessories to enhance your space. Stylish and functional.',
                icon: 'fas fa-bath',        
                category: 'bathroom-kitchen-product',
                features: ['Jaccuzi', 'water closet', 'Faucets & Sinks', 'Cabinet Hardware'],
                price: 'From GHS 1500'
            },
        ];
        
        await Service.deleteMany();
        await Service.insertMany(services);
        res.json({ message: 'Services seeded successfully', services });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;