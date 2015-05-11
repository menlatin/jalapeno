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
var jwt     = require('koa-jwt');
var mount   = require('koa-mount');
var compose = require('koa-compose');
var http    = require('http');
var https   = require('https');
var fs 	    = require('fs');
var bcrypt  = require('co-bcrypt');
var views 	= require('co-views');
var parse 	= require('co-body');
var swig 		= require('swig');
var render 	= views(__dirname + '/views', { map: { html: 'swig' }});

/* Utilities and Extensions */
Date = require('./DatePrototype.js');

/* Modularized Implementations */
var App 		    = require('./App.js');
var Security 	  = require('./Security.js');
var Database 	  = require('./Database.js');
var Operations  = require('./Operations.js');

/* Entity REST Implementations and Page Rendering */
var Login       = require('./api/login/Login.js');
var LoginSchema = require('./api/login/LoginSchema.js');
var LoginPages  = require('./api/login/LoginPages.js');

var Admin 			= require('./api/admins/Admin.js');
var AdminSchema = require('./api/admins/AdminSchema.js');
var AdminPages 	= require('./api/admins/AdminPages.js');

var User 			  = require('./api/users/User.js');
var UserSchema 	= require('./api/users/UserSchema.js');
var UserPages 	= require('./api/users/UserPages.js');

var Geocache 		= require('./api/geocaches/Geocache.js');
var GeocacheSchema 	= require('./api/geocaches/GeocacheSchema.js');
var GeocachePages 	= require('./api/geocaches/GeocachePages.js');

var Forms			  = require('./Forms.js');
var Views  			= require('./Views.js');

/* Validation and Error Handling Implementations */
var Validate 		= require('./api/validation/Validate.js');
var RegEx 			= require('./api/validation/RegEx.js');
var Dates 			= require('./api/validation/Dates.js');

var Errors 			= require('./api/errors/Errors.js');
var ErrorPages 	= require('./api/errors/ErrorPages.js');
var HttpCodes 	= require('./api/errors/HttpCodes.js');

/* Instantiate App, Database, and Routing Helpers */
var app 			  = new App();
var database 		= new Database("http://localhost:7474");
var operations 	= new Operations();

/* Instantiate Validation and Error Handling */
var errors 			= new Errors();
var regex 			= new RegEx(errors);
var dates 			= new Dates(errors);
var validate 		= new Validate(operations,errors);
var error_pages 	= new ErrorPages(render);

/* Instantiate REST Operations and Page Rendering */
var login_schema  = new LoginSchema(regex, dates);
var admin_schema 	= new AdminSchema(regex,dates);
var user_schema 	= new UserSchema(regex,dates);
var geocache_schema = new GeocacheSchema(regex,dates);

var forms 			= new Forms(render, error_pages);
var views 			= new Views(render, error_pages);
var login_pages = new LoginPages(database, forms, views, login_schema, error_pages);
var admin_pages = new AdminPages(database, forms, views, admin_schema, error_pages);
var user_pages 	= new UserPages(forms, views, user_schema);
var geocache_pages 	= new GeocachePages(forms, views, geocache_schema);

var login       = new Login(database,bcrypt,jwt,fs,parse,login_schema,validate,errors, login_pages, error_pages);
var admin 			= new Admin(database, bcrypt, parse, admin_schema, validate, errors, admin_pages, error_pages);
var user 			  = new User(database, bcrypt, parse, user_schema, validate, errors, user_pages);
var geocache 		= new Geocache(database, bcrypt, parse, geocache_schema, validate, errors, geocache_pages);

var publicKey = fs.readFileSync('ssl/demo.rsa.pub');

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function *(next){
  try {
    yield next; // Attempt to go through the JWT Validator
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err; // Pass error to next handler since it wasn't a JWT error
    }
  }
});

function helsinki() {
  return function * (next) {
    var tok = "eyJhbGciOiJSUzI1NiJ9.dGVzdHVzZXIx.d_ioFFzDVp6Eduwf9YGuAR-XAtpGOyXJRAL3gNEFQlQi0fwIFAN75PA8P7BfX5oMOMp4bxHfeb5Eu1DC4CvaFvxdzSRedwSB_yeODWconbv80CXM_lFFSpJW4zSjQPyVF2cG3ZMkg1sW_2kfCJvLuTSawA-skDlrKAeTdg736_w";
    this.set("Authorization", "Bearer " + tok);
    console.log("Hell yes moffa: ", this.request.headers);
  }
}

////
////

var Router = require('./Router.js');
var router = new Router(jwt, publicKey, operations, login_pages, login, admin_pages, user_pages, geocache_pages);

var APIv1 = require('./APIv1.js');
var apiv1 = new APIv1(jwt, publicKey, operations, admin, user, geocache, error_pages);

// Routes
app.use(mount('/', router.middleware()));
app.use(mount('/api/v1', apiv1.middleware()));

// Protected Routes
// app.use(mount('/', compose([jwt({ secret: publicKey, algorithm: 'RS256' }), router.protected.middleware()])));
// app.use(mount('/api/v1', compose([jwt({ secret: publicKey, algorithm: 'RS256' }), apiv1.protected.middleware()])));

////
////


//TODO: Product, Transactions, Friends, Image, Audio, Video, Articles, Comments, Subcomments
//TODO: Derived/Compound Queries Formed From Relationships -> Feed, Mutual Friends, Offers, Followings

// SSL Options
var SSLOptions = {
	key: fs.readFileSync('ssl/digeocache-key.pem','utf8'),
	cert: fs.readFileSync('ssl/digeocache.crt','utf8')
}

http.createServer(app.callback()).listen(3000);
https.createServer(SSLOptions, app.callback()).listen(3001);

