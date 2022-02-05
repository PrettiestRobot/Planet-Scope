const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.listen(300, () => {
    console.log('serving on port 300')
})