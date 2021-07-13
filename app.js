const express = require('express');

//Starts express application
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const mongoose = require('mongoose');

//MongoDB Setup

mongoose.connect('mongodb+srv://stobon:' + 
                    process.env.MONGO_ATLAS_PW + 
                    '@cluster0.lztg3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    }
);

//Sets up middleware, incoming requests go through app.use().
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

//Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
    const error = new Error('Not Found.');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;