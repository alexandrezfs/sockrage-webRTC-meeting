/**
 * GLOBAL VARS
 * @type {exports}
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = module.exports.app = express();
var server = require('http').Server(app);
var config = require('./config');
var multer  = require('multer');

/**
 * App settings
 */
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './public/uploads/'}))

/**
 * Rendering Index
 */
app.route('/').get(function(req, res) {

    res.render('index', {
        sockrage_addr : config.configObject.sockrage_addr,
        db: config.configObject.db,
        page : 'index'
    });

});

/**
 * Rendering Sign Up page
 */
app.route('/signup').get(function(req, res) {
    res.render('signup', {
        page : 'signup',
        sockrage : {
            addr : config.configObject.sockrage_addr,
            db : config.configObject.db.user
        }
    });
});

/**
 * Login page
 */
app.route('/login').get(function(req, res) {
    res.render('login', {
        page : 'login',
        sockrage : {
            addr : config.configObject.sockrage_addr,
            db : config.configObject.db.user
        }
    });
});

/**
 * Dashboard
 */
app.route('/dashboard').get(function(req, res) {
    res.render('dashboard', {
        page : 'dashboard',
        sockrage : {
            addr : config.configObject.sockrage_addr,
            db : config.configObject.db.user
        }
    });
});

/**
 * Upload route
 */
app.route('/upload').post(function(req, res) {

    console.log(req.body);
    console.log(req.files);

    res.send(req.files);

});

/**
 * LISTEN SERVER
 */
server.listen(config.configObject.server_port, function() {
    console.log("Express server started on port " + config.configObject.server_port);
});