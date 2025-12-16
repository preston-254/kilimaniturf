/**
 * BACKEND API EXAMPLE FOR M-PESA INTEGRATION
 * 
 * IMPORTANT SECURITY NOTE:
 * - Never expose Consumer Key and Secret in frontend code
 * - All M-Pesa API calls should be made from your backend server
 * - Store credentials in environment variables on your server
 * 
 * This is a Node.js/Express example. Adapt to your backend framework.
 */

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// M-Pesa Configuration (store in environment variables)
const MPESA_CONFIG = {
    consumerKey: process.env.MPESA_CONSUMER_KEY || 'KeoFkm1U6nVB1fbkRrfY3n7Epus9Yti7DlmvNjGZQ9R6wj4K',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'yu6qv7khvA6p33yknQd8pjx9L7we6uZAulGrjwqBc3MUhWDbAYIWYRYqOaIsGiMR',
    shortcode: process.env.MPESA_SHORTCODE || 'YOUR_SHORTCODE', // Your M-Pesa Paybill or Till number
    passkey: process.env.MPESA_PASSKEY || 'YOUR_PASSKEY', // Your M-Pesa passkey
    environment: process.env.MPESA_ENV || 'sandbox', // 'sandbox' or 'production'
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback'
};

// M-Pesa API URLs
const MPESA_URLS = {
    sandbox: {
        auth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        stkpush: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        query: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    },
    production: {
        auth: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        stkpush: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        query: 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    }
};

// Get M-Pesa Access Token
async function getMpesaAccessToken() {
    try {
        const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
        const response = await axios.get(
            MPESA_URLS[MPESA_CONFIG.environment].auth,
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting M-Pesa access token:', error);
        throw error;
    }
}

// Generate password for STK Push
function generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
}

// Initiate STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
    try {
        const { phone, amount, accountReference, transactionDesc } = req.body;
        
        // Validate input
        if (!phone || !amount || !accountReference) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        // Format phone number (remove + and ensure 254 format)
        const formattedPhone = phone.replace(/\D/g, '');
        if (!formattedPhone.startsWith('254')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Must start with 254'
            });
        }
        
        // Get access token
        const accessToken = await getMpesaAccessToken();
        
        // Generate password
        const { password, timestamp } = generatePassword();
        
        // STK Push request body
        const stkPushBody = {
            BusinessShortCode: MPESA_CONFIG.shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: MPESA_CONFIG.shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: MPESA_CONFIG.callbackUrl,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc || 'Kilimani Sports Ground Booking'
        };
        
        // Make STK Push request
        const response = await axios.post(
            MPESA_URLS[MPESA_CONFIG.environment].stkpush,
            stkPushBody,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data.ResponseCode === '0') {
            res.json({
                success: true,
                checkoutRequestID: response.data.CheckoutRequestID,
                message: 'STK Push initiated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: response.data.ResponseDescription || 'Failed to initiate STK Push'
            });
        }
        
    } catch (error) {
        console.error('STK Push Error:', error);
        res.status(500).json({
            success: false,
            message: error.response?.data?.errorMessage || 'Internal server error'
        });
    }
});

// Query STK Push Status
app.get('/api/mpesa/status/:transactionRef', async (req, res) => {
    try {
        const { transactionRef } = req.params;
        
        // In a real application, you would:
        // 1. Look up the checkoutRequestID from your database using transactionRef
        // 2. Query M-Pesa API for payment status
        // 3. Return the status
        
        // For now, return pending status
        // In production, implement actual status checking
        res.json({
            status: 'pending',
            transactionRef: transactionRef
        });
        
    } catch (error) {
        console.error('Status Query Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error querying payment status'
        });
    }
});

// M-Pesa Callback (Webhook)
app.post('/api/mpesa/callback', async (req, res) => {
    try {
        const callbackData = req.body;
        
        // M-Pesa sends callback with payment result
        if (callbackData.Body?.stkCallback) {
            const stkCallback = callbackData.Body.stkCallback;
            const checkoutRequestID = stkCallback.CheckoutRequestID;
            const resultCode = stkCallback.ResultCode;
            const resultDesc = stkCallback.ResultDesc;
            
            // Find booking by checkoutRequestID
            // Update booking status in database
            if (resultCode === 0) {
                // Payment successful
                const callbackMetadata = stkCallback.CallbackMetadata;
                const items = callbackMetadata?.Item || [];
                
                const mpesaReceiptNumber = items.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
                const transactionDate = items.find(item => item.Name === 'TransactionDate')?.Value;
                const phoneNumber = items.find(item => item.Name === 'PhoneNumber')?.Value;
                
                // Update booking status to 'confirmed' in your database
                // await updateBookingStatus(checkoutRequestID, 'confirmed', {
                //     mpesaReceiptNumber,
                //     transactionDate,
                //     phoneNumber
                // });
                
                console.log('Payment successful:', {
                    checkoutRequestID,
                    mpesaReceiptNumber,
                    transactionDate,
                    phoneNumber
                });
            } else {
                // Payment failed
                // await updateBookingStatus(checkoutRequestID, 'failed', { resultDesc });
                console.log('Payment failed:', { checkoutRequestID, resultDesc });
            }
        }
        
        // Always acknowledge receipt
        res.json({
            ResultCode: 0,
            ResultDesc: 'Callback received successfully'
        });
        
    } catch (error) {
        console.error('Callback Error:', error);
        res.status(500).json({
            ResultCode: 1,
            ResultDesc: 'Error processing callback'
        });
    }
});

// Save Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Save booking to database
        // const booking = await saveBooking(bookingData);
        
        // In production, implement actual database save
        console.log('Saving booking:', bookingData);
        
        res.json({
            success: true,
            message: 'Booking saved successfully',
            booking: bookingData
        });
        
    } catch (error) {
        console.error('Save Booking Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving booking'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('M-Pesa API endpoints ready:');
    console.log('  POST /api/mpesa/stkpush');
    console.log('  GET  /api/mpesa/status/:transactionRef');
    console.log('  POST /api/mpesa/callback');
    console.log('  POST /api/bookings');
});

