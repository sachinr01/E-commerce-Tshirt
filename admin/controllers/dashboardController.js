const db = require('../config/db');

const showDashboard = async (req, res) => {
    try {
        // =========================
        // USER STATS
        // =========================
        const [[{ totalUsers }]] = await db.query(
            'SELECT COUNT(*) AS totalUsers FROM tbl_users'
        );

        const [[{ activeUsers }]] = await db.query(
            'SELECT COUNT(*) AS activeUsers FROM tbl_users WHERE user_status = 0'
        );

        const [[{ inactiveUsers }]] = await db.query(
            'SELECT COUNT(*) AS inactiveUsers FROM tbl_users WHERE user_status = 1'
        );

        // =========================
        // ORDER STATS
        // =========================
        const [[{ totalOrders }]] = await db.query(
            `SELECT COUNT(*) AS totalOrders
             FROM tbl_orders
             WHERE order_type = 'shop_order'`
        );

        // =========================
        // TOTAL SALES
        // =========================
        const [[{ totalRevenue }]] = await db.query(
            `SELECT IFNULL(SUM(CAST(meta_value AS DECIMAL(10,2))),0) AS totalRevenue
             FROM tbl_ordermeta
             WHERE meta_key = '_order_total'`
        );

        // =========================
        // BEST SELLER PRODUCTS
        // =========================
        const [bestSellers] = await db.query(`
            SELECT
                p.ID,
                p.product_title,
                COUNT(oim.meta_value) AS totalSold,
                (SELECT m.media_path FROM tbl_media m 
                 WHERE m.parent_id = p.ID AND m.media_type = 'product_image'
                 ORDER BY m.media_id ASC LIMIT 1) AS thumbnail
            FROM tbl_order_itemmeta oim
            INNER JOIN tbl_order_items oi ON oi.order_item_id = oim.order_item_id
            INNER JOIN tbl_products p ON p.ID = oim.meta_value
            WHERE oim.meta_key = '_product_id'
            GROUP BY p.ID
            ORDER BY totalSold DESC
            LIMIT 5
        `);

        // =========================
        // LATEST ORDERS
        // =========================
        const [latestOrders] = await db.query(`
            SELECT order_id, order_status, order_date
            FROM tbl_orders
            WHERE order_type = 'shop_order'
            ORDER BY order_date DESC
            LIMIT 5
        `);

        // =========================
        // CATEGORY PRODUCTS
        // =========================
        const [categoryProducts] = await db.query(`
            SELECT
                c.category_name,
                p.ID,
                p.product_title
            FROM tbl_products_category_link pcl
            INNER JOIN tbl_products_category c ON c.category_id = pcl.category_id
            INNER JOIN tbl_products p ON p.ID = pcl.product_id
            WHERE p.parent_id = 0
            ORDER BY c.category_name ASC
            LIMIT 12
        `);

        // =========================
        // RECENT USERS
        // =========================
        const [recentUsers] = await db.query(
            `SELECT ID, display_name, user_email, user_registered
             FROM tbl_users
             ORDER BY user_registered DESC
             LIMIT 5`
        );



        res.render('dashboard/index', {
            title: 'Dashboard',
            admin: req.session.admin,
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalOrders,
                totalRevenue
            },
            bestSellers,
            latestOrders,
            categoryProducts,
            recentUsers
        });

    } catch (error) {
        console.error('Dashboard Error:', error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { showDashboard };