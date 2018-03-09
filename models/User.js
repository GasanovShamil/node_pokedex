const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
    name: String,
    emailAddress: String,
    password: String,
    pokemonCaptured: [{type:mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('User', userSchema);