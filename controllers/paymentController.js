const crypto = require('crypto');
const Payment = require('../models/Payment'); // Import the Payment model

exports.initializePayment = async (req, res) => {
    try {
        const { user_id, material_id, amount, email, first_name, last_name } = req.body;

        // Save payment details into the database with 'pending' status
        const payment = await Payment.create({
            user_id,
            material_id,
            amount,
            tx_ref: `TX-${Date.now()}`, // Generate a unique transaction reference
            status: 'pending'
        });

        // Prepare payload for Chapa API
        const chapaPayload = {
            amount,
            currency: 'ETB',
            email,
            first_name,
            last_name,
            tx_ref: payment.tx_ref, // Use the saved transaction reference
        };

        // Make a request to Chapa API to initialize the payment
        const response = await global.fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer CHASECK_TEST-ZSZtttTxJ04CsxJIWssyNrZgUHCsjFf6`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chapaPayload)
        });

        const data = await response.json();

        // Check if Chapa responded successfully
        if (response.status === 200) {
            res.status(200).json({
                message: 'Payment initialized successfully',
                chapa_url: data.data.checkout_url, // Send Chapa payment link to the client
                transaction_ref: payment.tx_ref // Include transaction reference for tracking
            });
        } else {
            // Handle failed payment initialization
            res.status(response.status).json({
                error: 'Payment initialization failed with Chapa',
                details: data
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Payment initialization failed internally' });
        console.error('Error initializing payment:', error);
    }
};

exports.chapaWebhook = async (req, res) => {
    try {
        console.log('Received Chapa webhook:', req.body); // Log the incoming webhook request
        // Verify Chapa webhook using secret hash
        const secret = process.env.CHAPA_SECRET; // Use environment variable for security

        // Compute the hash using HMAC SHA256
        const computedHash = crypto.createHmac('sha256', secret)
            .update(JSON.stringify(req.body)) // Hashing the request body
            .digest('hex'); // Output as hexadecimal

        // Compare computed hash with Chapa's signature
        if (computedHash !== req.headers['chapa-signature'] && computedHash !== req.headers['x-chapa-signature']) {
            console.log('error', 'Unauthorized webhook request')
            return res.status(403).json({ error: 'Unauthorized webhook request' });
        }

        const { tx_ref, status } = req.body; // Chapa sends transaction reference and status in the webhook payload

        // Find the corresponding payment record using tx_ref
        const payment = await Payment.findOne({ where: { tx_ref } }); // Using tx_ref to locate the record
        if (!payment) {
            console.log('error', 'Payment not found')
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Prevent duplicate processing: only process if payment status is still 'pending'
        if (payment.status !== 'pending') {
            console.log('message', 'Webhook already processed')
            return res.status(200).json({ message: 'Webhook already processed' });
        }

        // Update payment status based on Chapa's webhook response
        if (status === 'success') {
            payment.status = 'completed';
        } else if (status === 'failed') {
            payment.status = 'failed';
        }

        await payment.save(); // Save the updated payment record to the database

        // Respond to Chapa to acknowledge the webhook
        console.log('message', 'Webhook processed successfully', payment)
        res.status(200).json({ message: 'Webhook processed successfully', payment });
    } catch (error) {
        console.error('error', 'Failed to process webhook', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to process webhook', details: error.message });
    }
};

exports.getPurchaseHistory = async (req, res) => {
    try {
        const user_id = req.query.user_id; // Assuming user_id is passed as a query parameter
        const payments = await Payment.findAll({ where: { user_id } });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchase history', details: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { payment_id } = req.body; // Assuming payment_id is passed in the request body
        const payment = await Payment.findByPk(payment_id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment verified successfully', payment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify payment', details: error.message });
    }
};
