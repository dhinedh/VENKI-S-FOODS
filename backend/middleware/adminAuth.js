const supabase = require('../lib/supabase');

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const SECRET = process.env.ADMIN_SECRET;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  // 1. Check for legacy ADMIN_SECRET (Direct API use)
  if (SECRET && authHeader === SECRET) {
    return next();
  }

  // 2. Check for Supabase JWT (Frontend user use)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(authHeader);

    if (error || !user) {
      console.warn(`[Security] Invalid token from IP: ${req.ip}`);
      return res.status(403).json({ error: "Invalid authentication token" });
    }

    // Verify if the user has an admin role in their metadata
    if (user.user_metadata?.role !== 'admin') {
      console.warn(`[Security] Non-admin user (${user.email}) attempted admin access`);
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // Attach user for further use
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Authentication system error" });
  }
};

module.exports = adminAuth;

