const Cart = require("../models/cartModel");
const Product = require('../models/productModel');

async function getCartProducts() {
  let cart = await Cart.findOne({}).populate('products.product');
  if (!cart) {
    cart = await Cart.create({ products: [] });
  }
  return cart;
}

async function getCart() {
  let cart = await Cart.findOne({}).populate('products.product');
  if (!cart) {
    cart = await Cart.create({ products: [] });
  }
  return cart;
}

// Agregar producto al carrito
async function addProductToCart(productId) {
  let cart = await getCart();
  const existingItem = cart.products.find(p => p.product._id.toString() === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }
  await cart.save();
  return cart;
}

async function addProduct(data) {
  try {
    if (!data) throw new Error("Datos del producto no proporcionados");
    const newCartProduct = new Cart(data);
    await newCartProduct.save();
    return newCartProduct;
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    throw new Error("Error al agregar producto al carrito");
  }
}

async function removeProductFromCart( _id ) {
  try {
    if (!_id) throw new Error("ID del producto no proporcionado");
    let cart = await Cart.findOne();
    if (!cart) return res.redirect('/cart');
    const itemIndex = cart.products.findIndex(item => item._id.toString() === _id.toString());
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity -= 1;
      if (cart.products[itemIndex].quantity <= 0) {
        cart.products.splice(itemIndex, 1);
      }

      await cart.save();
    }
    
    return getCart();
  } catch (error) {
    console.error("Error al quitar producto al carrito:", error);
    throw new Error("Error al quitar producto al carrito");
  }
}


async function obtenerProductosUnicosOrdenados() {
  try {
    const codigosUnicos = await Product.distinct('productoId').sort('productoId');
    const products = await Product.find({
      productoId: { $in: codigosUnicos }
    }).sort('productoId');
    return products;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
}

module.exports = {
  getCartProducts,
  addProductToCart,
  addProduct,
  removeProductFromCart,
  obtenerProductosUnicosOrdenados
};
