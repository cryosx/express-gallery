const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const routes = require('./routes');

const app = express();

app.engine('.hbs', handlebars({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

// after login
passport.serializeUser((user, done) => {
    console.log('serializing');
    return done(null, {
        id: user.id,
        email: user.email
    });
});

// after every request 
passport.deserializeUser((user, done) => {
    console.log('deserializing');
    new User({ id: user.id }).fetch()
        .then(user => {
            user = user.toJSON();
            return done(null, {
                id: user.id,
                email: user.email
            });
        })
        .catch((err) => {
            console.log(err);
            return done(err);

        });
});

passport.use(new LocalStrategy(function (email, password, done) {
    return new User({ email: username }).fetch()
        .then(user => {
            user = user.toJSON();
            console.log(user)
            if (user === null) {
                return done(null, false, { message: 'bad email or password' });
            }
            else {
                console.log(password, user.password);
                if (password === user.password) { return done(null, user); }
                else {
                    return done(null, false, { message: 'bad email or password' });
                }
            }
        })
        .catch(err => {
            console.log('error: ', err);
            return done(err);
        });
}));


module.exports = app;
