const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone, email, address, variety, qty, message, location, mapLink, mapSnapshot } = req.body;

    if (!name || !phone || !email || !variety) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

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
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td></tr>
              ${address ? `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Delivery Address:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${address}</td></tr>` : ''}
              ${mapLink ? `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Map Link:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="${mapLink}" style="color: #C49B32; text-decoration: none; font-weight: bold;" target="_blank">🗺️ View Location</a></td></tr>` : ''}
            </table>
          </div>
          <div style="background: #FFFDF7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3B2314; margin-bottom: 15px;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Variety:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${variety}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Quantity:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${qty} dozen(s)</td></tr>
              ${message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314; vertical-align: top;">Special Requests:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${message}</td></tr>` : ''}
            </table>
          </div>
        </div>
      `
    };

    const customerEmail = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: `Order Confirmation - Nilkamal Agro Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C49B32; margin-bottom: 10px;">🥭 Nilkamal Agro Farms</h1>
            <h2 style="color: #3B2314;">Order Confirmation</h2>
          </div>
          <div style="background: #FDF5E6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #3B2314; font-size: 16px; line-height: 1.6;">Dear ${name},<br><br>Thank you for your order! We'll contact you within 24 hours.</p>
          </div>
          <div style="background: #FFFDF7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3B2314; margin-bottom: 15px;">Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Variety:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${variety}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #3B2314;">Quantity:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${qty} dozen(s)</td></tr>
            </table>
          </div>
        </div>
      `
    };

    await transporter.sendMail(ownerEmail);
    if (email && email.includes('@')) {
      await transporter.sendMail(customerEmail);
    }

    res.json({ success: true, message: 'Order submitted successfully!' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit order.' });
  }
}