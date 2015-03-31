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
var http    = require('http');
var https   = require('https');
var fs 	    = require('fs');
var bcrypt  = require('co-bcrypt');
var views 	= require('co-views');
var parse 	= require('co-body');
var swig 		= require('swig');
var render 	= views(__dirname + '/views', { map: { html: 'swig' }});

// Date Helpers
Date.prototype.getMonthName = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names[this.getMonth()];
};

Date.prototype.getMonthNameShort = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names_short[this.getMonth()];
};

Date.locale = {
    en: {
       month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
       month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

/* Modularized Implementations */
var App 		    = require('./App.js');
var Security 	  = require('./Security.js');
var Database 	  = require('./Database.js');
var Router      = require('./Router.js');
var Operations  = require('./Operations.js');
var 

/* Entity REST Implementations and Page Rendering */
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
var router 			= new Router();
var operations 	= new Operations();

/* Instantiate Validation and Error Handling */
var errors 			= new Errors();
var regex 			= new RegEx(errors);
var dates 			= new Dates(errors);
var validate 		= new Validate(operations,errors);
var error_pages 	= new ErrorPages(render);

/* Instantiate REST Operations and Page Rendering */
var admin_schema 	= new AdminSchema(regex,dates);
var user_schema 	= new UserSchema(regex,dates);
var geocache_schema = new GeocacheSchema(regex,dates);

var forms 			= new Forms(render, error_pages);
var views 			= new Views(render, error_pages);
var admin_pages = new AdminPages(database, forms, views, admin_schema, error_pages);
var user_pages 	= new UserPages(forms, views, user_schema);
var geocache_pages 	= new GeocachePages(forms, views, geocache_schema);

var admin 			= new Admin(database, bcrypt, parse, admin_schema, validate, errors, admin_pages, error_pages);
var user 			  = new User(database, bcrypt, parse, user_schema, validate, errors, user_pages);
var geocache 		= new Geocache(database, bcrypt, parse, geocache_schema, validate, errors, geocache_pages);

/* Admin API REST Routes --------------------------------------------------*/ 
router.post('/api/'+operations.ADMINS, admin.post);							            // Request New Admin
router.get('/api/'+operations.ADMINS, admin.get);							              // Request Admin List
router.put('/api/'+operations.ADMINS, admin.put);							              // Request Bulk Admin Update
router.del('/api/'+operations.ADMINS, admin.del);							              // Request Bulk Delete Admin
router.post('/api/'+operations.ADMINS+'/:id', error_pages.generic);			    // Error, N/A
router.get('/api/'+operations.ADMINS+'/:id', admin.get);					          // Request Admin w/ID
router.put('/api/'+operations.ADMINS+'/:id', admin.put);					          // Request Admin Update w/ID
router.del('/api/'+operations.ADMINS+'/:id', admin.del);					          // Request Delete Admin w/ID

/* Admin Page Routes */
router.get('/'+operations.ADMINS+'/create', admin_pages.create);			      // Admin Entity Creation Form
router.get('/'+operations.ADMINS+'/edit', admin_pages.edit);				        // Admin Entity Modification Form
router.get('/'+operations.ADMINS+'/destroy', admin_pages.destroy);			    // Admin Entity Destruction Form
router.get('/'+operations.ADMINS, admin_pages.view);						            // Admin Superview
/* ------------------------------------------------------------------------*/

/* User API REST Routes ----------------------------------------------------*/ 
router.post('/api/'+operations.USERS, user.post);							              // Request New User
router.get('/api/'+operations.USERS, user.get);								              // Requeset User List
router.put('/api/'+operations.USERS, user.put);							                // Request Bulk User Update
router.del('/api/'+operations.USERS, user.del);								              // Request Bulk Delete Admin
router.post('/api/'+operations.USERS+'/:id', error_pages.generic);			    // Error, N/A
router.get('/api/'+operations.USERS+'/:id', user.get);						          // Request User w/ID
router.put('/api/'+operations.USERS+'/:id', user.put);						          // Request User Update w/ID
router.del('/api/'+operations.USERS+'/:id', user.del);						          // Request Delete User w/ID

/* User Page Routes */
router.get('/'+operations.USERS+'/register', user_pages.register);			    // Register As A New User Form
router.get('/'+operations.USERS+'/profile', user_pages.profile);			      // Show Authenticated User Profile
router.get('/'+operations.USERS+'/profile/:username', user_pages.profile);	// Show User Profile w/username
router.get('/'+operations.USERS+'/edit', user_pages.edit);					        // Edit Authenticated User Profile
router.get('/'+operations.USERS+'/cancel', user_pages.cancel);				      // Cancel Authenticated User Account
router.get('/'+operations.USERS, user_pages.list);							            // Index of Users
/* ------------------------------------------------------------------------*/

/* Geocache API REST Routes -----------------------------------------------*/ 
router.post('/api/'+operations.GEOCACHES, geocache.post);					          // Request New Geocache
router.get('/api/'+operations.GEOCACHES, geocache.get);						          // Request Geocache List
router.put('/api/'+operations.GEOCACHES, geocache.put);						          // Request Bulk Geocache Update
router.del('/api/'+operations.GEOCACHES, geocache.del);						          // Request Bulk Delete Geocache
router.post('/api/'+operations.GEOCACHES+'/:id', error_pages.generic);	    // Error, N/A
router.get('/api/'+operations.GEOCACHES+'/:id', geocache.get);				      // Request Geocache w/ID
router.put('/api/'+operations.GEOCACHES+'/:id', geocache.put);				      // Request Geocache Update w/ID
router.del('/api/'+operations.GEOCACHES+'/:id', geocache.del);				      // Request Delete Geocache w/ID

/* Geocache Page Routes */
router.get('/'+operations.GEOCACHES+'/drop', geocache_pages.drop);			    // Drop Geocache Form
router.get('/'+operations.GEOCACHES+'/collect', geocache_pages.collect);    // Collect Geocache Form
router.get('/'+operations.GEOCACHES+'/edit', geocache_pages.edit);			    // Edit Geocaches of Authenticated User
router.get('/'+operations.GEOCACHES+'/remove', geocache_pages.remove);	    // Remove Geocache Form
router.get('/'+operations.GEOCACHES+'/:id', geocache_pages.show);			      // Show Geocache w/ID
router.get('/'+operations.GEOCACHES, geocache_pages.list);                  // Index of Geocaches
/* ------------------------------------------------------------------------*/

//TODO: Product, Transactions, Friends, Image, Audio, Video, Articles, Comments, Subcomments
//TODO: Derived/Compound Queries Formed From Relationships -> Feed, Mutual Friends, Offers, Followings

router.get('/', function *(next) {
	this.body = "hello world";
});

/* Error Pages */
router.get('/'+operations.ERROR, error_pages.generic);

/* Include All Routes and Start Application */
app.use(router.routes()).use(router.allowedMethods());
// app.listen(3000);

// SSL Options
var SSLOptions = {
	key: fs.readFileSync('ssl/digeocache-key.pem','utf8'),
	cert: fs.readFileSync('ssl/digeocache.crt','utf8')
}

http.createServer(app.callback()).listen(3000);
https.createServer(SSLOptions, app.callback()).listen(3001);

