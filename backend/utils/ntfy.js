const fetch = require('node-fetch');

/**
 * Send an instant push notification to any phone via ntfy.sh
 * The user simply subscribes to this topic on their ntfy app.
 */
const notifyAdminViaNtfy = async (order) => {
  try {
    // A unique private topic for the user to subscribe to.
    const topic = process.env.NTFY_TOPIC || 'venkisfoods_admin_alerts_883609';
    
    // Construct the push notification payload
    const itemsList = order.items.map(item => `${item.name} x${item.qty}`).join(", ");
    
    // The main body of the push notification
    const addressBlock = order.delivery_type === 'delivery' && order.address ? `\nAddress: ${order.address}` : '';
    const message = `Customer: ${order.customer_name} (${order.customer_phone})\nType: ${order.delivery_type.toUpperCase()}${addressBlock}\nItems: ${itemsList}\nTotal: ₹${order.total_price}`;

    // Send the request directly to the ntfy.sh servers
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      body: message,
      headers: {
        'Title': `Venkis Foods: New Order #${order.id.substring(0,8)}`,
        'Priority': 'urgent',
        'Tags': 'rotating_light,taco',
        'Actions': `view, Chat on WhatsApp, https://wa.me/${(order.customer_phone || '').replace(/[^\\d+]/g, '')}`
      }
    });

    console.log(`[ntfy] Push notification sent to topic: ${topic}`);
  } catch (err) {
    console.error("[ntfy Error] Failed to send push notification:", err.message);
  }
};

module.exports = {
  notifyAdminViaNtfy
};
