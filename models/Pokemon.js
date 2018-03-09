const mongoose = require('mongoose');

const evolutionSchema = mongoose.Schema ({
    evolutionLevel: Number,
    evolutionName: String
});

const pokemonSchema = mongoose.Schema ({
    name: String,
    type: String,
    level: Number,
    img: String,
    evolution: [evolutionSchema]
});

module.exports = mongoose.model('Pokemon', pokemonSchema);