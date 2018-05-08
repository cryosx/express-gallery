const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

const routes = require('./routes');

const app = express();

app.engine('.hbs', handlebars({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use('/', routes);

module.exports = app;
