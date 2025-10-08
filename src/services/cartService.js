const cartDao = require("../data-access-object/cartDao");

async function getCartProducts() {
  const cart = await cartDao.getCartProducts();
  if (!cart) {
    throw new Error("El producto con ese Codigo ya existe")
  }
  return cart;
}

async function addProductToCart(productId) {
  return await cartDao.addProductToCart(productId);
}

async function removeProductFromCart( _id ) {
  return await cartDao.removeProductFromCart( _id );
}

module.exports = {
  getCartProducts,
  addProductToCart,
  removeProductFromCart
};



