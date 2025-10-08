const Product = require("../models/productModel");

async function getAllProducts() {
  try {
    const products = await Product.find().lean();
    return products;
  } catch (error) {
    throw new Error("Error al obtener productos");
  }
}

async function createProduct(data) {
  try {
    if (!data) throw new Error("Datos del producto no proporcionados");
    const newProduct = new Product(data);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    console.error("Error creando producto:", error);
    throw new Error("Error al crear producto");
  }
}

async function obtenerProductosUnicosOrdenados() {
  try {
    const codigosUnicos = await Product.distinct('productId').sort('productId');
    const products = await Product.find({
      productId: { $in: codigosUnicos }
    }).sort('productId');
    return products;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw new Error("Error al obtener productos");
  }
}

async function getProductByID(_id) {
  try {
    return await Product.findById({_id});
  } catch (error) {
    console.error("Error (2) buscando por ID:", error);
    return null;
  }
}

async function getProductByIdProduct(productId) {
  try {
    return await Product.findOne({productId});
  } catch (error) { 
    console.error("Error buscando por Codigo:", error);
    return null;
  }
}

async function updateProductById( _id, data) {
  const { id } = data;
  try {
      const productUpdated = await Product.findByIdAndUpdate(_id, data); // 1 || 0 -> userOld{data}
      return productUpdated;
  } catch (error) {
    console.error("Error actualizando:", error);
    throw new Error("Error al actualizar");
  }
}

async function deleteProductById(_id) {
  try {
    const productDelete = await Product.findByIdAndDelete(_id);
    return productDelete;
  } catch (error) {
    console.error("Error eliminando:", error.message);
    return null;
  }
}

module.exports = {
  getAllProducts, 
  createProduct,
  getProductByID,
  getProductByIdProduct,
  updateProductById,
  deleteProductById,
  obtenerProductosUnicosOrdenados
};
