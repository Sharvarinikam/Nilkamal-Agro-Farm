require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email endpoint
app.post('/api/send-order', async (req, res) => {
  try {
    const { name, phone, email, address, variety, qty, message, location, mapLink, mapSnapshot } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !variety) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    // Email to farm owner
    const ownerEmail = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.OWNER_EMAIL || 'nilkamalfarms@example.com',
      subject: `🥭 New Mango Order - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C49B32; margin-bottom: 10px;">🥭 Nilkamal Agro Farms</h1>
            <h2 style="color: #3B2314;">New Order Received</h2>
          </div>
          
          <div style="background: #FDF5E6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3B2314; margin-bottom: 15px;">Customer Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              ${address ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Delivery Address:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${address}</td>
              </tr>
              ` : ''}
              ${mapSnapshot ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314; vertical-align: top;">Location Details:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; white-space: pre-line;">${mapSnapshot}</td>
              </tr>
              ` : ''}
              ${mapLink ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Map Link:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  <a href="${mapLink}" style="color: #C49B32; text-decoration: none; font-weight: bold;" target="_blank">🗺️ View Location on Google Maps</a>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #FFFDF7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3B2314; margin-bottom: 15px;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Variety:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${variety}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Quantity:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${qty} dozen(s)</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314; vertical-align: top;">Special Requests:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${message}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2D1810; color: #FDF5E6; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px;">
              📞 Please contact the customer within 24 hours<br>
              📧 This is an automated notification from Nilkamal Agro Farms
            </p>
          </div>
        </div>
      `
    };

    // Confirmation email to customer
    const customerEmail = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email, // Send to customer's actual email address
      subject: `Order Confirmation - Nilkamal Agro Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C49B32; margin-bottom: 10px;">🥭 Nilkamal Agro Farms</h1>
            <h2 style="color: #3B2314;">Order Confirmation</h2>
          </div>
          
          <div style="background: #FDF5E6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #3B2314; font-size: 16px; line-height: 1.6;">
              Dear ${name},<br><br>
              Thank you for your order! We've received your request and our team will contact you within 24 hours to confirm details and arrange delivery.
            </p>
          </div>

          <div style="background: #FFFDF7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3B2314; margin-bottom: 15px;">Your Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Variety:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${variety}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Quantity:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${qty} dozen(s)</td>
              </tr>
              ${address ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Delivery Address:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${address}</td>
              </tr>
              ` : ''}
              ${mapLink ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Map Link:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  <a href="${mapLink}" style="color: #C49B32; text-decoration: none; font-weight: bold;" target="_blank">🗺️ View Location on Google Maps</a>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2D1810; color: #FDF5E6; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px;">
              📞 Phone: +91 98765 43210<br>
              📧 Email: orders@nilkamagrofarms.com<br>
              📍 Address: Nilkamal Agro Farms, Village Nate, Taluka Pune, Maharashtra 415612
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(ownerEmail);
    console.log('Order notification sent to farm owner');

    // Only send customer email if they provided a valid email address
    if (email && email.includes('@')) {
      await transporter.sendMail(customerEmail);
      console.log('Confirmation sent to customer');
    }

    res.json({ 
      success: true, 
      message: 'Order submitted successfully! We will contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit order. Please try again or call us directly.' 
    });
  }
});

// Serve Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🥭 Nilkamal Agro Farms server running on port ${PORT}`);
  console.log(`📧 Email service ready`);
});
