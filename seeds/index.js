const mongoose = require('mongoose');
const Planet = require('../models/planet');
const { places, descriptors, images } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/Planet-Scope', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Planet.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const planet = new Planet({
            author: '62004105f0bb7e34427fc592',
            pname: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            image: `${sample(images)}`
        })
        await planet.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})