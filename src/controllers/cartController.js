const cartService = require("../services/cartService");

async function getCartProducts (req, res){
  const cart = await cartService.getCartProducts();
  res.render('cart/listCart', { cart });
};

async function addToCart(req, res) {
try {
    const productId = req.params.id;
    const cart = await cartService.addProductToCart(productId);
    res.redirect('/');
  } catch (error) {
    res.status(404).json({ error: error.message });
    ///res.status(500).render('error', { message: 'Error al agregar al carrito' });
  }
}

async function removeFromCart(req, res) {
  try {
    const _id = req.params.id;
    await cartService.removeProductFromCart(_id);
    res.redirect('/cart');
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = {
  getCartProducts,
  addToCart,
  removeFromCart
};