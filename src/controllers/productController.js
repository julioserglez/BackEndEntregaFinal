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

async function  createProductsForm(req, res) {
  try {
    res.render('products/create', { title: 'Crear producto', product: {}, errors: {} });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function createProduct(req, res) {
  try {
    await productService.createProduct(req.body);
    res.redirect('/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
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

async function  getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/detail', { title: 'Detalles del producto', product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function  getProductByIdEdit(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/edit', { title: 'Editar producto', product });
  } catch (error) {
    res.status(404).json({ error: error.message });
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

async function updateProductById(req, res) {
  try {
    await productService.updateProductById(
      req.params.id,
      req.body
    );
    res.redirect('/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
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

