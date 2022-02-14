const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync')
const Planet = require('./models/planet');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

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

//Serve Public Directory
app.use(express.static(path.join(__dirname,'public')))

//Express Session Config
const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    } 
}
app.use(session(sessionConfig))
app.use(flash());

//Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// --------------
// ROUTE HANDLING
// --------------

//INDEX
app.get('/planets', catchAsync(async (req, res) => {
    const planets = await Planet.find({});
    res.render('planets/index', { planets });
}));
//NEW
app.get('/planets/new', (req, res) => {
    res.render('planets/new');
});

app.post('/planets', catchAsync(async (req, res) => {
    const planet = new Planet(req.body.planet);
    await planet.save();
    res.redirect(`/planets/${planet._id}`); 
}));
//SHOW
app.get('/planets/:id', catchAsync(async (req, res) => {
    const planet = await Planet.findById(req.params.id).populate('author');
    res.render('planets/show', { planet });

}));
//EDIT
app.get('/planets/:id/edit', catchAsync(async (req, res) => {
    const planet = await Planet.findById(req.params.id)
    res.render('planets/edit', { planet });
}));

app.put('/planets/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const planet = await Planet.findByIdAndUpdate(id, { ...req.body.planet });
    res.redirect(`/planets/${planet._id}`)
}));

//DESTROY

app.delete('/planets/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Planet.findByIdAndDelete(id);
    res.redirect('/planets');
}));

// -----------
// USER ROUTES
// -----------

//REGISTER
app.get('/register', (req, res) => {
    res.render('users/register');
})

app.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Planet-Scope!');
            res.redirect('/planets');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

//LOGIN

app.get('/login', (req,res) => {
    res.render('users/login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/planets';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//LOGOUT

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/planets');
})

// --------------
// ERROR HANDLING
// --------------

//For every request (* = for every path) Creates a new express error.
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

//-------------------------------------------------------------------
app.listen(3000, () => {
    console.log('serving on port 3000')
})