const express = require('express');

//Router -- we want GET/POST
const router = express.Router();

//Imports
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order
    .find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/orders/' + doc._id
                    }
                }
            })
           
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', (req, res, next) => {
    //Only create orders for existing products
    Product.findById(req.body.productID)
    .then(product => {

        if (!product)
        {
            return res.status(400).json({
                message: "Product not found."
            });
        }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productID
        });
        return order
        .save()
        
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored.',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:4000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});


//ID

router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID)
    .populate('product')
    .exec()
    .then(order => {

        if(!order) {
            return res.status(404).json({
                message: 'Order not found.'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:4000/orders'
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    });
});

router.delete('/:orderID', (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderID })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted.',
            request: {
                type: 'GET',
                url: 'http://localhost:4000/orders',
                body: { productID: 'ID', quantity: 'Number' }
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    });
});


module.exports = router;