const fetch = require('node-fetch');
const supabase = require('../lib/supabase');

/**
 * sendWhatsApp(phone, message) — fetch CallMeBot API URL
 * text (encoded), and CALLMEBOT_KEY. Catch errors silently.
 */
const sendWhatsApp = async (phone, message) => {
  try {
    const apiKey = process.env.CALLMEBOT_KEY;
    if (!apiKey) {
      console.warn("[WhatsApp] CallMeBot API Key is missing. Skipping notification.");
      return;
    }
    
    // Ensure phone starts with exact format (e.g., 91XXXXXXXXXX)
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;
    
    await fetch(url);
    console.log(`[WhatsApp] Notification sent to ${phone}`);
  } catch (err) {
    console.error("[WhatsApp Error]", err.message);
  }
};

/**
 * notifyAdmin(order) — build message string with order details.
 */
const notifyAdmin = async (order) => {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) return;

  const orderIdShort = order.id.substring(0, 8);
  const itemsList = order.items.map(item => `- ${item.name} x${item.qty}`).join("\n");
  
  const message = `🔔 *New Order Received!*
------------------------
*Order ID:* #${orderIdShort}
*Customer:* ${order.customer_name}
*Phone:* ${order.customer_phone}
*Type:* ${order.delivery_type.toUpperCase()}
*Slot:* ${order.delivery_slot || 'N/A'}

*Items:*
${itemsList}

*Total:* ₹${order.total_price}
------------------------
Check dashboard: ${process.env.FRONTEND_URL}/admin/orders`;

  await sendWhatsApp(adminPhone, message);
};

/**
 * notifyCustomer(orderId, status, note) — fetch customer info and build status message.
 */
const notifyCustomer = async (orderId, status, note) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('customer_name, customer_phone, delivery_type')
      .eq('id', orderId)
      .single();

    if (error || !order) return;

    const statusMap = {
      confirmed: "Your order has been confirmed! ✅",
      preparing: "Your order is being prepared with care! 🍳",
      out_for_delivery: "Your order is on the way! 🚚",
      ready_for_pickup: "Your order is ready for pickup! 🗳️",
      delivered: "Order delivered. Enjoy your meal! ⭐",
      cancelled: "Your order was cancelled. Please contact us for details. ❌"
    };

    let message = `Hello ${order.customer_name}, ${statusMap[status] || "Your order status has changed."}`;
    
    if (note) {
      message += `\n\n*Note:* ${note}`;
    }

    message += `\n\n*Track here:* ${process.env.FRONTEND_URL}/track/${orderId}`;

    await sendWhatsApp(order.customer_phone, message);
  } catch (err) {
    console.error("[Customer Notify Error]", err.message);
  }
};

module.exports = {
  sendWhatsApp,
  notifyAdmin,
  notifyCustomer
};
