const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Planet = require('./models/planet');

mongoose.connect('mongodb://localhost:27017/Planet-Scope', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



// --------------
// ROUTE HANDLING
// --------------

//INDEX
app.get('/planets', async (req, res) => {
    const planets = await Planet.find({});
    res.render('planets/index', { planets });
})
//NEW
app.get('/planets/new', (req, res) => {
    res.render('planets/new');
})

app.post('/planets', async (req, res) => {
    const planet = new Planet(req.body.planet);
    await planet.save();
    res.redirect(`/planets/${planet._id}`); 
})
//SHOW
app.get('/planets/:id', async (req, res) => {
    const planet = await Planet.findById(req.params.id);
    res.render('planets/show', { planet });

})
//EDIT
app.get('/planets/:id/edit', async (req, res) => {
    const planet = await Planet.findById(req.params.id)
    res.render('planets/edit', { planet });
})

app.put('/planets/:id', async (req, res) => {
    const { id } = req.params;
    const planet = await Planet.findByIdAndUpdate(id, { ...req.body.planet });
    res.redirect(`/planets/${planet._id}`)
});

//DESTROY

app.delete('/planets/:id', async (req, res) => {
    const { id } = req.params;
    await Planet.findByIdAndDelete(id);
    res.redirect('/planets');
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})