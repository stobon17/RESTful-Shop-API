const express = require('express');

//Router -- we want GET/POST
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Order was fetched!'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Order was created!'
    });
});


//ID

router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order was fetched!',
        orderID: req.params.orderID
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order was deleted!',
        orderID: req.params.orderID
    });
});


module.exports = router;