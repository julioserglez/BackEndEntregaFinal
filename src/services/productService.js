const productDao = require("../data-access-object/productDao");

async function getAllProducts() {
  return await productDao.getAllProducts();
}

async function obtenerProductosUnicosOrdenados() {
  return await productDao.obtenerProductosUnicosOrdenados();
}

async function getProductById(id) {
  const product = await productDao.getProductByID(id);
  if (!product) {
    throw new Error("Producto no encontrado");
  }
  return product;
}

async function createProduct(data) {
  const { productId, description, price, stock, category } = data;
  if (!productId || !description || !price || !stock || !category) {
    throw new Error("Faltan campos requeridos: Codigo, Descripción, Existencia o Precio");
  }
  const existente = await productDao.getProductByIdProduct(productId);
  if (existente) {
    throw new Error("El producto con ese Codigo ya existe");
  }
  return await productDao.createProduct(data);
}


async function updateProductById( _id, data) {
  if (!_id) {
    throw new Error("ID es requerido");
  }
  
  const actualizado = await productDao.updateProductById( _id, data);
  if (!actualizado) {
    throw new Error("No se pudo actualizar");
  }
  return actualizado;
}

async function deleteProductById(id) {
  const eliminado = await productDao.deleteProductById(id);
  if (!eliminado) {
    throw new Error("No se encontró producto para eliminar");
  }
  return eliminado;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  obtenerProductosUnicosOrdenados
};
