const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanetSchema = new Schema({
    pname: String,
    description: String
});

module.exports = mongoose.model('Planet', PlanetSchema);