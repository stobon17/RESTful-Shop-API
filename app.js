const express = require('express');

//Starts express application
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
//Sets up middleware, incoming requests go through app.use().

//Anything that reaches /products will use the products routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


module.exports = app;