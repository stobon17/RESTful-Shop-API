const express = require('express');

//Router -- we want GET/POST
const router = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../auth/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) 
    {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb)
    {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //Only accept PNG or JPG
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else 
    {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});
const Product = require('../models/product');


router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productIMG')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productIMG: doc.productIMG,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + doc._id
                    }
                }
            })
        };
       // if (docs.length >= 0)
        //{
            res.status(200).json(response);
       // }
/*         else
        {
            res.status(404).json({
                message: 'No entries found.'
            })
        } */
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', checkAuth, upload.single('productIMG'), (req, res, next) => {
    //Product object for mongoose
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productIMG: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully.',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/products/' + result._id
                }
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


//Single product requests -- in express variable setup is used with :
router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc)
        {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_PROD',
                    url: 'http://localhost:4000/products'
                }
            });
        }
        else
        {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            })
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});


//Patch
router.patch('/:productID', checkAuth, (req, res, next) => {
    const id = req.params.productID;
    const updateOperations = {};
    for (const ops of req.body) 
    {
        updateOperations[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { $set: updateOperations })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated successfully.',
            request: {
                type: 'GET',
                url: 'http://localhost:4000/products/' + id
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

//Delete
router.delete('/:productID', checkAuth, (req, res, next) => {
    const id = req.params.productID;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product successfully deleted.',
            request: {
                type: 'POST',
                url: 'http://localhost:4000/products',
                body: { name: 'String', price: 'Number' }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;