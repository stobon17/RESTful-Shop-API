const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

//Sign-up and Sign-in

//POST for signup
router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1)
        {
            return res.status(409).json({
                message: "Email already exists."
            });
        }
        else
        {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) 
                {
                    return res.status(500).json({
                        error: err
                    });
                }
                else 
                {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })
})

//Login route
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(users => {
        if (users.length < 1)
        {
            return res.status(401).json({
                message: 'Authentication failed.'
            });
        }
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if(err)
            {
                return res.status(401).json({
                    message: 'Authentication failed.'
                });
            }
            if(result)
            {
                const token = jwt.sign(
                {
                    email: users[0].email,
                    userID: users[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Authentication successful.',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Authentication failed.'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Delete users
router.delete('/:userID', (req, res, next) => {
    User.deleteOne({ _id: req.params.userID })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted.'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports = router;