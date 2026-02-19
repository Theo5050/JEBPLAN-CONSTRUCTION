const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('../models/Payment');

// Initialize Paystack payment
router.post('/initialize', async (req, res) => {
    try {
        const { email, amount, name, phone, service } = req.body;

        // Validate required fields
        if (!email || !amount || !name) {
            return res.status(400).json({ 
                error: 'Email, amount, and name are required' 
            });
        }

        // Prepare request to Paystack
        const params = {
            email: email,
            amount: amount * 100, // Convert to pesewas
            currency: 'GHS',
            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: name
                    },
                    {
                        display_name: "Phone Number", 
                        variable_name: "phone_number",
                        value: phone || ''
                    },
                    {
                        display_name: "Service",
                        variable_name: "service",
                        value: service || 'General Payment'
                    }
                ]
            },
            callback_url: 'https://jebp-construction-api-twq3.onrender.com/payment-success.html'
        };

        // Make request to Paystack API
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            params,
            {
                headers: {
                    Authorization: `Bearer ${process.env.sk_test_5273c830038503f182e54e3da24918f8c734be75}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Save payment record to database
        const payment = new Payment({
            reference: response.data.data.reference,
            amount: amount,
            email: email,
            name: name,
            phone: phone,
            service: service,
            status: 'pending'
        });
        await payment.save();

        // Return authorization URL to frontend
        res.json({
            status: true,
            message: 'Payment initialized',
            data: {
                authorization_url: response.data.data.authorization_url,
                reference: response.data.data.reference
            }
        });

    } catch (error) {
        console.error('Paystack initialization error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to initialize payment',
            details: error.response?.data || error.message
        });
    }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        // Verify with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.sk_test_5273c830038503f182e54e3da24918f8c734be75}`
                }
            }
        );

        // Update payment status in database
        if (response.data.data.status === 'success') {
            await Payment.findOneAndUpdate(
                { reference: reference },
                { 
                    status: 'success',
                    paymentMethod: response.data.data.channel
                }
            );
        }

        res.json(response.data);

    } catch (error) {
        console.error('Paystack verification error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to verify payment',
            details: error.response?.data || error.message
        });
    }
});

// Get payment by reference
router.get('/:reference', async (req, res) => {
    try {
        const payment = await Payment.findOne({ reference: req.params.reference });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ error: 'Failed to fetch payment' });
    }
});

// Get all payments (admin only - simple implementation)
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

module.exports = router;