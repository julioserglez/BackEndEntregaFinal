const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  productId: { 
    type: Number, 
    required: [true, "El codigo del producto es obligatorio"], 
    unique: true,
    index: true,
    min: 100, 
    max: 999,
  },
  description: { 
    type: String, 
    required: [true, "La descripción del producto es obligatoria"],
    maxlength: 500 
  },
  price: { 
    type: Number, 
    min: 0, 
    required: [true, "El precio del producto es obligatorio"]
  },
  stock: { 
    type: Number, 
    min: [ 0, "El stock no puede ser negativo"],
    default: 0 
  },
  category: { 
    type: String, 
    required: [true, "La categoría del producto es obligatoria"]
  },
  image: {
    type: String, 
    default: null 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
});

productSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Product', productSchema);
