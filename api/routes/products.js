const express = require('express');

//Router -- we want GET/POST
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST requests to /products'
    });
});


//Single product requests -- in express variable setup is used with :
router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    if (id === 'special')
    {
        res.status(200).json({
            message: 'You discovered the special ID!',
            id: id
        });
    }
    else{
        res.status(200).json({
            message: 'You passed an ID.',
            id: id
        });
    }
});


//Patch
router.patch('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

//Delete
router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});


module.exports = router;