const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.get('/',  cartController.getCartProducts);
router.post('/remove/:id', cartController.removeFromCart);
router.post('/add/:id', cartController.addToCart);

module.exports = router;
