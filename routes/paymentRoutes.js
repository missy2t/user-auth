const express = require('express');
const router = express.Router();
const { getPurchaseHistory, verifyPayment, chapaWebhook, initializePayment } = require('../controllers/paymentController');

// Show user purchase history
router.get('/history', getPurchaseHistory);

// Verify payment
router.post('/verify', verifyPayment);

// Chapa payment webhook
router.post('/webhook', chapaWebhook);

// Initialize payment
router.post('/initialize', initializePayment);

module.exports = router;
