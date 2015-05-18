// The MIT License (MIT)

// Copyright (c) 2015 Elliott Richerson, Carlos Aari Lotfipour

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/* NPM Dependencies */
var logger = require('koa-logger');
var mount = require('koa-mount');
var compose = require('koa-compose');
var router = require('koa-router');
var jwt = require('koa-jwt');
var http = require('http');
var https = require('https');
var fs = require('fs');
var bcrypt = require('co-bcrypt');
var parse = require('co-body');
var _ = require('lodash');

var config = require('./config');

var App = require('./App.js');
var Utility = require('./Utility.js');

var Errors = require('./Errors.js');
var Validate = require('./Validate.js');
var Router = require('./Router.js');

var AdminLogin = require('./AdminLogin.js');
var Admin = require('./Admin.js');

var UserLogin = require('./UserLogin.js');
var User = require('./User.js');

// Public Key Used for JWT Verification
var publicKey = fs.readFileSync('ssl/demo.rsa.pub');

/* Utilities and Extensions */
Date = require('./DatePrototype.js');

var app = module.exports = new App();

if (app.env === 'development') {
    console.log("NODE_ENV = 'development'");
    // Use Development Logger
    // Use Error Handler
}

var errors = new Errors();

var db = require('./Database2.js')('http://localhost:7474');


var utility = new Utility(errors);
var validate = new Validate(errors, _);

var adminLogin = new AdminLogin(db, bcrypt, fs, jwt, parse, errors, validate, utility);
var admin = new Admin(db, bcrypt, parse, errors, validate, jwt, utility);

var userLogin = new UserLogin(db, bcrypt, fs, jwt, parse, errors, validate, utility);
var user = new User(db, bcrypt, parse, errors, validate, jwt, utility);

var PublicAPI_V1 = require('./api/v1/PublicAPI_V1.js');
var pubV1 = new PublicAPI_V1(admin, adminLogin, user, userLogin);
var ProtectedAPI_V1 = require('./api/v1/ProtectedAPI_V1.js');
var apiV1 = new ProtectedAPI_V1(admin);

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(utility.middleware.custom401);

// Public Routes (do not require valid JWT)
app.use(mount('/api/v1', pubV1.middleware()));

// Private Routes (require valid JWT)
var checkJWT = jwt({
    secret: publicKey,
    algorithm: 'RS256',
    key: 'jwtdata'
})
app.use(mount('/api/v1', compose([checkJWT, apiV1.middleware()])));

var SSLOptions = {
    key: fs.readFileSync('ssl/digeocache-key.pem', 'utf8'),
    cert: fs.readFileSync('ssl/digeocache.crt', 'utf8')
}

var port = process.env.PORT || 8000;
var env = process.env.NODE_ENV || 'development';

if (!module.parent) {
    console.log("\n--- Starting App on Port ", port, "---");
    https.createServer(SSLOptions, app.callback()).listen(port);
} else {
    console.log("\n--- Starting App for Testing ---");
}