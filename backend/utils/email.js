const nodemailer = require('nodemailer');

/**
 * Configure standard SMTP Transporter for Gmail
 * The user will need to provide their own APP_PASSWORD in .env
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'venkibala14@gmail.com', // Sender Email
      pass: process.env.EMAIL_PASS // The 16-character Google App Password
    }
  });
};

/**
 * Notify Admin via Email
 */
const notifyAdminViaEmail = async (order) => {
  try {
    const transporter = createTransporter();
    
    // Who to send notifications to (defined by user request)
    const adminEmail = 'venkibala14@gmail.com'; 

    const orderIdShort = order.id.substring(0, 8);
    const itemsListHtml = order.items.map(item => 
      `<li><strong>${item.name}</strong> x${item.qty} (₹${item.price * item.qty})</li>`
    ).join("");

    const mailOptions = {
      from: `"Venki's Foods Notifier" <${process.env.EMAIL_USER || 'venkibala14@gmail.com'}>`, // Use self as sender
      to: adminEmail,
      subject: `🚨 New Order Received! #${orderIdShort} - ${order.customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #d4af37; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Order Received!</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Order #${orderIdShort}</p>
          </div>
          
          <div style="padding: 20px; background-color: #fcfcfc;">
            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${order.customer_name}</p>
            <p><strong>Phone:</strong> <a href="tel:${order.customer_phone}">${order.customer_phone}</a></p>
            <p><strong>Type:</strong> <span style="background:#eee; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; font-size: 12px;">${order.delivery_type}</span></p>
            ${order.delivery_type === 'delivery' ? `<p><strong>Address:</strong> ${order.address}</p>` : ''}
            
            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Order Details</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${itemsListHtml}
            </ul>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #fff; border: 1px dashed #ccc; border-radius: 6px; text-align: right;">
              <h2 style="margin: 0; color: #b8860b;">Total: ₹${order.total_price}</h2>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders" 
                 style="background-color: #050505; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">
                 View in Dashboard
              </a>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Notification sent to ${adminEmail}! MessageID: ${info.messageId}`);
  } catch (err) {
    console.error("[Email Error] Failed to send admin notification:", err.message);
  }
};

module.exports = {
  notifyAdminViaEmail
};
