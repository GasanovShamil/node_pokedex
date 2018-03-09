var express = require('express');
var router = express.Router();
var pokemonModel = require('../models/Pokemon');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pokedex');


/**
 * @swagger
 * /pokemons:
 *   get:
 *     tags:
 *       - Pokemons
 *     description: Returns all pokemons
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of pokemons
 */
router.get('/', function(req, res) {
    pokemonModel.find(function (err, pokemons) {
        if (err)
            res.json({status:'error',message:err});
        else
            res.json(pokemons);
    });
});

/**
 * @swagger
 * /pokemons/{id}:
 *   get:
 *     tags:
 *       - Pokemons
 *     description: Returns a single Pokemon
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Pokemons's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single Pokemon
 */
router.get('/:id', function(req, res) {
    let id = req.params.id;
    pokemonModel.find({_id:id}, function(err, pokemon){
        if (err)
            res.json({status:'error',message:err});
        else
            res.json(pokemon);
    });
});

/* Create a pokemon */
router.post('/', function(req, res) {
    let addPokemon = req.body;
    pokemonModel.create(addPokemon, function (err) {
        if (err)
            res.json({status:'error',message:err});
        else
            res.json({status:'success'});
    });
});

/* Edit all pokemons' field */
router.put('/:id', function(req, res) {
    let id = req.params.id;
    let editPokemon = req.body;

    pokemonModel.findByIdAndUpdate(id, editPokemon, null, function(err){
        if (err)
            res.json({status:'error',message:err});
        else{
            res.json({status:'success'});
        }
    });
});

/* Edit one pokemon's field */
router.patch('/:id', function(req, res) {
    let id = req.params.id;
    let editPokemon = req.body;

    pokemonModel.findByIdAndUpdate(id, editPokemon, null, function(err){
        if (err)
            res.json({status:'error',message:err});
        else{
            res.json({status:'success'});
        }
    });
});

/* Delete a pokemon */
router.delete('/:id', function(req, res) {
    let id = req.params.id;
    pokemonModel.findOneAndRemove({_id:id}, function(err){
        if (err)
            res.json({status:'error',message:err});
        else
            res.json("success");
    });
});

module.exports = router;
