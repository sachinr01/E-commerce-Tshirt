const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');



const {
  showDashboard,
  loadMoreBestSellers,
  loadMoreOrders,
  loadMoreUsers,
  loadMoreLowStock,
} = require('../controllers/dashboardController');

// Main dashboard page
router.get('/dashboard', isAuthenticated, showDashboard);

// AJAX "load more" endpoints (no auth middleware shown – add yours as needed)
router.get('/load-more/best-sellers', isAuthenticated, loadMoreBestSellers);
router.get('/load-more/orders',       isAuthenticated, loadMoreOrders);
router.get('/load-more/users',        isAuthenticated, loadMoreUsers);
router.get('/load-more/low-stock',    isAuthenticated, loadMoreLowStock);

module.exports = router;