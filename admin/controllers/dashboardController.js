const db = require("../config/db");

const showDashboard = async (req, res) => {
  try {
    // =========================
    // USER STATS
    // =========================
    const [[{ totalUsers }]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM tbl_users",
    );

    const [[{ activeUsers }]] = await db.query(
      "SELECT COUNT(*) AS activeUsers FROM tbl_users WHERE user_status = 0",
    );

    const [[{ inactiveUsers }]] = await db.query(
      "SELECT COUNT(*) AS inactiveUsers FROM tbl_users WHERE user_status = 1",
    );

    // =========================
    // ORDER STATS
    // =========================
    const [[{ totalOrders }]] = await db.query(
      `SELECT COUNT(*) AS totalOrders FROM tbl_orders WHERE order_type = 'shop_order'`,
    );

    // =========================
    // TOTAL SALES
    // =========================
    const [[{ totalRevenue }]] = await db.query(
      `SELECT IFNULL(SUM(CAST(meta_value AS DECIMAL(10,2))),0) AS totalRevenue
       FROM tbl_ordermeta WHERE meta_key = '_order_total'`,
    );

    // =========================
    // BEST SELLER PRODUCTS (top 5)
    // =========================
   const [bestSellers] = await db.query(
  `SELECT
      p.ID,
      p.product_title AS title,
      p.product_url AS slug,

      SUM(CAST(qty_meta.meta_value AS UNSIGNED)) AS totalSold,

      (
        SELECT m2.media_path
        FROM tbl_productmeta pm2
        JOIN tbl_media m2
          ON m2.media_id = CAST(pm2.meta_value AS UNSIGNED)
        WHERE pm2.product_id = p.ID
          AND pm2.meta_key = '_thumbnail_id'
        ORDER BY pm2.meta_id DESC
        LIMIT 1
      ) AS thumbnail,

      CAST(COALESCE((
          SELECT pm3.meta_value
          FROM tbl_productmeta pm3
          WHERE pm3.product_id = p.ID
            AND pm3.meta_key = '_price'
            AND pm3.meta_value != ''
          ORDER BY pm3.meta_id DESC
          LIMIT 1
      ), '0') AS DECIMAL(10,2)) AS price,

      COALESCE((
          SELECT pm4.meta_value
          FROM tbl_productmeta pm4
          WHERE pm4.product_id = p.ID
            AND pm4.meta_key = '_stock_status'
          ORDER BY pm4.meta_id DESC
          LIMIT 1
      ), 'instock') AS stock_status

    FROM tbl_order_itemmeta oim

    INNER JOIN tbl_order_items oi
      ON oi.order_item_id = oim.order_item_id

    INNER JOIN tbl_orders o
      ON o.order_id = oi.order_id

    INNER JOIN tbl_products p
      ON p.ID = oim.meta_value

    INNER JOIN tbl_order_itemmeta qty_meta
      ON qty_meta.order_item_id = oim.order_item_id
     AND qty_meta.meta_key = '_qty'

    WHERE oim.meta_key = '_product_id'
      AND p.product_status = 'publish'
      AND (p.parent_id = 0 OR p.parent_id IS NULL)
      AND o.order_type = 'shop_order'

    GROUP BY p.ID
    ORDER BY totalSold DESC
    LIMIT 5`,
  [],
);
   
    

    // =========================
    // LATEST ORDERS (top 5)
    // =========================
    const [latestOrders] = await db.query(`
  SELECT
    o.order_id,
    o.order_status,
    o.order_date,

    CONCAT_WS(' ',
      NULLIF(ua.first_name, ''),
      NULLIF(ua.last_name, '')
    ) AS customer_name,

    ua.phone AS phone,

    CONCAT_WS(', ',
      NULLIF(ua.address_line1, ''),
      NULLIF(ua.address_line2, ''),
      NULLIF(ua.city, ''),
      NULLIF(ua.state_name, ''),
      NULLIF(ua.zipcode, '')
    ) AS address,

    MAX(
      CASE
        WHEN om.meta_key = '_order_total'
        THEN om.meta_value
      END
    ) AS total

  FROM tbl_orders o

  LEFT JOIN tbl_user_address ua
    ON ua.order_id = o.order_id
   AND ua.address_billing = 'yes'

  LEFT JOIN tbl_ordermeta om
    ON om.order_id = o.order_id

  WHERE o.order_type = 'shop_order'
    AND o.parent_id = 0

  GROUP BY o.order_id

  ORDER BY o.order_date DESC

  LIMIT 5
`);

    // =========================
    // RECENT USERS (top 5)
    // =========================
    const [recentUsers] = await db.query(`
        SELECT 
          u.ID, 
          u.display_name, 
          u.user_email, 
          u.user_registered,

          -- Phone
          (SELECT meta_value 
          FROM tbl_usermeta 
          WHERE user_id = u.ID AND meta_key = 'phone' 
          LIMIT 1) AS phone,

          -- Full Address
          CONCAT_WS(', ',
            NULLIF((SELECT meta_value FROM tbl_usermeta WHERE user_id = u.ID AND meta_key = 'billing_address_1' LIMIT 1), ''),
            NULLIF((SELECT meta_value FROM tbl_usermeta WHERE user_id = u.ID AND meta_key = 'billing_address_2' LIMIT 1), ''),
            NULLIF((SELECT meta_value FROM tbl_usermeta WHERE user_id = u.ID AND meta_key = 'billing_city' LIMIT 1), ''),
            NULLIF((SELECT meta_value FROM tbl_usermeta WHERE user_id = u.ID AND meta_key = 'billing_state' LIMIT 1), ''),
            NULLIF((SELECT meta_value FROM tbl_usermeta WHERE user_id = u.ID AND meta_key = 'billing_postcode' LIMIT 1), ''),
            NULLIF((SELECT meta_value FROM tbl_usermeta WHERE user_id = u.ID AND meta_key = 'billing_country' LIMIT 1), '')
          ) AS address

        FROM tbl_users u
        ORDER BY u.user_registered DESC
        LIMIT 5
      `);

    // =========================
    // PRODUCT CATEGORIES with count (top 5)
    // =========================
    const [categoryProducts] = await db.query(`
      SELECT
        c.category_id,
        c.category_name,
        COUNT(pcl.product_id) AS product_count
      FROM tbl_products_category c
      LEFT JOIN tbl_products_category_link pcl ON pcl.category_id = c.category_id
      LEFT JOIN tbl_products p ON p.ID = pcl.product_id AND p.parent_id = 0
      GROUP BY c.category_id, c.category_name
      ORDER BY product_count DESC
      LIMIT 5
    `);

    // =========================
    // LOW STOCK PRODUCTS (top 5)
    // =========================
    const [lowStockProducts] = await db.query(`
      SELECT
        p.ID,
        p.product_title,
        (
          SELECT pm.meta_value FROM tbl_productmeta pm
          WHERE pm.product_id = p.ID AND pm.meta_key = '_stock'
          ORDER BY pm.meta_id DESC LIMIT 1
        ) AS stock,
        (
          SELECT m.media_path FROM tbl_media m
          WHERE m.parent_id = p.ID AND m.media_type = 'product_image'
          ORDER BY m.media_id ASC LIMIT 1
        ) AS thumbnail
      FROM tbl_products p
      WHERE p.parent_id = 0
        AND CAST((
          SELECT pm.meta_value FROM tbl_productmeta pm
          WHERE pm.product_id = p.ID AND pm.meta_key = '_stock'
          ORDER BY pm.meta_id DESC LIMIT 1
        ) AS UNSIGNED) <= 5
      ORDER BY stock ASC
      LIMIT 5
    `);

    res.render("dashboard/index", {
      title: "Dashboard",
      admin: req.session.admin,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalOrders,
        totalRevenue,
      },
      bestSellers,
      latestOrders,
      categoryProducts,
      recentUsers,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).send("Server Error");
  }
};

