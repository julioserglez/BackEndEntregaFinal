const productService = require("../services/productService");
const productNum = require("../models/productModel");

async function getAllProductsContainer(req, res) {
  const { search, category, minPrice, maxPrice, productId } = req.query;
  const query = {};
  if (search) query.description = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (productId) query.productId = productId;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
   const products = await productNum.find(query);
    res.render('products/container', { title: 'Lista de Productos', products });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
}

///Formulario de creación
async function  createProductsForm(req, res) {
  try {
    res.render('products/create', { title: 'Crear Nuevo producto', product: {}, errors: {} });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function getAllProducts3(req, res) {
  const { page = 1, limit = 10, sort = 'productoId' } = req.query;
  const query = {};
  query.productId = { $exists: true };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: {'productId': 1 }
   };
   try { 
      const result = await productNum.paginate( query, options);
      const uniqueCode = await productNum.distinct('productId').exec();
      res.render('products/list', { products: result.docs, pagination: result });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
};

async function getAllProducts2(req, res) {
  const { page = 1, limit = 5, sort = 'price', category, minPrice, maxPrice } = req.query;
  const query = {};
  if (category) query.category = category;
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sort]: 1 }
  };

    try { 
      const result = await productNum.paginate(query, options);
      res.render('products2', { products: result.docs, pagination: result });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
};

async function getAllProducts(req, res) {
    try {
      const { page = 1, limit = 4 } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { grade: -1 },
      };
      const result = await productNum.paginate({}, options);
 
      res.render("products/list", {
        title: 'Lista de Productos'  ,
        products: result.docs,
        currentPage: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
      });

    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
};

async function getAllProductsPagination(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { grade: -1 },
      };

      const result = await productNum.paginate({}, options);
 
      res.render("products", {
        title: 'Lista de Productos'  ,
        products: result.docs,
        currentPage: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
      });



    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
};

/// Editar producto
async function  getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/detail', { title: 'Detalles del producto', product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
/// Formulario de edición
async function  getProductByIdEdit(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "ID de producto no es válido" });
    }

    const product = await productService.getProductById(req.params.id);
    const { _id, productId, description, price, category, stock } = product;
   
    res.render("products/edit", {
      product: { _id, productId, description, price, category, stock },
      errors: {}
    });
      
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
/*----------------------POST----------------------*/
/// Boton de Guardar en el formulario de creación
async function createProduct(req, res) {
  try {
    const { productId, description, price, category, stock } = req.body;
    // Validar campos requeridos
    if (!productId || isNaN(productId) || productId.trim() === '') {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { productId: "El codigo es obligatorio" },
      });
    }
    if ( !description || typeof description !== 'string' || description.trim() === '') {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "La descripción es obligatoria" }
      });
    }
    if ( !price || isNaN(price) || price <= 0) {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "El precio no es válido" }
      });
    }
    if (!stock || isNaN(stock) || stock < 0) {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "El stock no es válido" }
      });
    }
    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "La categoría es obligatoria" }
      });
    }
    if (productId < 100 || productId > 999) {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { productId: "El código debe estar entre 100 y 999" }
      });
    }

    // Validar que el código no exista previamente
    const productoExistente = await productNum.findOne({ productId });
    if (productoExistente) {
      return res.render("products/create", {
      action: "/products",
      product: { productId, description, price, category, stock },
      errors: { productId: "El código de producto ya existe." },
      submitLabel: "Guardar"
      });
    }
    
    await productService.createProduct(req.body);
    res.redirect('/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateProductById(req, res) {
  try {
    const { productId, description, price, category, stock } = req.body;
    // Validar campos requeridos
    if (!productId || isNaN(productId) || productId.trim() === '') {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { productId: "El codigo es obligatorio" },
      });
    }
    if ( !description || typeof description !== 'string' || description.trim() === '') {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "La descripción es obligatoria" }
      });
    }
    if ( !price || isNaN(price) || price <= 0) {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "El precio no es válido" }
      });
    }
    if (!stock || isNaN(stock) || stock < 0) {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "El stock no es válido" }
      });
    }
    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { description: "La categoría es obligatoria" }
      });
    }
    if (productId < 100 || productId > 999) {
      return res.render("products/create", {
        product: { productId, description, price, category, stock },
        errors: { productId: "El código debe estar entre 100 y 999" }
      });
    }
    
    await productService.updateProductById(
      req.params.id,
      req.body
    );
    res.redirect('/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function  createProductPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('products/create', { title: 'Crear producto', product: req.body, errors: errors.mapped() });
  }
  try {
    await Product.create(req.body);
    res.redirect('/products');
  } catch (err) {
    res.render('products/create', { title: 'Crear producto', product: req.body, errors: { general: err.message } });
  }
}



async function deleteProductById(req, res) {
  try {
    await productService.deleteProductById(req.params.id);
    res.redirect('/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getAllProductsContainer,
  createProductsForm,
  getProductByIdEdit,
  createProductPost,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProductsPagination,
  getAllProducts2,
  getAllProducts3
};

