const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/create', productController.createProductsForm );
router.get('/', productController.getAllProducts3 );
router.get('/edit/:id', productController.getProductByIdEdit );
router.get('/:id', productController.getProductById );

router.post('/update/:id', productController.updateProductById);
router.post('/delete/:id', productController.deleteProductById);
router.post('/', productController.createProduct);


module.exports = router;
