var express = require('express');
var router = express.Router();
var userModel = require('../models/User');
var pokemonModel = require('../models/Pokemon');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost:27017/pokedex');

// Create a users
router.post('/', function(req, res) {
    let addUser = req.body;
    userModel.create(addUser, function (err) {
        if (err)
            res.json({status:'error',message:err});
        else
            res.json({status:'success'});
    });
});

router.use((req, res, next) => {
    const bearerHeader = req.get('Authorization');
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(bearerToken, 'azfezaqffré843848', (err, decoded) => {
            if(err)
                res.sendStatus(403);
            else{
                console.log(decoded);
                req.loggedUser = decoded;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
});

// GET users listing.
router.get('/', function(req, res) {
    userModel.find(function (err, users) {
        if (err)
            res.json({status:'error',message:err});
        else
            res.json(users);
    });
});

// Get All Users' pokemons
router.get('/pokemons', function(req, res) {
    let idUser = req.loggedUser._id;
    userModel.findOne({_id:idUser}, function(err, user){
        console.log(user);
        if (err)
            res.json({status:'error',message:err});
        else{
            let pokemonIds = user.pokemonCaptured;
            pokemonModel.find({_id:{ $in: pokemonIds}}, (err, pokemons) => {
                if (err)
                    res.json({status:'error',message:err});
                else
                    res.json(pokemons);
            });
        }
    });
});

// Get one pokemon's user by Id
router.get('/pokemons/:idPokemon', function(req, res) {
    let idUser = req.loggedUser._id;
    let idPokemon = req.params.idPokemon;
    userModel.find({_id:idUser, pokemonCaptured:idPokemon}, function(err, users){
        if (err || users.length === 0)
            res.json({status:'error1',message:err});
        else{
            pokemonModel.find({_id:idPokemon}, (err, pokemon) => {
                if (err)
                    res.json({status:'error2',message:err});
                else
                    res.json(pokemon);
            });
        }
    });
});

// Ajoute un pokemon existant dans la base à un user
router.post('/pokemons/:idPokemon', function(req, res) {
    let idUser = req.loggedUser._id;
    let idPokemon = req.params.idPokemon;

    userModel.findByIdAndUpdate(idUser, {$addToSet: {pokemonCaptured: idPokemon}}, null, function(err){
        if (err)
            res.json({status:'error',message:err});
        else{
            res.json({status:'success'});
        }
    });
});

// Modifie le champs d'un user
router.patch('/', function(req, res) {
    let idUser = req.loggedUser._id;
    let editUser = req.body;
    userModel.findByIdAndUpdate(idUser, editUser, null, function(err) {
        if (err)
            res.json({status:'error', message:err});
        else {
            res.json({status: 'success'});
        }
    });
});

// Delete a user
router.delete('/', function(req, res) {
    let idUser = req.loggedUser._id;
    userModel.findOneAndRemove({_id:idUser}, function(err){
        if (err)
            res.json({status:'error',message:err});
        else
            res.json("success");
    });
});
// Delete a pokemon to user
router.delete('/pokemons/:idPokemon', function(req, res) {
    let idUser = req.loggedUser._id;
    let idPokemon = req.params.idPokemon;
    userModel.findOneAndUpdate({_id:idUser}, {$pull: {pokemonCaptured:idPokemon}}, function(err){
        if (err)
            res.json({status:'error',message:err});
        else
            res.json("success");
    });
});

module.exports = router;
