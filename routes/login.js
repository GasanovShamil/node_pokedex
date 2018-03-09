var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pokedex');
var userModel = require('../models/User');


router.post('/', function(req, res) {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    if (userEmail && userPassword) {
        userModel.find({emailAddress:userEmail, password:userPassword}, (err, user) => {

                if (err || user.length ===0)
                    res.json({status: 'error', message: 'Login et/ou mot de passe incorrect'});
                else {
                    let loggedUser = {
                        name : user[0].name,
                        _id : user[0]._id
                    };
                    jwt.sign(loggedUser, 'azfezaqffré843848', (err, token) => {
                        res.json({
                            token
                        });
                    });
                }
            }
        );
    } else {
        res.json({status: 'error', message: 'Login et/ou mot de passe non renseignés !'});
    }
});

module.exports = router;