// =========================
// AJAX: Load More Best Sellers
// =========================
const loadMoreBestSellers = async (req, res) => {
  try {

    const offset = parseInt(req.query.offset) || 5;
    const limit  = parseInt(req.query.limit) || 10;

    const [rows] = await db.query(
      `SELECT
          p.ID,
          p.product_title AS title,
          p.product_url AS slug,

          SUM(CAST(qty_meta.meta_value AS UNSIGNED)) AS totalSold,

          (
            SELECT m2.media_path
            FROM tbl_productmeta pm2
            JOIN tbl_media m2
              ON m2.media_id = CAST(pm2.meta_value AS UNSIGNED)
            WHERE pm2.product_id = p.ID
              AND pm2.meta_key = '_thumbnail_id'
            ORDER BY pm2.meta_id DESC
            LIMIT 1
          ) AS thumbnail,

          CAST(COALESCE((
              SELECT pm3.meta_value
              FROM tbl_productmeta pm3
              WHERE pm3.product_id = p.ID
                AND pm3.meta_key = '_price'
                AND pm3.meta_value != ''
              ORDER BY pm3.meta_id DESC
              LIMIT 1
          ), '0') AS DECIMAL(10,2)) AS price,

          COALESCE((
              SELECT pm4.meta_value
              FROM tbl_productmeta pm4
              WHERE pm4.product_id = p.ID
                AND pm4.meta_key = '_stock_status'
              ORDER BY pm4.meta_id DESC
              LIMIT 1
          ), 'instock') AS stock_status

        FROM tbl_order_itemmeta oim

        INNER JOIN tbl_order_items oi
          ON oi.order_item_id = oim.order_item_id

        INNER JOIN tbl_orders o
          ON o.order_id = oi.order_id

        INNER JOIN tbl_products p
          ON p.ID = oim.meta_value

        INNER JOIN tbl_order_itemmeta qty_meta
          ON qty_meta.order_item_id = oim.order_item_id
         AND qty_meta.meta_key = '_qty'

        WHERE oim.meta_key = '_product_id'
          AND p.product_status = 'publish'
          AND (p.parent_id = 0 OR p.parent_id IS NULL)
          AND o.order_type = 'shop_order'

        GROUP BY p.ID
        ORDER BY totalSold DESC
        LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });

  } catch (error) {

    console.error('loadMoreBestSellers error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// AJAX: Load More Latest Orders
// =========================
const loadMoreOrders = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 5;
    const limit = parseInt(req.query.limit) || 5;

    const [rows] = await db.query(
      `
      SELECT
        o.order_id,
        o.order_status,
        o.order_date,

        CONCAT_WS(' ',
          NULLIF(ua.first_name, ''),
          NULLIF(ua.last_name, '')
        ) AS customer_name,

        ua.phone AS phone,

        CONCAT_WS(', ',
          NULLIF(ua.address_line1, ''),
          NULLIF(ua.address_line2, ''),
          NULLIF(ua.city, ''),
          NULLIF(ua.state_name, ''),
          NULLIF(ua.zipcode, '')
        ) AS address,

        MAX(
          CASE
            WHEN om.meta_key = '_order_total'
            THEN om.meta_value
          END
        ) AS total

      FROM tbl_orders o

      LEFT JOIN tbl_user_address ua
        ON ua.order_id = o.order_id
       AND ua.address_billing = 'yes'

      LEFT JOIN tbl_ordermeta om
        ON om.order_id = o.order_id

      WHERE o.order_type = 'shop_order'
        AND o.parent_id = 0

      GROUP BY o.order_id

      ORDER BY o.order_date DESC

      LIMIT ? OFFSET ?
      `,
      [limit, offset],
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// AJAX: Load More Recent Users
// =========================
const loadMoreUsers = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 5;
    const limit = parseInt(req.query.limit) || 5;

    const [rows] = await db.query(
      `
      SELECT 
        u.ID,
        u.display_name,
        u.user_email,
        u.user_registered,

        MAX(CASE WHEN um.meta_key = 'phone' THEN um.meta_value END) AS phone,

        CONCAT_WS(', ',
          NULLIF(MAX(CASE WHEN um.meta_key = 'billing_address_1' THEN um.meta_value END), ''),
          NULLIF(MAX(CASE WHEN um.meta_key = 'billing_address_2' THEN um.meta_value END), ''),
          NULLIF(MAX(CASE WHEN um.meta_key = 'billing_city' THEN um.meta_value END), ''),
          NULLIF(MAX(CASE WHEN um.meta_key = 'billing_state' THEN um.meta_value END), ''),
          NULLIF(MAX(CASE WHEN um.meta_key = 'billing_postcode' THEN um.meta_value END), ''),
          NULLIF(MAX(CASE WHEN um.meta_key = 'billing_country' THEN um.meta_value END), '')
        ) AS address

      FROM tbl_users u
      LEFT JOIN tbl_usermeta um ON um.user_id = u.ID

      GROUP BY u.ID
      ORDER BY u.user_registered DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// AJAX: Load More Low Stock Products
// =========================
const loadMoreLowStock = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 5;
    const limit = parseInt(req.query.limit) || 10;

    const [rows] = await db.query(
      `
      SELECT
        p.ID,
        p.product_title,
        (
          SELECT pm.meta_value FROM tbl_productmeta pm
          WHERE pm.product_id = p.ID AND pm.meta_key = '_stock'
          ORDER BY pm.meta_id DESC LIMIT 1
        ) AS stock,
        (
          SELECT m.media_path FROM tbl_media m
          WHERE m.parent_id = p.ID AND m.media_type = 'product_image'
          ORDER BY m.media_id ASC LIMIT 1
        ) AS thumbnail
      FROM tbl_products p
      WHERE p.parent_id = 0
        AND CAST((
          SELECT pm.meta_value FROM tbl_productmeta pm
          WHERE pm.product_id = p.ID AND pm.meta_key = '_stock'
          ORDER BY pm.meta_id DESC LIMIT 1
        ) AS UNSIGNED) <= 5
      ORDER BY stock ASC
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  showDashboard,
  loadMoreBestSellers,
  loadMoreOrders,
  loadMoreUsers,
  loadMoreLowStock,
};
